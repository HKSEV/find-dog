"use client";

import { SendRounded as SendIcon, PlaceOutlined as PinIcon, ChatBubbleOutlineRounded as ChatIcon, OutlinedFlagRounded as FlagIcon } from "@mui/icons-material";
import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 채팅 목록 · 채팅방

export const ChatList = styled.ul`
  margin: 0;
  padding: 0 20px 100px;
  list-style: none;
`;

export const ChatRow = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid ${colors.border};
  color: ${colors.gray900};
  text-decoration: none;
`;

export const ChatThumb = styled.img`
  flex: none;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: cover;
  background-color: ${colors.bgSubtle};
`;

export const ChatThumbEmpty = styled.span`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background-color: ${colors.bgSubtle};
  color: ${colors.gray400};
`;

export const ChatRowBody = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    font-size: 15px;
    font-weight: ${fontWeight.semibold};
  }

  small {
    margin-left: 6px;
    font-size: 12px;
    color: ${colors.gray500};
  }

  p {
    margin: 3px 0 0;
    overflow: hidden;
    font-size: 13px;
    color: ${colors.gray800};
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  em {
    display: block;
    margin-top: 2px;
    overflow: hidden;
    font-size: 12px;
    font-style: normal;
    color: ${colors.gray400};
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const ChatUnread = styled.span`
  flex: none;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 999px;
  background-color: ${colors.danger};
  font-size: 11px;
  font-weight: ${fontWeight.semibold};
  line-height: 20px;
  color: ${colors.white};
  text-align: center;
`;

export const ChatEmpty = styled.div`
  padding: 80px 20px;
  text-align: center;
  color: ${colors.gray500};
  font-size: 14px;
  line-height: 1.6;

  svg {
    display: block;
    margin: 0 auto 8px;
    font-size: 40px;
    color: ${colors.gray200};
  }
`;

export const ChatEmptyIcon = styled(ChatIcon)``;

// ---- 채팅방 ----

// 헤더 아래 고정 글 카드
export const ChatPostCard = styled.a`
  position: sticky;
  top: 56px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border-bottom: 1px solid ${colors.border};
  background-color: ${colors.bgLight};
  color: ${colors.gray900};
  text-decoration: none;

  img,
  span[data-empty] {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
    background-color: ${colors.bgSubtle};
  }

  div {
    flex: 1;
    min-width: 0;
  }

  strong {
    display: block;
    overflow: hidden;
    font-size: 14px;
    font-weight: ${fontWeight.semibold};
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  small {
    font-size: 12px;
    color: ${colors.gray500};
  }
`;

export const ChatMessages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 16px 96px;
`;

export const ChatNotice = styled.p`
  align-self: center;
  margin: 4px 0 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background-color: ${colors.bgSubtle};
  font-size: 12px;
  color: ${colors.gray500};
  text-align: center;
`;

export const ChatBubbleRow = styled.div<{$mine: boolean}>`
  display: flex;
  flex-direction: ${({$mine}) => ($mine ? "row-reverse" : "row")};
  align-items: flex-end;
  gap: 6px;

  time {
    flex: none;
    font-size: 10px;
    color: ${colors.gray400};
  }
`;

export const ChatBubble = styled.div<{$mine: boolean}>`
  max-width: 72%;
  padding: 9px 12px;
  border-radius: ${({$mine}) => ($mine ? "16px 4px 16px 16px" : "4px 16px 16px 16px")};
  background-color: ${({$mine}) => ($mine ? colors.brand : colors.bgSubtle)};
  color: ${({$mine}) => ($mine ? colors.white : colors.gray900)};
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
`;

// 위치 메시지 카드
export const ChatLocation = styled.a<{$mine: boolean}>`
  display: block;
  width: 220px;
  overflow: hidden;
  border: 1px solid ${colors.border};
  border-radius: 14px;
  background-color: ${colors.white};
  color: ${colors.gray900};
  text-decoration: none;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 72px;
    background-color: ${colors.bgSubtle};
    color: ${colors.brand};
  }

  svg {
    font-size: 30px;
  }

  p {
    margin: 0;
    padding: 8px 10px;
    font-size: 13px;
  }

  small {
    display: block;
    color: ${colors.gray500};
  }
`;

export const ChatPinIcon = styled(PinIcon)``;

// 아래 입력창
export const ChatInputBar = styled.form`
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom));
  border-top: 1px solid ${colors.border};
  background-color: ${colors.white};
  transform: translateX(-50%);

  textarea {
    flex: 1;
    min-width: 0;
    max-height: 120px;
    padding: 10px 14px;
    border: 0;
    border-radius: 20px;
    outline: none;
    background-color: ${colors.bgSubtle};
    font: inherit;
    font-size: 15px;
    line-height: 1.4;
    resize: none;
  }
`;

export const ChatIconButton = styled.button<{$primary?: boolean}>`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background-color: ${({$primary}) => ($primary ? colors.brand : "transparent")};
  color: ${({$primary}) => ($primary ? colors.white : colors.gray500)};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
  }

  svg {
    font-size: 22px;
  }
`;

export const ChatSendIcon = styled(SendIcon)``;

// 💡 신고하기 (헤더 오른쪽 깃발 -> 아래에서 올라오는 시트, ShareSheet 재사용)
export const ChatReportIcon = styled(FlagIcon)`
  && {
    font-size: 22px;
  }
`;

export const ChatReportReasons = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;

  label {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 0;
    border-bottom: 1px solid ${colors.border};
    font-size: 15px;
    color: ${colors.gray900};
    cursor: pointer;
  }

  input {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: ${colors.brand};
  }
`;

export const ChatReportDetail = styled.textarea`
  width: 100%;
  min-height: 84px;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  outline: none;
  font: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;

  &:focus {
    border-color: ${colors.brand};
  }
`;

export const ChatReportBlock = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 14px;
  font-size: 14px;
  line-height: 1.5;
  color: ${colors.gray800};
  cursor: pointer;

  input {
    flex: none;
    width: 18px;
    height: 18px;
    margin: 1px 0 0;
    accent-color: ${colors.brand};
  }

  small {
    display: block;
    font-size: 12px;
    color: ${colors.gray400};
  }
`;

export const ChatReportActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;

  button {
    flex: 1;
    height: 48px;
    margin: 0;
  }
`;

export const ChatReportSubmit = styled.button`
  border: 0;
  border-radius: 12px;
  background-color: ${colors.brand};
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.white};
  cursor: pointer;

  &:disabled {
    background-color: ${colors.gray200};
    cursor: default;
  }
`;

// 차단·종료된 대화: 입력창 대신 안내
export const ChatClosedBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 100;
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
  padding: 16px 20px calc(16px + env(safe-area-inset-bottom));
  border-top: 1px solid ${colors.border};
  background-color: ${colors.bgLight};
  font-size: 14px;
  text-align: center;
  color: ${colors.gray500};
  transform: translateX(-50%);
`;
