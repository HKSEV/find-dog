"use client";

import React, { useState } from "react";
import { showToast } from "@/app/components/Toast";
import { useImeSafeSubmit } from "@/app/components/imeSafeSubmit";
import * as S from "@/assets/css/Style.styles";

export type ReportReason = "SPAM" | "ABUSE" | "FAKE" | "PRIVACY" | "ETC";

// 💡 신고 시트 (채팅, 실종·제보 글 공용): 사유(필수) + 자세한 내용(선택) + (채팅만) 이 대화 차단하기
//    onSubmit 은 서버 안내 문구를 돌려주고, 실패하면 throw (안내 문구는 toError 로)
export default function ReportSheet({title, note, reasons, withBlock, onSubmit, toError, onClose, onReported}: {
  title: string;
  note: string;
  reasons: {value: ReportReason; label: string}[];
  withBlock?: boolean;
  onSubmit: (body: {reason: ReportReason; detail?: string; block: boolean}) => Promise<string>;
  toError: (error: unknown) => string;
  onClose: () => void;
  onReported?: (blocked: boolean) => void;
}) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [detail, setDetail] = useState("");
  const [block, setBlock] = useState(Boolean(withBlock));
  const [sending, setSending] = useState(false);
  const imeSafeSubmit = useImeSafeSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || sending) return;
    setSending(true);
    try {
      showToast(await onSubmit({reason, detail: detail.trim() || undefined, block: Boolean(withBlock) && block}));
      onClose();
      onReported?.(Boolean(withBlock) && block);
    } catch (error) {
      showToast(toError(error));
      setSending(false);
    };
  };

  return (
    <S.ShareSheetOverlay onClick={onClose}>
      <S.ShareSheet
      as="form"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-title"
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      onSubmit={handleSubmit}>
        <S.ShareSheetHandle aria-hidden="true"/>
        <S.ShareSheetTitle id="report-title">{title}</S.ShareSheetTitle>
        <S.ShareSheetNote>{note}</S.ShareSheetNote>

        <S.ChatReportReasons role="radiogroup" aria-label="신고 사유">
          {reasons.map((item) => (
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

        {withBlock && (
          <S.ChatReportBlock>
            <input type="checkbox" checked={block} onChange={(e) => setBlock(e.target.checked)}/>
            <span>이 대화 차단하기<small>서로 더 이상 메시지를 보낼 수 없어요.</small></span>
          </S.ChatReportBlock>
        )}

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
