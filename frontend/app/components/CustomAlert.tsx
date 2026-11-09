"use client";
import * as S from "@/assets/css/Style.styles";

// 아이콘 활용

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
        <S.AlertSummary>
          <S.AlertIconCircle className="icon-circle" $error={type === "error"}>
            {type === "error" ? <S.ErrorAlertIcon/> : <S.SuccessAlertIcon/>}
          </S.AlertIconCircle>
          <S.AlertTextGroup className="text-group">
            <S.AlertMessage>{message}</S.AlertMessage>
          </S.AlertTextGroup>
        </S.AlertSummary>

        {/* 버튼 색상을 브랜드 컬러(브라운)로 맞추거나 필요시 기본 스타일 사용 */}
        <S.CustomAlertConfirmButton onClick={onConfirm}>확인</S.CustomAlertConfirmButton>
      </S.AlertContent>
    </S.ModalOverlay>
  );
};
