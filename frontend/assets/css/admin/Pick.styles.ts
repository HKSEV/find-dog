"use client";

import Image from "next/image";
import styled from "styled-components";
import { coolGray, adminInput, adminPrimaryBtn, adminOutlineBtn, adminColors } from "@/assets/css/admin/AdminBase.styles";

export const PickFormDivider = styled.hr`
  && {
    border-color: ${coolGray[200]};
    margin: 24px 0;
  }
`;

export const PickPreviewBox = styled.div`
  && {
    margin-bottom: 24px;
    text-align: center;
  }
`;

export const AnimalPreviewImage = styled(Image)`
  && {
    width: auto;
    height: auto;
    max-height: 200px;
    border-radius: 8px;
    border: 1px solid ${coolGray[200]};
  }
`;

// ==========================================
// 💡 폼(Form) 전용 스타일드 컴포넌트 정의
// ==========================================
export const PickGridWrap = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; /* 좌측 폼 2, 우측 안내 1 비율 */
  gap: 24px;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr; /* 모바일/태블릿에선 1열 세로 배치 */
  }
`;

export const PickFormGroup = styled.div`
  margin-bottom: 24px;
`;

export const FormLabel = styled.label`
  display: block;
  font-weight: 700;
  color: ${coolGray[700]};
  margin-bottom: 8px;
  font-size: 14px;
`;

export const UrlLabel = styled(FormLabel)`
  && {
    color: ${coolGray[800]};
  }
`;

export const FormInput = styled.input`
  ${adminInput}
`;

export const FormSelect = styled.select`
  ${adminInput}
  cursor: pointer;
`;

// 가로 분할을 위한 내부 그리드
export const InnerGridRow2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const InnerGridRow3 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

// 인풋창과 버튼이 붙어있는 구조 (URL 입력부)
export const PickInputGroup = styled.div`
  display: flex;
  width: 100%;

  ${FormInput} {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none; /* 겹치는 테두리 제거 */
  }
`;

export const FetchButton = styled.button`
  ${adminOutlineBtn}
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  white-space: nowrap;
  background-color: ${coolGray[50]};
`;

export const PickSubmitButton = styled.button`
  ${adminPrimaryBtn}
  width: 100%;
  padding: 14px;
  font-size: 16px;
  margin-top: 16px;
`;

// 라디오 버튼 그룹 스타일
export const PickRadioGroup = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 8px;
`;

export const PickRadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${coolGray[700]};
  font-weight: 500;

  input[type="radio"] {
    appearance: none;
    width: 18px;
    height: 18px;
    border: 2px solid ${coolGray[400]};
    border-radius: 50%;
    margin: 0;
    display: grid;
    place-content: center;

    &::before {
      content: "";
      width: 10px;
      height: 10px;
      border-radius: 50%;
      transform: scale(0);
      transition: 120ms transform ease-in-out;
      background-color: ${adminColors.primary};
    }

    &:checked {
      border-color: ${adminColors.primary};
    }

    &:checked::before {
      transform: scale(1);
    }
  }
`;

export const PickHelpText = styled.small`
  display: block;
  margin-top: 6px;
  color: ${coolGray[500]};
  font-size: 13px;
`;

export const InfoText = styled.p`
  color: ${coolGray[600]};
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;

  strong {
    color: ${coolGray[800]};
    font-weight: 700;
  }
`;
