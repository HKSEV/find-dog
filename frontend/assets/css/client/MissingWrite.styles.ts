"use client";

import {
  AddAPhotoOutlined as CameraIcon,
  CloseRounded as CloseIcon
} from "@mui/icons-material";
import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 실종·제보 글쓰기 (디자인 개편 시안 3번 "신고·제보하기")

export const WriteForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px 20px 64px; /* 아래 고정 버튼(약 111px)에 안 가리게. Container가 이미 70px를 둬서 합쳐 134px */
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
    font-weight: ${fontWeight.semibold};
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
  font-weight: ${fontWeight.semibold};
  color: ${colors.gray900};

  span {
    font-weight: ${fontWeight.regular};
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
  /* 빈 칸의 안내 문구가 줄바꿈되지 않아 가로 스크롤이 생기는 브라우저(사파리 등)가 있어서 막음 */
  overflow-x: hidden;
  overflow-wrap: anywhere;

  &::placeholder {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  border-color: ${({$invalid}) => ($invalid ? colors.danger : colors.border)};
`;

// && 로 우선순위를 올려서 아래 고정 버튼 묶음(WriteBar)의 p 회색 글자에 덮이지 않게
export const WriteError = styled.p`
  && {
    margin: 0;
    font-size: 12px;
    color: ${colors.danger};
  }
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
  font-weight: ${({$checked}) => ($checked ? fontWeight.semibold : fontWeight.regular)};
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
  font-weight: ${fontWeight.semibold};
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
    font-weight: ${fontWeight.semibold};
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
    font-weight: ${fontWeight.semibold};
    text-decoration: none;
  }
`;

// ==========================================
// 잃어버린 때 / 발견한 때 (날짜 칩 + 시간대 칩 + 달력)
// ==========================================

export const WhenChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const WhenChip = styled.button<{$checked?: boolean}>`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid ${({$checked}) => ($checked ? colors.brand : colors.border)};
  border-radius: 10px;
  background-color: ${({$checked}) => ($checked ? colors.brandBg : colors.white)};
  color: ${({$checked}) => ($checked ? colors.brand : colors.gray800)};
  font-size: 14px;
  font-weight: ${({$checked}) => ($checked ? fontWeight.semibold : fontWeight.regular)};
  cursor: pointer;

  svg {
    font-size: 18px;
  }
`;

export const WhenSubLabel = styled.p`
  margin: 8px 0 0;
  font-size: 12px;
  color: ${colors.gray500};
`;

export const WhenLink = styled.button`
  align-self: flex-start;
  padding: 4px 0;
  border: 0;
  background: transparent;
  color: ${colors.brand};
  font-size: 13px;
  cursor: pointer;
`;

export const WhenSummary = styled.p`
  margin: 4px 0 0;
  padding: 12px 14px;
  border-radius: 10px;
  background-color: ${colors.bgLight};
  font-size: 13px;
  color: ${colors.gray800};
`;

export const WhenExact = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    width: 64px;
    height: 46px;
    box-sizing: border-box;
    border: 1px solid ${colors.border};
    border-radius: 10px;
    font-family: inherit;
    font-size: 15px;
    text-align: center;
    outline: none;
  }

  input:focus {
    border-color: ${colors.brand};
  }
`;

export const WhenAmPm = styled.div`
  display: flex;
  overflow: hidden;
  border: 1px solid ${colors.border};
  border-radius: 10px;

  button {
    height: 44px;
    padding: 0 14px;
    border: 0;
    background: ${colors.white};
    color: ${colors.gray500};
    font-size: 14px;
    cursor: pointer;
  }

  button[aria-pressed="true"] {
    background: ${colors.brandBg};
    color: ${colors.brand};
    font-weight: ${fontWeight.semibold};
  }
`;

// 날짜 고르기 (아래에서 올라오는 달력, 연도는 숨김)
export const WhenSheetOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10003;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
`;

export const WhenSheet = styled.div`
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
  padding: 12px 20px 20px;
  border-radius: 18px 18px 0 0;
  background-color: ${colors.white};
`;

export const WhenSheetHandle = styled.span`
  display: block;
  width: 40px;
  height: 4px;
  margin: 0 auto 12px;
  border-radius: 2px;
  background-color: ${colors.gray200};
`;

export const WhenMonthHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: ${fontWeight.semibold};

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    background: transparent;
    color: ${colors.gray900};
    cursor: pointer;
  }

  button:disabled {
    color: ${colors.gray200};
    cursor: default;
  }
`;

export const WhenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  row-gap: 6px;
  text-align: center;
`;

export const WhenWeekday = styled.span`
  font-size: 13px;
  color: ${colors.gray400};
`;

// 칸 너비와 상관없이 가운데 36×36 정원
export const WhenDayCell = styled.span`
  display: flex;
  justify-content: center;
`;

export const WhenDay = styled.button<{$selected?: boolean; $today?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background-color: ${({$selected}) => ($selected ? colors.brand : "transparent")};
  box-shadow: ${({$today, $selected}) => ($today && !$selected ? `inset 0 0 0 1.5px ${colors.brand}` : "none")};
  color: ${({$selected, $today}) => ($selected ? colors.white : $today ? colors.brand : colors.gray900)};
  font-size: 14px;
  font-weight: ${({$today}) => ($today ? fontWeight.semibold : fontWeight.regular)};
  cursor: pointer;

  &:disabled {
    color: ${colors.gray200};
    cursor: default;
  }
`;

export const WhenSheetNote = styled.p`
  margin: 8px 0 12px;
  font-size: 11px;
  color: ${colors.gray400};
`;
