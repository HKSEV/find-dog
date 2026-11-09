"use client";

import { ChangeEvent, FormEvent, useEffect, useId, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { FiX } from "react-icons/fi";
import { AppDispatch } from "../../store/store";
import { updateAdminRegistration } from "../../redux/registrationAdminSlice";
import useAdminModal from "../contexts/AdminModalContext";
import { AdminRegistrationKind, AdminRegistrationRow } from "@/lib/adminRegistrations";
import { getRegistrationEditValues, getRegistrationThumbnail, registrationEditFields } from "@/lib/adminRegistrationEditor";
import { lockModalScroll } from "@/lib/modalScrollLock";
import * as S from "@/assets/css/Style.styles";

interface AdminRegistrationEditModalProps {
  kind: AdminRegistrationKind;
  row: AdminRegistrationRow;
  onClose: () => void;
}

export default function AdminRegistrationEditModal({kind, row, onClose}: AdminRegistrationEditModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {openAlertModal} = useAdminModal();
  const [values, setValues] = useState<Record<string, string>>(() => getRegistrationEditValues(row));
  const [imageMode, setImageMode] = useState<"LINK" | "UPLOAD">("LINK");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const previewRef = useRef("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();
  const fields = registrationEditFields[row.source].filter(({when}) => !when || when(values));
  const imageUrl = row.source === "shelterAnimals" && imageMode === "UPLOAD"
    ? filePreview
    : values.imageUrl || values.thumbnailUrl;

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
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);
    const result = await dispatch(updateAdminRegistration({
      kind, row, values, imageFile: imageMode === "UPLOAD" ? imageFile : null
    }));
    savingRef.current = false;
    setIsSaving(false);
    if (updateAdminRegistration.fulfilled.match(result)) {
      dialogRef.current?.close();
      onClose();
      openAlertModal("수정이 완료되었습니다.", undefined, {variant: "success"});
    } else {
      openAlertModal(result.payload || "수정하지 못했습니다. 다시 시도해 주세요.", undefined, {variant: "error"});
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
          <S.AdminSettingCardTitle id={`${id}-title`}>{row.category} 정보 수정</S.AdminSettingCardTitle>
          <p id={`${id}-description`}>등록된 정보를 확인하고 변경 사항을 저장해 주세요.</p>
        </div>
        <S.AdminSettingSecondaryButton type="button" aria-label="수정 창 닫기" disabled={isSaving} onClick={handleClose}>
          <FiX aria-hidden="true"/>
        </S.AdminSettingSecondaryButton>
      </S.RegistrationEditHeader>
      <S.AdminSettingCardBody>
        <S.AdminSettingForm onSubmit={handleSubmit} aria-busy={isSaving}>
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
                          {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </S.AdminSettingSelect>
                      ) : field.type === "textarea" ? (
                        <S.AdminSettingTextarea id={fieldId} name={field.name} value={value} rows={5} disabled={isSaving} onChange={handleChange} required={!field.optional}/>
                      ) : (
                        <S.AdminSettingInput
                        id={fieldId}
                        name={field.name}
                        type={field.type || "text"}
                        value={value}
                        min={field.type === "number" ? 0 : undefined}
                        step={field.type === "number" ? "0.1" : undefined}
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
            <S.AdminSettingSecondaryButton type="button" disabled={isSaving} onClick={handleClose}>취소</S.AdminSettingSecondaryButton>
            <S.AdminSettingSubmit type="submit" disabled={isSaving}>{isSaving ? "저장 중..." : "수정 내용 저장"}</S.AdminSettingSubmit>
          </S.RegistrationEditActions>
        </S.AdminSettingForm>
      </S.AdminSettingCardBody>
    </S.RegistrationEditDialog>
  );
};
