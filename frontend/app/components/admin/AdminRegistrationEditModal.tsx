"use client";

import { ChangeEvent, FormEvent, useEffect, useId, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { FiX } from "react-icons/fi";
import { AppDispatch } from "../../store/store";
import { createAdminRegistration, fetchAdminRegistrations, updateAdminRegistration } from "../../redux/registrationAdminSlice";
import useAdminModal from "../contexts/AdminModalContext";
import AdminVolunteerApplicants from "./AdminVolunteerApplicants";
import { AdminCreateKind, AdminRegistrationKind, AdminRegistrationRow } from "@/lib/adminRegistrations";
import { getRegistrationEditValues, getRegistrationThumbnail, registrationEditFields } from "@/lib/adminRegistrationEditor";
import { lockModalScroll } from "@/lib/modalScrollLock";
import { toImageUrl } from "@/app/shelter/animalFormat";
import * as S from "@/assets/css/Style.styles";

type AdminRegistrationEditModalProps = {onClose: () => void} & (
  | {kind: AdminRegistrationKind; row: AdminRegistrationRow; mode?: "edit"}
  | {kind: AdminCreateKind; row?: never; mode: "create"}
);

const housingLabels: Record<string, string> = {APARTMENT: "아파트", HOUSE: "단독 주택", OTHER: "기타"};

export default function AdminRegistrationEditModal(props: AdminRegistrationEditModalProps) {
  const {kind, row, onClose} = props;
  const creating = props.mode === "create";
  const isVolunteer = kind === "volunteer";
  const isAdoption = kind === "adoption";
  const source = row?.source ?? (isVolunteer ? "volunteers" : "needHelps");
  const readOnly = isAdoption && row?.record.status !== "RECEIVED" && row?.record.status !== "FORWARDED";
  const title = isAdoption
    ? "입양 신청서"
    : isVolunteer
      ? (creating ? "봉사 모집 등록" : "봉사 모집 상세")
      : creating ? "도움 요청 등록" : `${row?.category} 정보 수정`;
  const dispatch = useDispatch<AppDispatch>();
  const {openAlertModal} = useAdminModal();
  const [values, setValues] = useState<Record<string, string>>(() => {
    if (!row) return isVolunteer ? {closed: "false"} : {};
    const initial = getRegistrationEditValues(row);
    return isAdoption ? {...initial, status: ""} : initial;
  });
  const [imageMode, setImageMode] = useState<"LINK" | "UPLOAD">("LINK");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const previewRef = useRef("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();
  const fields = readOnly ? [] : registrationEditFields[source].filter(({when}) => !when || when(values));
  const imageUrl = source === "shelterAnimals" && imageMode === "UPLOAD"
    ? filePreview
    : toImageUrl(values.imageUrl || values.thumbnailUrl);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const unlock = lockModalScroll();
    dialog.querySelector<HTMLElement>("input, select, textarea")?.focus();
    return () => {
      if (dialog.open) dialog.close();
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      unlock();
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target;
    setValues((previous) => {
      const next = {...previous, [name]: value};
      if (name === "youtubeUrl") {
        const thumbnail = getRegistrationThumbnail(value);
        if (thumbnail) next.thumbnailUrl = thumbnail;
      };
      return next;
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = file ? URL.createObjectURL(file) : "";
    setImageFile(file);
    setFilePreview(previewRef.current);
  };

  const handleImageModeChange = (mode: "LINK" | "UPLOAD") => {
    setImageMode(mode);
    if (mode === "LINK") {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
      previewRef.current = "";
      setImageFile(null);
      setFilePreview("");
    };
  };

  const handleClose = () => {
    if (savingRef.current) return;
    dialogRef.current?.close();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (readOnly || savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    const result = props.mode === "create"
      ? await dispatch(createAdminRegistration({kind: props.kind, values}))
      : await dispatch(updateAdminRegistration({kind, row: props.row, values, imageFile: imageMode === "UPLOAD" ? imageFile : null}));
    savingRef.current = false;
    setIsSaving(false);
    if (createAdminRegistration.fulfilled.match(result) || updateAdminRegistration.fulfilled.match(result)) {
      if (creating || isAdoption) dispatch(fetchAdminRegistrations(kind));
      dialogRef.current?.close();
      onClose();
      openAlertModal(creating ? "등록이 완료되었습니다." : "수정이 완료되었습니다.", undefined, {variant: "success"});
    } else {
      openAlertModal(result.payload || "저장하지 못했습니다. 다시 시도해 주세요.", undefined, {variant: "error"});
    };
  };

  return (
    <S.RegistrationEditDialog
    ref={dialogRef}
    aria-modal="true"
    aria-labelledby={`${id}-title`}
    aria-describedby={`${id}-description`}
    onCancel={(event) => {
      event.preventDefault();
      handleClose();
    }}>
      <S.RegistrationEditHeader>
        <div>
          <S.AdminSettingCardTitle id={`${id}-title`}>{title}</S.AdminSettingCardTitle>
          <p id={`${id}-description`}>
            {isAdoption && !readOnly
              ? "입양을 확정하면 동물은 입양 완료로 바뀌고, 다른 진행 중 신청은 입양 불가로 처리됩니다."
              : readOnly ? "처리가 끝난 신청서입니다." : "내용을 확인하고 저장해 주세요."}
          </p>
        </div>
        <S.AdminSettingSecondaryButton type="button" aria-label="닫기" disabled={isSaving} onClick={handleClose}>
          <FiX aria-hidden="true"/>
        </S.AdminSettingSecondaryButton>
      </S.RegistrationEditHeader>
      <S.AdminSettingCardBody>
        <S.AdminSettingForm onSubmit={handleSubmit} aria-busy={isSaving}>
          {isAdoption && row && (
            <S.RegistrationEditFields as="dl">
              {[
                ["보호 동물", `${row.cells[0]} (${row.cells[1]})`],
                ["신청자", row.record.applicantName],
                ["연락처", row.record.applicantPhone],
                ["거주 형태", housingLabels[String(row.record.housingType)]],
                ["반려 경험", row.record.hasPetExperience ? "있음" : "없음"],
                ["가족 동의", row.record.familyAgreed ? "동의" : "미동의"],
                ["현재 상태", row.category],
                ["처리 사유", row.record.statusReason],
                ["신청 내용", row.record.message]
              ].map(([label, value]) => (
                <S.RegistrationEditField key={String(label)} $wide={label === "신청 내용"}>
                  <dt>{String(label)}</dt>
                  <dd>{value ? String(value) : "—"}</dd>
                </S.RegistrationEditField>
              ))}
            </S.RegistrationEditFields>
          )}
          <S.RegistrationEditFields>
            {fields.map((field) => {
              const fieldId = `${id}-${field.name}`;
              const value = values[field.name] || "";
              return (
                <S.RegistrationEditField key={field.name} $wide={field.wide}>
                  {field.type === "radio" ? (
                    <S.AdminSettingChoiceField disabled={isSaving}>
                      <S.AdminSettingLegend>{field.label}</S.AdminSettingLegend>
                      <S.AdminSettingOptions>
                        {field.options?.map((option) => (
                          <S.AdminSettingOption key={option.value}>
                            <input type="radio" name={field.name} value={option.value} checked={value === option.value} onChange={handleChange} required/>
                            {option.label}
                          </S.AdminSettingOption>
                        ))}
                      </S.AdminSettingOptions>
                    </S.AdminSettingChoiceField>
                  ) : field.type === "image" ? (
                    <S.AdminSettingChoiceField disabled={isSaving}>
                      <S.AdminSettingLegend>{field.label}</S.AdminSettingLegend>
                      <S.AdminSettingFields>
                        <S.AdminSettingOptions>
                          <S.AdminSettingOption>
                            <input type="radio" name="editImageMode" checked={imageMode === "LINK"} onChange={() => handleImageModeChange("LINK")}/>
                            URL(링크)로 입력
                          </S.AdminSettingOption>
                          <S.AdminSettingOption>
                            <input type="radio" name="editImageMode" checked={imageMode === "UPLOAD"} onChange={() => handleImageModeChange("UPLOAD")}/>
                            새 사진 업로드
                          </S.AdminSettingOption>
                        </S.AdminSettingOptions>
                        <S.AdminSettingField>
                          <S.AdminSettingLabel htmlFor={fieldId}>{imageMode === "LINK" ? "사진 URL / 저장 경로" : "사진 파일"}</S.AdminSettingLabel>
                          {imageMode === "LINK" ? (
                            <S.AdminSettingInput id={fieldId} name={field.name} value={value} maxLength={field.maxLength} onChange={handleChange} required/>
                          ) : (
                            <S.AdminSettingInput id={fieldId} type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/avif,image/bmp" onChange={handleFileChange} required/>
                          )}
                        </S.AdminSettingField>
                      </S.AdminSettingFields>
                    </S.AdminSettingChoiceField>
                  ) : (
                    <S.AdminSettingField>
                      <S.AdminSettingLabel htmlFor={fieldId}>{field.label}</S.AdminSettingLabel>
                      {field.type === "select" ? (
                        <S.AdminSettingSelect id={fieldId} name={field.name} value={value} disabled={isSaving} onChange={handleChange} required={!field.optional}>
                          <option value="">선택해 주세요</option>
                          {value && !field.options?.some((option) => option.value === value) && <option value={value}>{value}</option>}
                          {field.options?.filter(({value}) => !isAdoption || value !== row?.record.status).map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </S.AdminSettingSelect>
                      ) : field.type === "textarea" ? (
                        <S.AdminSettingTextarea id={fieldId} name={field.name} value={value} rows={5} disabled={isSaving} onChange={handleChange} required={!field.optional}/>
                      ) : (
                        <S.AdminSettingInput
                        id={fieldId}
                        name={field.name}
                        type={field.type || "text"}
                        value={value}
                        min={field.min ?? (field.type === "number" ? 0 : undefined)}
                        max={field.max}
                        step={field.step ?? (field.type === "number" ? "0.1" : undefined)}
                        maxLength={field.maxLength}
                        disabled={isSaving}
                        onChange={handleChange}
                        required={!field.optional}/>
                      )}
                    </S.AdminSettingField>
                  )}
                </S.RegistrationEditField>
              );
            })}
          </S.RegistrationEditFields>
          {imageUrl && (
            <S.AdminSettingPreview>
              <S.AdminSettingPreviewImage src={imageUrl} alt="수정 이미지 미리보기" width={0} height={0} unoptimized/>
            </S.AdminSettingPreview>
          )}
          <S.RegistrationEditActions>
            <S.AdminSettingSecondaryButton type="button" disabled={isSaving} onClick={handleClose}>
              {readOnly ? "닫기" : "취소"}
            </S.AdminSettingSecondaryButton>
            {!readOnly && <S.AdminSettingSubmit type="submit" disabled={isSaving}>{isSaving ? "저장 중..." : "저장"}</S.AdminSettingSubmit>}
          </S.RegistrationEditActions>
        </S.AdminSettingForm>
        {isVolunteer && row && <AdminVolunteerApplicants postId={row.id}/>}
      </S.AdminSettingCardBody>
    </S.RegistrationEditDialog>
  );
};
