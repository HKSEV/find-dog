"use client";

import {
  AddAPhotoOutlined as CameraIcon,
  CloseRounded as CloseIcon
} from "@mui/icons-material";
import styled from "styled-components";
import { colors } from "./theme";

// 💡 실종·제보 글쓰기 (디자인 개편 시안 3번 "신고·제보하기")

export const WriteForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px 20px 140px; /* 아래 고정 버튼에 마지막 칸이 가리지 않게 */
`;

// 잃어버렸어요 / 발견했어요
export const WriteKindGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

export const WriteKindButton = styled.button<{$checked?: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 14px;
  border: 2px solid ${({$checked}) => ($checked ? colors.brand : colors.border)};
  border-radius: 12px;
  background-color: ${({$checked}) => ($checked ? colors.brandBg : colors.white)};
  color: ${colors.gray900};
  text-align: left;
  cursor: pointer;

  strong {
    font-size: 15px;
    font-weight: 800;
  }

  span {
    font-size: 12px;
    color: ${colors.gray500};
  }
`;

export const WriteField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

export const WriteRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

export const WriteLabel = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: ${colors.gray900};

  span {
    font-weight: 400;
    color: ${colors.gray500};
  }
`;

const fieldBase = `
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  background-color: ${colors.white};
  color: ${colors.gray900};
  font-family: inherit;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${colors.brand};
  }

  &::placeholder {
    color: ${colors.gray400};
  }
`;

export const WriteInput = styled.input<{$invalid?: boolean}>`
  ${fieldBase}
  height: 46px;
  padding: 0 12px;
  border-color: ${({$invalid}) => ($invalid ? colors.danger : colors.border)};
`;

export const WriteTextArea = styled.textarea<{$invalid?: boolean}>`
  ${fieldBase}
  padding: 12px;
  line-height: 1.5;
  resize: none;
  border-color: ${({$invalid}) => ($invalid ? colors.danger : colors.border)};
`;

export const WriteError = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${colors.danger};
`;

// 성별: 남 / 여 / 모름
export const WriteChoiceGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

export const WriteChoice = styled.button<{$checked?: boolean}>`
  height: 44px;
  border: 1px solid ${({$checked}) => ($checked ? colors.brand : colors.border)};
  border-radius: 10px;
  background-color: ${({$checked}) => ($checked ? colors.brandBg : colors.white)};
  color: ${({$checked}) => ($checked ? colors.brand : colors.gray800)};
  font-size: 14px;
  font-weight: ${({$checked}) => ($checked ? 700 : 400)};
  cursor: pointer;
`;

// 사진
export const WritePhotos = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const WritePhotoAdd = styled.label`
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 76px;
  height: 76px;
  border: 1px dashed ${colors.gray200};
  border-radius: 10px;
  background-color: ${colors.bgLight};
  color: ${colors.gray500};
  font-size: 11px;
  cursor: pointer;

  input {
    display: none;
  }
`;

export const WriteCameraIcon = styled(CameraIcon)`
  && {
    font-size: 22px;
  }
`;

export const WritePhoto = styled.span`
  position: relative;
  flex: none;
  width: 76px;
  height: 76px;

  img {
    width: 76px;
    height: 76px;
    object-fit: cover;
    border-radius: 10px;
  }
`;

export const WritePhotoRemove = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background-color: rgba(31, 27, 26, 0.7);
  color: ${colors.white};
  cursor: pointer;
`;

export const WriteRemoveIcon = styled(CloseIcon)`
  && {
    font-size: 14px;
  }
`;

// 아래 고정: 안내 + 등록하기
export const WriteBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 100;
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
  padding: 12px 20px 20px;
  border-top: 1px solid ${colors.border};
  background-color: ${colors.white};
  transform: translateX(-50%);

  p {
    margin: 0 0 8px;
    font-size: 12px;
    color: ${colors.gray500};
  }
`;

export const WriteSubmit = styled.button`
  width: 100%;
  height: 52px;
  border: 0;
  border-radius: 12px;
  background-color: ${colors.brand};
  color: ${colors.white};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background-color: ${colors.gray200};
    cursor: default;
  }
`;

// 로그인 전 안내
export const WriteLoginNotice = styled.div`
  margin: 24px 20px 0;
  padding: 22px 20px;
  border-radius: 14px;
  background-color: ${colors.brandBg};
  color: ${colors.gray900};

  p {
    margin: 0;
    font-size: 16px;
    font-weight: 800;
    line-height: 1.5;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 46px;
    margin-top: 16px;
    border-radius: 10px;
    background-color: ${colors.brand};
    color: ${colors.white};
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
  }

  a:hover {
    color: ${colors.white};
  }
`;
