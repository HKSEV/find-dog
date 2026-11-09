"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

import styled from "styled-components";
import { ModalContent, SubmitButton } from "@/assets/css/modal/ModalBase.styles";
import { AlertInfo } from "@/assets/css/common/Alert.styles";

export const AlertContent = styled(ModalContent)`
  && {
    max-width: 320px;
    text-align: center;
    padding: 30px 24px;
  }
`;

export const AlertSummary = styled(AlertInfo)`
  && {
    margin-bottom: 24px;
    flex-direction: column;
  }
`;

export const AlertIconCircle = styled.div<{$error: boolean}>`
  && {
    width: 48px;
    height: 48px;
    background-color: ${({$error}) => ($error ? "#FFEEEE" : "#F8F5F4")};
  }
`;

export const ErrorAlertIcon = styled(AlertCircle).attrs({color: "#FF6B6B", size: 24})``;
export const SuccessAlertIcon = styled(CheckCircle2).attrs({color: "#8A4E4B", size: 24})``;

export const AlertTextGroup = styled.div`
  && {
    margin-top: 12px;
    align-items: center;
  }
`;

export const AlertMessage = styled.strong`
  &&& {
    font-size: 1.1rem;
    word-break: keep-all;
    line-height: 1.4;
  }
`;

export const CustomAlertConfirmButton = styled(SubmitButton)`
  && {
    background-color: #8A4E4B;
    margin: 0;
    padding: 12px;
  }
`;
