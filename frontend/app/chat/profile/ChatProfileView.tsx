"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import { loginHref } from "@/app/components/loginLink";
import { toImageUrl } from "../../shelter/animalFormat";
import { CommunityCategory, categoryLabel } from "../../story/communityApi";
import { ChatProfile, ChatProfilePost, fetchChatProfile, toChatError } from "../chatApi";
import ChatAvatar from "../ChatAvatar";
import * as S from "@/assets/css/Style.styles";

const postDate = (iso: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return `${sameYear ? "" : `${date.getFullYear()}.`}${date.getMonth() + 1}.${String(date.getDate()).padStart(2, "0")}`;
};

function PostThumb({post}: {post: ChatProfilePost}) {
  const thumb = toImageUrl(post.image ?? undefined);
  return thumb ? <S.ChatThumb src={thumb} alt=""/> : <S.ChatThumbEmpty aria-hidden="true"><S.ChatPinIcon/></S.ChatThumbEmpty>;
};

// 💡 채팅 상대 프로필: 사진·닉네임 + 상대가 쓴 실종·제보 글, 커뮤니티 글
//    대화 참여자만 볼 수 있음 (연락처·이메일은 보여 주지 않음)
export default function ChatProfileView({id}: {id: number}) {
  const router = useRouter();
  const [profile, setProfile] = useState<ChatProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace(loginHref(`/chat/profile/?id=${id}`));
      return;
    };
    let alive = true;
    fetchChatProfile(id)
      .then((data) => alive && setProfile(data))
      .catch((e) => alive && setError(toChatError(e, "프로필을 불러오지 못했어요.")));
    return () => {
      alive = false;
    };
  }, [id, router]);

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="프로필" onBackClick={() => (window.history.length > 1 ? router.back() : router.push(`/chat/room/?id=${id}`))}/>
        <S.HeaderOffset/>
        {!profile ? (
          <S.ChatEmpty>{error ?? "불러오는 중이에요"}</S.ChatEmpty>
        ) : (
          <>
            <S.ChatProfileHead>
              <ChatAvatar image={profile.image} size={80}/>
              <strong>{profile.nickname}</strong>
              {profile.blocked && <p>종료된 대화의 상대예요</p>}
            </S.ChatProfileHead>

            <S.ChatProfileSection aria-labelledby="profile-missing">
              <h2 id="profile-missing">실종·제보 글<span>{profile.missingPosts.length}</span></h2>
              {profile.missingPosts.length === 0 ? <p>쓴 글이 없어요</p> : (
                <ul>
                  {profile.missingPosts.map((post) => (
                    <li key={post.id}>
                      <S.ChatProfilePost as={Link} href={`/missing/detail/?id=${post.id}`}>
                        <PostThumb post={post}/>
                        <div>
                          <strong>{post.title}</strong>
                          <small>{post.kind === "FOUND" ? "목격 제보" : "실종 신고"}{post.status === "COMPLETED" ? " · 찾았어요" : ""} · {postDate(post.createdAt)}</small>
                        </div>
                      </S.ChatProfilePost>
                    </li>
                  ))}
                </ul>
              )}
            </S.ChatProfileSection>

            <S.ChatProfileSection aria-labelledby="profile-community">
              <h2 id="profile-community">커뮤니티 글<span>{profile.communityPosts.length}</span></h2>
              {profile.communityPosts.length === 0 ? <p>쓴 글이 없어요</p> : (
                <ul>
                  {profile.communityPosts.map((post) => (
                    <li key={post.id}>
                      <S.ChatProfilePost as={Link} href={`/story/detail/?id=${post.id}`}>
                        {post.image && <PostThumb post={post}/>}
                        <div>
                          <strong>{post.title}</strong>
                          <small>{categoryLabel(post.kind as CommunityCategory)} · {postDate(post.createdAt)}</small>
                        </div>
                      </S.ChatProfilePost>
                    </li>
                  ))}
                </ul>
              )}
            </S.ChatProfileSection>
          </>
        )}
      </S.Container>
    </S.AppWrapper>
  );
};
