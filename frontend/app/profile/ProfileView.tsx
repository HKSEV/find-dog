"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import ProfileAvatar from "@/app/components/ProfileAvatar";
import { toImageUrl } from "../shelter/animalFormat";
import { CommunityCategory, categoryLabel } from "../story/communityApi";
import { MemberProfile, ProfilePost, fetchMemberProfile } from "./profileApi";
import * as S from "@/assets/css/Style.styles";

const postDate = (iso: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return `${sameYear ? "" : `${date.getFullYear()}.`}${date.getMonth() + 1}.${String(date.getDate()).padStart(2, "0")}`;
};

function PostThumb({post}: {post: ProfilePost}) {
  const thumb = toImageUrl(post.image ?? undefined);
  return thumb ? <S.ChatThumb src={thumb} alt=""/> : <S.ChatThumbEmpty aria-hidden="true"><S.ChatPinIcon/></S.ChatThumbEmpty>;
};

// 💡 회원 프로필: 사진·닉네임 + 쓴 실종·제보 글, 커뮤니티 글 (실명·연락처·이메일은 보여 주지 않음)
export default function ProfileView({id}: {id: number}) {
  const router = useRouter();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchMemberProfile(id)
      .then((data) => alive && setProfile(data))
      .catch((e) => {
        if (!alive) return;
        setError(axios.isAxiosError(e) && e.response?.status === 404 ? "탈퇴했거나 없는 회원이에요" : "프로필을 불러오지 못했어요. 잠시 후 다시 시도해 주세요");
      });
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="프로필" onBackClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}/>
        <S.HeaderOffset/>
        {!profile ? (
          <S.ChatEmpty>{error ?? "불러오는 중이에요"}</S.ChatEmpty>
        ) : (
          <>
            <S.MemberProfileHead>
              <ProfileAvatar image={profile.image} size={80}/>
              <strong>{profile.nickname}</strong>
            </S.MemberProfileHead>

            <S.MemberProfileSection aria-labelledby="profile-missing">
              <h2 id="profile-missing">실종·제보 글<span>{profile.missingPosts.length}</span></h2>
              {profile.missingPosts.length === 0 ? <p>쓴 글이 없어요</p> : (
                <ul>
                  {profile.missingPosts.map((post) => (
                    <li key={post.id}>
                      <S.MemberProfilePost as={Link} href={`/missing/detail/?id=${post.id}`}>
                        <PostThumb post={post}/>
                        <div>
                          <strong>{post.title}</strong>
                          <small>{post.kind === "FOUND" ? "목격 제보" : "실종 신고"}{post.status === "COMPLETED" ? " · 찾았어요" : ""} · {postDate(post.createdAt)}</small>
                        </div>
                      </S.MemberProfilePost>
                    </li>
                  ))}
                </ul>
              )}
            </S.MemberProfileSection>

            <S.MemberProfileSection aria-labelledby="profile-community">
              <h2 id="profile-community">커뮤니티 글<span>{profile.communityPosts.length}</span></h2>
              {profile.communityPosts.length === 0 ? <p>쓴 글이 없어요</p> : (
                <ul>
                  {profile.communityPosts.map((post) => (
                    <li key={post.id}>
                      <S.MemberProfilePost as={Link} href={`/story/detail/?id=${post.id}`}>
                        {post.image && <PostThumb post={post}/>}
                        <div>
                          <strong>{post.title}</strong>
                          <small>{categoryLabel(post.kind as CommunityCategory)} · {postDate(post.createdAt)}</small>
                        </div>
                      </S.MemberProfilePost>
                    </li>
                  ))}
                </ul>
              )}
            </S.MemberProfileSection>
          </>
        )}
      </S.Container>
    </S.AppWrapper>
  );
};
