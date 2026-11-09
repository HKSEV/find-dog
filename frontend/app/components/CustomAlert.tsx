"use client";

import * as S from "@/assets/css/Style.styles";
import {
  AlertContent,
  AlertSummary,
  AlertIconCircle,
  AlertTextGroup,
  AlertMessage,
  ConfirmButton,
  ErrorAlertIcon,
  SuccessAlertIcon
} from "@/assets/css/modal/CustomAlert.styles";

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
      <AlertContent>
        <AlertSummary>
          <AlertIconCircle className="icon-circle" $error={type === "error"}>
            {type === "error" ? <ErrorAlertIcon/> : <SuccessAlertIcon/>}
          </AlertIconCircle>
          <AlertTextGroup className="text-group">
            <AlertMessage>{message}</AlertMessage>
          </AlertTextGroup>
        </AlertSummary>

        {/* 버튼 색상을 브랜드 컬러(브라운)로 맞추거나 필요시 기본 스타일 사용 */}
        <ConfirmButton onClick={onConfirm}>확인</ConfirmButton>
      </AlertContent>
    </S.ModalOverlay>
  );
};
