"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchMissingPost } from "../../redux/missingSlice";
import { toImageUrl } from "../../shelter/animalFormat";
import { fetchMyAccount } from "../../mypage/accountApi";
import { ageText, formatWhen, genderText, nearText, petNameOf, placeLabel, weightText, whenLabel } from "../missingFormat";
import { DEFAULT_CROP, FlyerCrop, NaturalSize, cropStyle } from "./flyerCrop";
import { FlyerPhotoDrag, FlyerZoomBar } from "./FlyerPhotoControls";
import { shareUrl } from "@/lib/share";

import Header from "@/app/components/Header";
import { showToast } from "@/app/components/Toast";
import * as S from "@/assets/css/Style.styles";

// 휴대폰 번호 보기 좋게 (01012345678 -> 010-1234-5678)
const formatPhone = (phone: string) => {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return phone;
};

// 전단지에 쓸 사진 주소: 이미지 저장 때 사진을 다시 받아야 해서,
// 예전에 받아 둔 사진(다른 사이트 허용 표시 없음)을 쓰지 않게 주소를 살짝 바꿈
const flyerPhotoUrl = (url?: string) => {
  const photo = toImageUrl(url);
  return photo ? `${photo}${photo.includes("?") ? "&" : "?"}flyer=1` : undefined;
};

// 사진을 data URL로 바꿔 둠 (Safari는 이미지 저장 때 바깥 주소 사진을 빼먹는 일이 있어서)
const toDataUrl = async (url: string) => {
  const blob = await (await fetch(url, {mode: "cors"})).blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
};

