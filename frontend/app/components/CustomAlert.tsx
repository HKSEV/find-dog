"use client";
import React from "react";
import * as S from "@/assets/css/style.styles";
import { CheckCircle2, AlertCircle } from "lucide-react";
import styled from "styled-components";

const AlertContent = styled(S.ModalContent)`
  && {
    max-width: 320px;
    text-align: center;
    padding: 30px 24px;
  }
`;

const AlertSummary = styled(S.AlertInfo)`
  && {
    margin-bottom: 24px;
    flex-direction: column;
  }
`;

const AlertIconCircle = styled.div<{$backgroundColor?: React.CSSProperties["backgroundColor"]}>`
  && {
    width: 48px;
    height: 48px;
    background-color: ${({$backgroundColor}) => $backgroundColor};
  }
`;

const AlertTextGroup = styled.div`
  && {
    margin-top: 12px;
    align-items: center;
  }
`;

const AlertMessage = styled.strong`
  &&& {
    font-size: 1.1rem;
    word-break: keep-all;
    line-height: 1.4;
  }
`;

const ConfirmButton = styled(S.SubmitButton)`
  && {
    background-color: #8a4e4b;
    margin: 0;
    padding: 12px;
  }
`;
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
          <AlertIconCircle className="icon-circle" $backgroundColor={type === "error" ? "#ffeeee" : "#f8f5f4"}>
            {type === "error" ? <AlertCircle color="#ff6b6b" size={24}/> : <CheckCircle2 color="#8a4e4b" size={24}/>}
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
