"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import type { MissingAnimal } from "./redux/missingSlice";
import type { Animal } from "./redux/shelterSlice";
import { VolunteerPost, fetchVolunteers, formatVolunteerWhen } from "./volunteer/volunteerApi";
import { CommunityPost, categoryLabel, fetchCommunityPosts } from "./story/communityApi";
import { missingBadge, missingRowHead, timeAgo } from "./missing/missingFormat";
import { animalTitle, toImageUrl } from "./shelter/animalFormat";
import * as S from "@/assets/css/Style.styles";

const LIMIT = 3; // 종류마다 먼저 보여줄 개수 (나머지는 "전체 보기"로 그 탭에서)

const matches = (words: string[], ...texts: (string | null | undefined)[]) => {
  const text = texts.filter(Boolean).join(" ").toLowerCase();
  return words.every((word) => text.includes(word));
};

// 💡 홈 검색: 한 번에 실종·목격 글, 보호 동물, 봉사, 이야기를 찾아서 종류별로 3개씩
//    "전체 보기"를 누르면 그 탭으로 가서 같은 검색어로 이어서 찾음 (?q=)
export default function HomeSearchResults({keyword, animals}: {keyword: string; animals: Animal[]}) {
  const [missing, setMissing] = useState<MissingAnimal[] | null>(null);
  const [volunteers, setVolunteers] = useState<VolunteerPost[] | null>(null);
  const [stories, setStories] = useState<CommunityPost[] | null>(null);

  useEffect(() => {
    let alive = true;
    const words = keyword.toLowerCase().split(/\s+/).filter(Boolean);
    axios.get<MissingAnimal[]>("/api/missing-posts", {params: {keyword, size: LIMIT + 1}})
      .then(({data}) => alive && setMissing(data))
      .catch(() => alive && setMissing([]));
    fetchVolunteers()
      .then((list) => alive && setVolunteers(list.filter((post) => matches(words, post.title, post.place, post.content))))
      .catch(() => alive && setVolunteers([]));
    fetchCommunityPosts(undefined, undefined, LIMIT + 1, keyword)
      .then((list) => alive && setStories(list))
      .catch(() => alive && setStories([]));
    return () => {
      alive = false;
    };
  }, [keyword]);

  const words = keyword.toLowerCase().split(/\s+/).filter(Boolean);
  const foundAnimals = animals.filter((animal) => matches(words, animal.name, animal.breed, animal.rescueLocation, animal.noticeNo));
  const q = encodeURIComponent(keyword);

  const loading = missing === null || volunteers === null || stories === null;
  const nothing = !loading && missing.length + foundAnimals.length + volunteers.length + stories.length === 0;

  if (loading) return <S.HomeEmpty>찾는 중이에요</S.HomeEmpty>;
  if (nothing) return <S.HomeEmpty>&quot;{keyword}&quot;에 맞는 글이 없어요. 이름, 품종, 동네로 다시 찾아 보세요.</S.HomeEmpty>;

  const section = (title: string, count: number, href: string, children: React.ReactNode) => count > 0 && (
    <S.HomeSection>
      <S.HomeSectionHead>
        <S.HomeSectionTitle>{title}</S.HomeSectionTitle>
        <S.HomeMoreLink as={Link} href={href}>전체 보기</S.HomeMoreLink>
      </S.HomeSectionHead>
      <S.HomeList>{children}</S.HomeList>
    </S.HomeSection>
  );

  const thumb = (url?: string | null) => {
    const src = toImageUrl(url ?? undefined);
    return src ? <S.HomeListThumb src={src} alt=""/> : <S.HomePhotoPlaceholder $size="68px">사진 없음</S.HomePhotoPlaceholder>;
  };

  return (
    <>
      {section("실종·목격", missing.length, `/missing?q=${q}`, missing.slice(0, LIMIT).map((post) => (
        <S.HomeListRow key={`m${post.id}`} as={Link} href={`/missing/detail/?id=${post.id}`}>
          {thumb(post.mediaUrls?.[0])}
          <S.HomeListBody>
            <S.MissingBadge $tone={missingBadge(post).tone} style={{alignSelf: "flex-start"}}>{missingBadge(post).label}</S.MissingBadge>
            <S.HomeListTitle>{[missingRowHead(post).main, missingRowHead(post).sub].filter(Boolean).join(" · ")}</S.HomeListTitle>
            <S.HomeListMeta>{[post.rescueLocation, timeAgo(post.createdAt)].filter(Boolean).join(" · ")}</S.HomeListMeta>
          </S.HomeListBody>
        </S.HomeListRow>
      )))}

      {section("보호 동물", foundAnimals.length, `/shelter?tab=adopt&q=${q}`, foundAnimals.slice(0, LIMIT).map((animal) => (
        <S.HomeListRow key={`a${animal.id}`} as={Link} href={`/shelter/detail/?id=${animal.id}`}>
          {thumb(animal.imageUrl)}
          <S.HomeListBody>
            <S.HomeKicker>{animal.status === "COMPLETED" ? "입양 완료" : "새 가족을 기다려요"}</S.HomeKicker>
            <S.HomeListTitle>{animalTitle(animal)}</S.HomeListTitle>
            <S.HomeListMeta>{animal.rescueLocation}</S.HomeListMeta>
          </S.HomeListBody>
        </S.HomeListRow>
      )))}

      {section("봉사", volunteers.length, `/shelter?tab=volunteer&q=${q}`, volunteers.slice(0, LIMIT).map((post) => (
        <S.HomeListRow key={`v${post.id}`} as={Link} href={`/volunteer/detail/?id=${post.id}`}>
          {thumb(post.imageUrl)}
          <S.HomeListBody>
            <S.HomeKicker>봉사 모집</S.HomeKicker>
            <S.HomeListTitle>{post.title}</S.HomeListTitle>
            <S.HomeListMeta>{[formatVolunteerWhen(post), post.place].filter(Boolean).join(" · ")}</S.HomeListMeta>
          </S.HomeListBody>
        </S.HomeListRow>
      )))}

      {section("이야기", stories.length, `/shelter?tab=story&q=${q}`, stories.slice(0, LIMIT).map((post) => (
        <S.HomeListRow key={`s${post.id}`} as={Link} href={`/story/detail/?id=${post.id}`}>
          {post.mediaUrls?.[0] ? thumb(post.mediaUrls[0]) : null}
          <S.HomeListBody>
            <S.HomeKicker>{categoryLabel(post.category)}</S.HomeKicker>
            <S.HomeListTitle>{post.title}</S.HomeListTitle>
            <S.HomeListMeta>{post.authorName} · {timeAgo(post.createdAt)}</S.HomeListMeta>
          </S.HomeListBody>
        </S.HomeListRow>
      )))}
    </>
  );
};
