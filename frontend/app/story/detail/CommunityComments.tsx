"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { COMMENT_MAX, CommunityComment, addComment, deleteComment, fetchComments, toCommunityError } from "../communityApi";
import { timeAgo } from "../../missing/missingFormat";
import ProfileAvatar from "@/app/components/ProfileAvatar";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import { loginHref } from "@/app/components/loginLink";
import { useImeSafeSubmit } from "@/app/components/imeSafeSubmit";
import { showToast } from "@/app/components/Toast";
import * as S from "@/assets/css/Style.styles";

// 💡 이야기 글 댓글: 오래된 순으로 보고, 로그인 회원이 씀. 내 댓글만 지울 수 있음
export default function CommunityComments({postId, loggedIn, onCountChange}: {
  postId: number;
  loggedIn: boolean;
  onCountChange: (count: number) => void;
}) {
  const [comments, setComments] = useState<CommunityComment[] | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [removing, setRemoving] = useState<CommunityComment | null>(null);
  const imeSafeSubmit = useImeSafeSubmit(); // 한글 입력 중 바로 눌러도 한 번에 등록

  useEffect(() => {
    let alive = true;
    fetchComments(postId)
      .then((data) => alive && setComments(data))
      .catch(() => alive && setComments([]));
    return () => {
      alive = false;
    };
  }, [postId]);

  const update = (next: CommunityComment[]) => {
    setComments(next);
    onCountChange(next.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      const saved = await addComment(postId, content);
      update([...(comments ?? []), saved]);
      setText("");
    } catch (error) {
      const message = toCommunityError(error, "댓글을 올리지 못했어요. 잠시 후 다시 시도해 주세요.");
      showToast(message === "UNAUTHORIZED" ? "로그인이 끝났어요. 다시 로그인해 주세요" : message);
    } finally {
      setSending(false);
    };
  };

  const handleDelete = async () => {
    if (!removing) return;
    try {
      await deleteComment(postId, removing.id);
      update((comments ?? []).filter((comment) => comment.id !== removing.id));
      showToast("댓글을 지웠어요");
    } catch (error) {
      showToast(toCommunityError(error, "지우지 못했어요. 잠시 후 다시 시도해 주세요."));
    } finally {
      setRemoving(null);
    };
  };

  return (
    <S.DetailSection aria-labelledby="community-comments-title">
      <S.DetailHeading id="community-comments-title">댓글 {comments ? comments.length : ""}</S.DetailHeading>

      {comments === null ? (
        <S.CommunityCommentLogin>댓글을 불러오는 중이에요</S.CommunityCommentLogin>
      ) : comments.length === 0 ? (
        <S.CommunityCommentLogin>아직 댓글이 없어요. 첫 댓글을 남겨 보세요.</S.CommunityCommentLogin>
      ) : (
        <S.CommunityComments>
          {comments.map((comment) => (
            <li key={comment.id}>
              <ProfileAvatar image={comment.authorImageUrl} size={32}/>
              <S.CommunityCommentBody>
                <header>
                  {comment.authorId != null
                    ? <Link href={`/profile/?id=${comment.authorId}`}>{comment.authorName}</Link>
                    : <strong>{comment.authorName}</strong>}
                  <span>{timeAgo(comment.createdAt)}</span>
                  {comment.mine && (
                    <S.CommunityCommentDelete type="button" onClick={() => setRemoving(comment)}>지우기</S.CommunityCommentDelete>
                  )}
                </header>
                <p>{comment.content}</p>
              </S.CommunityCommentBody>
            </li>
          ))}
        </S.CommunityComments>
      )}

      {loggedIn ? (
        <S.CommunityCommentForm onSubmit={handleSubmit}>
          <textarea
          aria-label="댓글"
          placeholder="따뜻한 한마디를 남겨 주세요"
          rows={1}
          maxLength={COMMENT_MAX}
          value={text}
          onChange={(e) => setText(e.target.value)}/>
          <button type="submit" disabled={!text.trim() || sending} {...imeSafeSubmit}>
            {sending ? "올리는 중" : "등록"}
          </button>
        </S.CommunityCommentForm>
      ) : (
        <S.CommunityCommentLogin>
          <Link href={loginHref(`/story/detail/?id=${postId}`)}>로그인</Link>하면 댓글을 남길 수 있어요
        </S.CommunityCommentLogin>
      )}

      <ConfirmDialog
      isOpen={removing !== null}
      title="댓글을 지울까요?"
      message="지운 댓글은 되돌릴 수 없어요."
      confirmText="지우기"
      danger
      onConfirm={handleDelete}
      onCancel={() => setRemoving(null)}/>
    </S.DetailSection>
  );
};
