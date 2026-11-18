"use client";

import React, { useEffect } from "react";
import { canNativeShare, copyLink, nativeShare, shareToKakao, ShareContent } from "@/lib/share";
import { showToast } from "./Toast";
import * as S from "@/assets/css/Style.styles";

// 💡 공유 시트: 카카오톡 / 링크 복사 / (휴대폰에서) 다른 앱으로
export default function ShareSheet({content, note, onClose}: {content: ShareContent; note?: string; onClose: () => void}) {
  // 공유 버튼을 누른 뒤에만 그려지는 시트라 (서버 렌더링 없음) 바로 확인해도 됨
  const native = canNativeShare();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleKakao = async () => {
    try {
      await shareToKakao(content);
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "카카오톡 공유를 열지 못했어요.");
    }
  };

  const handleCopy = async () => {
    try {
      await copyLink(content.path);
      showToast("링크를 복사했어요.");
      onClose();
    } catch {
      showToast("링크를 복사하지 못했어요. 주소창의 주소를 복사해 주세요.");
    }
  };

  const handleNative = async () => {
    try {
      await nativeShare(content);
      onClose();
    } catch (error) {
      // 사용자가 공유창을 닫은 경우(AbortError)는 그냥 둠
      if (!(error instanceof DOMException && error.name === "AbortError")) showToast("공유하지 못했어요.");
    }
  };

  return (
    <S.ShareSheetOverlay onClick={onClose}>
      <S.ShareSheet role="dialog" aria-modal="true" aria-labelledby="share-sheet-title" onClick={(e) => e.stopPropagation()}>
        <S.ShareSheetHandle aria-hidden="true"/>
        <S.ShareSheetTitle id="share-sheet-title">공유하기</S.ShareSheetTitle>
        <S.ShareSheetNote>{note ?? "많이 퍼질수록 빨리 찾을 수 있어요."}</S.ShareSheetNote>
        <S.ShareOptions>
          <S.ShareOption type="button" onClick={handleKakao}>
            <S.ShareOptionCircle $tone="kakao">
              <S.ShareKakaoMark viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#191919" d="M12 3.5c-5.1 0-9.2 3.2-9.2 7.2 0 2.6 1.7 4.8 4.3 6.1l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.4 0 .7.1 1.1.1 5.1 0 9.2-3.2 9.2-7.2S17.1 3.5 12 3.5z"/>
              </S.ShareKakaoMark>
            </S.ShareOptionCircle>
            카카오톡
          </S.ShareOption>
          <S.ShareOption type="button" onClick={handleCopy}>
            <S.ShareOptionCircle $tone="gray"><S.ShareLinkIcon aria-hidden="true"/></S.ShareOptionCircle>
            링크 복사
          </S.ShareOption>
          {native && (
            <S.ShareOption type="button" onClick={handleNative}>
              <S.ShareOptionCircle $tone="gray"><S.ShareMoreIcon aria-hidden="true"/></S.ShareOptionCircle>
              다른 앱으로
            </S.ShareOption>
          )}
        </S.ShareOptions>
        <S.ShareCancelButton type="button" onClick={onClose}>닫기</S.ShareCancelButton>
      </S.ShareSheet>
    </S.ShareSheetOverlay>
  );
};
