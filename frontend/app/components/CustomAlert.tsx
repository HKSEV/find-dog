"use client";
import * as S from "@/assets/css/Style.styles";

// 💡 글자만 있는 알림 창 (오류 안내용)

interface CustomAlertProps {
  isOpen: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onConfirm: () => void;
}

export const CustomAlert = ({isOpen, message, type = "info", onConfirm}: CustomAlertProps) => {
  if (!isOpen) return null;

  return (
    <S.ModalOverlay>
      {/* 알림창 크기에 맞게 maxWidth를 줄이고 가운데 정렬 적용 */}
      <S.AlertContent>
        {/* 💡 아이콘 없이 문장만 (초록 체크·빨간 느낌표 아이콘은 뺌). 성공 알림은 토스트로 옮겼고, 이 창은 오류 안내에만 씀 */}
        <S.AlertSummary>
          <S.AlertTextGroup className="text-group">
            <S.AlertMessage role={type === "error" ? "alert" : undefined}>{message}</S.AlertMessage>
          </S.AlertTextGroup>
        </S.AlertSummary>

        {/* 버튼 색상을 브랜드 컬러(브라운)로 맞추거나 필요시 기본 스타일 사용 */}
        <S.CustomAlertConfirmButton onClick={onConfirm}>확인</S.CustomAlertConfirmButton>
      </S.AlertContent>
    </S.ModalOverlay>
  );
};
