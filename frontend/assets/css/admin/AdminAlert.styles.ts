"use client";

import styled, { keyframes } from "styled-components";
import { coolGray } from "@/assets/css/admin/AdminBase.styles";

export type AdminAlertVariant = "info" | "success" | "error";

const alertColors = {
  surface: "#FFFFFF",
  accent: "#2563EB",
  accentHover: "#1D4ED8",
  accentSubtle: "#EFF6FF",
  danger: "#DC2626",
  dangerSubtle: "#FEF2F2"
};

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const AlertBox = styled.dialog`
  position: fixed;
  inset: 0;
  width: calc(100% - 2rem);
  max-width: 25rem;
  max-height: calc(100dvh - 2rem);
  min-width: 0;
  margin: auto;
  padding: 2rem 1.75rem 1.75rem;
  color: ${coolGray[900]};
  background-color: ${alertColors.surface};
  border: 1px solid ${coolGray[200]};
  border-radius: 1.25rem;
  outline: none;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.18);
  overflow-y: auto;
  overscroll-behavior: contain;
  font: inherit;
  text-align: center;

  &[open] {
    animation: ${slideUp} 0.18s ease-out both;
  }

  &::backdrop {
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(4px);
  }

  @media (max-width: 480px) {
    padding: 1.75rem 1.25rem 1.25rem;
  }

  @media (prefers-reduced-motion: reduce) {
    &[open] {
      animation: none;
    }
  }
`;

export const AlertIcon = styled.div<{$variant: AdminAlertVariant}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 1.25rem;
  color: ${({$variant}) => ($variant === "error" ? alertColors.danger : alertColors.accent)};
  background-color: ${({$variant}) => ($variant === "error" ? alertColors.dangerSubtle : alertColors.accentSubtle)};
  border-radius: 1rem;

  svg {
    width: 1.75rem;
    height: 1.75rem;
    stroke-width: 2.5;
  }
`;

export const AlertText = styled.h2`
  margin: 0;
  color: ${coolGray[900]};
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.5px;
  white-space: pre-line;
  overflow-wrap: anywhere;

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

export const AlertDescription = styled.p`
  margin: 0.5rem 0 0;
  color: ${coolGray[500]};
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-line;
  overflow-wrap: anywhere;
`;

export const AlertActions = styled.div<{$isConfirm?: boolean}>`
  display: grid;
  grid-template-columns: ${({$isConfirm}) => ($isConfirm ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)")};
  gap: 10px;
  margin-top: 1.75rem;
`;

export const AdminAlertConfirmButton = styled.button`
  min-height: 2.75rem;
  padding: 0.625rem 1rem;
  color: ${alertColors.surface};
  background-color: ${alertColors.accent};
  border: 1px solid ${alertColors.accent};
  border-radius: 0.625rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${alertColors.accentHover};
    border-color: ${alertColors.accentHover};
  }

  &:focus-visible {
    outline: 2px solid ${alertColors.accent};
    outline-offset: 3px;
  }
`;

export const AdminAlertCancelButton = styled(AdminAlertConfirmButton)`
  color: ${coolGray[600]};
  background-color: #FFFFFF;
  border-color: ${coolGray[300]};

  &:hover {
    color: ${coolGray[800]};
    background-color: ${coolGray[100]};
    border-color: ${coolGray[400]};
  }
`;

export const AdminAlertCloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  color: ${coolGray[500]};
  background: transparent;
  border: 0;
  border-radius: 0.5rem;
  cursor: pointer;

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }

  &:hover {
    color: ${alertColors.accent};
    background-color: ${alertColors.accentSubtle};
  }

  &:focus-visible {
    outline: 2px solid ${alertColors.accent};
    outline-offset: 2px;
  }
`;
