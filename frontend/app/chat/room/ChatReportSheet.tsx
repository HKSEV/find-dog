"use client";

import React, { useState } from "react";
import { showToast } from "@/app/components/Toast";
import { useImeSafeSubmit } from "@/app/components/imeSafeSubmit";
import { ChatReportReason, chatReportReasons, reportChat, toChatError } from "../chatApi";
import * as S from "@/assets/css/Style.styles";

// 💡 채팅 신고 시트: 사유(필수) + 자세한 내용(선택) + 이 대화 차단하기(기본 켜짐)
//    신고하면 운영팀이 신고된 대화 내용만 확인함 (다른 대화는 볼 수 없음)
export default function ChatReportSheet({roomId, otherNickname, onClose, onReported}: {
  roomId: number;
  otherNickname: string;
  onClose: () => void;
  onReported: (blocked: boolean) => void;
}) {
  const [reason, setReason] = useState<ChatReportReason | null>(null);
  const [detail, setDetail] = useState("");
  const [block, setBlock] = useState(true);
  const [sending, setSending] = useState(false);
  const imeSafeSubmit = useImeSafeSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || sending) return;
    setSending(true);
    try {
      showToast(await reportChat(roomId, {reason, detail: detail.trim() || undefined, block}));
      onReported(block);
    } catch (error) {
      showToast(toChatError(error, "신고하지 못했어요. 잠시 후 다시 시도해 주세요."));
      setSending(false);
    };
  };

  return (
    <S.ShareSheetOverlay onClick={onClose}>
      <S.ShareSheet
      as="form"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-report-title"
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      onSubmit={handleSubmit}>
        <S.ShareSheetHandle aria-hidden="true"/>
        <S.ShareSheetTitle id="chat-report-title">{otherNickname}님을 신고할까요?</S.ShareSheetTitle>
        <S.ShareSheetNote>운영팀이 이 대화 내용만 확인해요. 신고한 사실은 상대에게 알리지 않아요.</S.ShareSheetNote>

        <S.ChatReportReasons role="radiogroup" aria-label="신고 사유">
          {chatReportReasons.map((item) => (
            <label key={item.value}>
              <input type="radio" name="reason" value={item.value} checked={reason === item.value} onChange={() => setReason(item.value)}/>
              {item.label}
            </label>
          ))}
        </S.ChatReportReasons>

        <S.ChatReportDetail
        aria-label="자세한 내용"
        placeholder="자세한 내용을 적어 주시면 확인에 도움이 돼요 (선택)"
        maxLength={500}
        value={detail}
        onChange={(e) => setDetail(e.target.value)}/>

        <S.ChatReportBlock>
          <input type="checkbox" checked={block} onChange={(e) => setBlock(e.target.checked)}/>
          <span>이 대화 차단하기<small>서로 더 이상 메시지를 보낼 수 없어요.</small></span>
        </S.ChatReportBlock>

        <S.ChatReportActions>
          <S.ShareCancelButton type="button" onClick={onClose}>취소</S.ShareCancelButton>
          <S.ChatReportSubmit type="submit" disabled={!reason || sending} {...imeSafeSubmit}>
            {sending ? "보내는 중" : "신고하기"}
          </S.ChatReportSubmit>
        </S.ChatReportActions>
      </S.ShareSheet>
    </S.ShareSheetOverlay>
  );
};