// 💡 실종·목격 전단지 (내 글만). A4로 인쇄하거나 PDF·이미지로 저장
//    연락처가 크게 들어가서 글쓴이만 만들 수 있음 (번호는 내 정보에서 가져옴)
export default function MissingFlyer({id}: {id: number}) {
  const dispatch = useDispatch<AppDispatch>();
  const {detail, detailError} = useSelector((state: RootState) => state.missing);
  const post = detail?.id === id ? detail : null;

  const [phone, setPhone] = useState<string | null>(null); // null: 불러오는 중
  const [qr, setQr] = useState("");
  const [photoData, setPhotoData] = useState<{src: string; data: string} | null>(null); // 미리 받아 둔 사진
  const [scale, setScale] = useState(0.4);
  const [saving, setSaving] = useState(false);
  const [crop, setCrop] = useState<FlyerCrop>(DEFAULT_CROP); // 사진 고르기·맞추기 (전단지에만)
  const [natural, setNatural] = useState<{src: string; size: NaturalSize} | null>(null); // 고른 사진의 원래 크기
  const frameRef = useRef<HTMLDivElement>(null);
  const photoBoxRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [photoPx, setPhotoPx] = useState(S.FLYER_PHOTO_MAX); // 전단지 사진 칸 크기 (글이 길면 줄어듦)
  const [photoBox, setPhotoBox] = useState<{left: number; top: number; size: number} | null>(null); // 전단지 안 사진 칸 (줄이기 전 px)
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (Number.isFinite(id)) dispatch(fetchMissingPost(id));
    fetchMyAccount()
      .then((me) => setPhone(me.phone ?? ""))
      .catch(() => setPhone(""));
  }, [dispatch, id]);

  // QR: 이 글의 상세 주소 (찍으면 최신 사진·소식을 볼 수 있게)
  useEffect(() => {
    if (!post) return;
    QRCode.toDataURL(shareUrl(`/missing/detail/?id=${post.id}`), {margin: 1, width: 300})
      .then(setQr)
      .catch(() => setQr(""));
  }, [post]);

  // 사진을 미리 data URL로 받아 둠 (못 받으면 주소 그대로 씀)
  const photoSrc = post ? flyerPhotoUrl(post.mediaUrls?.[crop.index] ?? post.mediaUrls?.[0]) : undefined;
  useEffect(() => {
    if (!photoSrc) return;
    let alive = true;
    toDataUrl(photoSrc)
      .then((data) => alive && setPhotoData({src: photoSrc, data}))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [photoSrc]);

  // 고른 사진의 원래 크기 (정사각 칸 안 위치·확대 계산에 씀)
  useEffect(() => {
    if (!photoSrc) return;
    let alive = true;
    const image = new Image();
    image.onload = () => alive && setNatural({src: photoSrc, size: {width: image.naturalWidth, height: image.naturalHeight}});
    image.src = photoSrc;
    return () => {
      alive = false;
    };
  }, [photoSrc]);

  // 화면 폭에 맞춰 전단지를 줄여서 보여줌
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / S.FLYER_WIDTH));
    observer.observe(frame);
    return () => observer.disconnect();
  }, [post]);

  // 💡 사진 칸 크기 정하기: 본문(사진·이름·칸·장소·특징)이 A4 안에 들어가게 남는/모자란 만큼 사진을 키우거나 줄임
  //    (300~400px). 그린 뒤 한 프레임 뒤에 재서 맞춤
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const id = requestAnimationFrame(() => {
      const last = body.lastElementChild as HTMLElement | null;
      if (!last) return;
      const used = last.offsetTop + last.offsetHeight - body.offsetTop;
      const next = Math.round(Math.min(S.FLYER_PHOTO_MAX, Math.max(S.FLYER_PHOTO_MIN, photoPx + body.clientHeight - used)));
      if (Math.abs(next - photoPx) >= 1) setPhotoPx(next);
    });
    return () => cancelAnimationFrame(id);
  });

  // 사진 칸 위치·크기 재기 (사진 맞추기 도구를 그 위에 겹치려고). 글이 길면 칸이 줄어서 크기가 바뀔 때마다 다시 잼
  useEffect(() => {
    const box = photoBoxRef.current;
    if (!box) return;
    const observer = new ResizeObserver(() => setPhotoBox({left: box.offsetLeft, top: box.offsetTop, size: box.offsetWidth}));
    observer.observe(box);
    return () => observer.disconnect();
  }, [post, natural]);

  const handleSave = async () => {
    if (!sheetRef.current || !post) return;
    setSaving(true);
    try {
      const {toPng} = await import("html-to-image");
      // skipFonts: 웹 글꼴(Pretendard)은 글자 묶음별 파일이 200개가 넘어서 넣지 않고 기기 한글 글꼴로 그림
      const options = {pixelRatio: 2, backgroundColor: "#ffffff", width: S.FLYER_WIDTH, height: S.FLYER_HEIGHT, skipFonts: true};
      // 글꼴을 못 넣으면(다른 사이트 글꼴 파일) 기본 글꼴로 다시 시도
      const draw = () => toPng(sheetRef.current!, options);
      // Safari는 첫 번째 그림에서 사진이 빠지는 일이 있어서 한 번 더 그린 결과를 씀
      await draw();
      const dataUrl = await draw();
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${post.type === "FOUND" ? "목격" : "실종"}전단지_${post.breed || "강아지"}.png`;
      link.click();
    } catch {
      showToast("이미지로 저장하지 못했어요. 인쇄·PDF 저장을 이용해 주세요.");
    } finally {
      setSaving(false);
    }
  };

  const header = <Header title="전단지 만들기"/>;

  if (!post) {
    return (
      <S.AppWrapper>
        <S.Container>
          {header}
          <S.HeaderOffset/>
          <S.AdoptEmpty>{detailError === "NOT_FOUND" ? "글을 찾을 수 없어요" : detailError ? "글을 불러오지 못했어요" : "불러오는 중이에요"}</S.AdoptEmpty>
        </S.Container>
      </S.AppWrapper>
    );
  };

  if (!post.mine) {
    return (
      <S.AppWrapper>
        <S.Container>
          {header}
          <S.HeaderOffset/>
          <S.WriteLoginNotice>
            <p>전단지에는 연락처가 들어가서<br/>내가 쓴 글만 만들 수 있어요</p>
            <Link href={`/missing/detail/?id=${post.id}`}>글로 돌아가기</Link>
          </S.WriteLoginNotice>
        </S.Container>
      </S.AppWrapper>
    );
  };

  const found = post.type === "FOUND";
  const name = found ? "" : petNameOf(post); // 이름은 잃어버린 아이만
  const photoForFlyer = photoData?.src === photoSrc ? photoData?.data : photoSrc;
  const photoSize = natural && natural.src === photoSrc ? natural.size : null;
  // 💡 생김새·때는 이름표 붙은 칸으로 (이름이 없으면 품종이 제목이라 칸에서 뺌)
  const traits = [
    {label: "품종", value: name ? (post.breed || "모름") : ""},
    {label: "성별", value: genderText(post.gender).replace("성별 ", "")},
    {label: "나이", value: ageText(post.age)},
    {label: "몸무게", value: weightText(post.weight)},
    {label: "털색", value: post.color?.trim() ?? ""},
    {label: whenLabel(post.type).replace(/^(잃어버린|발견한) /, ""), value: formatWhen(post.occurredAt, post.occurredTime)}
  ].filter((trait) => trait.value);
  const facts = [
    {label: placeLabel(post.type).replace(/^(잃어버린|발견한) /, ""), value: [nearText(post.rescueLocation), post.placeArea ? `(${post.placeArea})` : ""].filter(Boolean).join(" ")},
    {label: "특징", value: post.content?.trim() ?? ""}
  ].filter((fact) => fact.value);

  return (
    <S.AppWrapper>
      <S.FlyerPrintStyle/>
      <S.Container>
        {header}
        <S.HeaderOffset/>
        <S.FlyerPage>
          <S.FlyerGuide>
            A4 한 장으로 인쇄하거나 PDF·이미지로 저장할 수 있어요. 연락처는 내 정보의 휴대폰 번호가 들어가요.
          </S.FlyerGuide>

          <S.FlyerFrame ref={frameRef} $height={Math.round(S.FLYER_HEIGHT * scale)}>
            <S.FlyerScale data-flyer-scale style={{transform: `scale(${scale})`}}>
              <S.FlyerSheet ref={sheetRef} data-flyer $found={found}>
                <S.FlyerHead>
                  <h1>{found ? "주인을 찾습니다" : "강아지를 찾습니다"}</h1>
                </S.FlyerHead>

                <S.FlyerBody ref={bodyRef}>
                  {photoForFlyer ? (
                    <S.FlyerPhotoBox ref={photoBoxRef} style={{width: photoPx, height: photoPx}}>
                      {photoSize && <S.FlyerCropImg src={photoForFlyer} alt="" crossOrigin="anonymous" style={cropStyle(crop, photoSize)}/>}
                    </S.FlyerPhotoBox>
                  ) : (
                    <S.FlyerPhotoEmpty>사진 없음</S.FlyerPhotoEmpty>
                  )}
                  <S.FlyerName $hasName={Boolean(name)}>{name || post.breed || "품종 모름"}</S.FlyerName>
                  {traits.length > 0 && (
                    <S.FlyerTraits>
                      {traits.map((trait) => (
                        <div key={trait.label}>
                          <dt>{trait.label}</dt>
                          <dd>{trait.value}</dd>
                        </div>
                      ))}
                    </S.FlyerTraits>
                  )}
                  <S.FlyerFacts>
                    {facts.map((fact) => (
                      <React.Fragment key={fact.label}>
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </React.Fragment>
                    ))}
                  </S.FlyerFacts>
                </S.FlyerBody>

                <S.FlyerFoot>
                  <S.FlyerContact>
                    <p>{found ? "보호자분 연락 주세요" : "보셨다면 연락 주세요"}</p>
                    <strong>{phone ? formatPhone(phone) : phone === null ? "불러오는 중" : "연락처 없음"}</strong>
                    <small>어서찾아주개 · 실종·제보 게시판</small>
                  </S.FlyerContact>
                  {qr && (
                    <S.FlyerQr>
                      {/* eslint-disable-next-line @next/next/no-img-element -- QR은 바로 만든 data URL이라 next/image가 필요 없음 */}
                      <img src={qr} alt="글 상세로 가는 QR 코드"/>
                      <figcaption>찍으면 최신 소식</figcaption>
                    </S.FlyerQr>
                  )}
                </S.FlyerFoot>
              </S.FlyerSheet>
            </S.FlyerScale>

            {/* 💡 사진 위에 겹쳐 바로 끌기 (전단지 밖이라 인쇄·저장에는 안 찍힘) */}
            {photoForFlyer && photoBox && (
              <FlyerPhotoDrag
              rect={{left: photoBox.left * scale, top: photoBox.top * scale, size: photoBox.size * scale}}
              size={photoSize}
              crop={crop}
              onChange={setCrop}/>
            )}
          </S.FlyerFrame>

          {/* 💡 전단지 아래 사진 크기 조절 줄 */}
          {photoForFlyer && (
            <FlyerZoomBar
            photoCount={post.mediaUrls?.length ?? 0}
            size={photoSize}
            crop={crop}
            onChange={setCrop}/>
          )}
        </S.FlyerPage>

        <S.DetailActionBar>
          <S.MissingOwnerButton type="button" onClick={handleSave} disabled={saving}>
            <S.FlyerDownloadIcon aria-hidden="true"/>{saving ? "저장하는 중..." : "이미지 저장"}
          </S.MissingOwnerButton>
          <S.DetailApplyButton type="button" onClick={() => window.print()}>
            <S.FlyerPrintIcon aria-hidden="true"/>인쇄·PDF 저장
          </S.DetailApplyButton>
        </S.DetailActionBar>
      </S.Container>
    </S.AppWrapper>
  );
};
