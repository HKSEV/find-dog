"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchMissingAnimals } from "../redux/missingSlice";
import { setActiveTab } from "../redux/shelterSlice";
import { toImageUrl } from "../shelter/animalFormat";
import { missingStatusLabel, missingTraits, timeAgo } from "./missingFormat";

import { ModalSingle } from "../modal/ModalSingle";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import * as S from "@/assets/css/Style.styles";

export default function MissingReportPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {animalList, loading, loadingMore, hasMore, error} = useSelector((state: RootState) => state.missing);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [onlySearching, setOnlySearching] = useState(true); // 💡 시안 기준: 찾는 중인 글만 먼저

  useEffect(() => {
    dispatch(fetchMissingAnimals(undefined));
  }, [dispatch]);

  // 모달에서 글 등록 성공 시 처음부터 다시 불러옴
  const handleSuccessUpload = () => {
    dispatch(fetchMissingAnimals(undefined));
  };

  // 서버가 최신순(id 큰 순)으로 주므로 순서는 그대로
  const posts = onlySearching ? animalList.filter((post) => post.status === "MISSING") : animalList;
  const lastId = animalList.length > 0 ? animalList[animalList.length - 1].id : undefined;

  return (
    <S.AppWrapper>
      <Header title="실종·제보" isTab/>

      <S.Container>
        <S.HeaderOffset/>

        <S.MissingToolbar>
          <S.MissingOnlyToggle>
            <input type="checkbox" checked={onlySearching} onChange={(e) => setOnlySearching(e.target.checked)}/>
            찾는 중인 글만
          </S.MissingOnlyToggle>
          <span>최신순</span>
        </S.MissingToolbar>

        <S.MissingShelterHint as={Link} href="/shelter" onClick={() => dispatch(setActiveTab("입양"))}>
          <S.MissingHintSearchIcon aria-hidden="true"/>
          <span><strong>잃어버린 아이가 보호소에 들어왔을 수도 있어요.</strong> 보호소 공고도 확인해 보세요.</span>
          <S.MissingHintChevron aria-hidden="true"/>
        </S.MissingShelterHint>

        <S.MissingRows>
          {loading && animalList.length === 0 ? (
            <S.MissingEmptyText>실종·제보 글을 불러오는 중이에요</S.MissingEmptyText>
          ) : error && animalList.length === 0 ? (
            <S.MissingEmptyText>글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요</S.MissingEmptyText>
          ) : posts.length === 0 ? (
            <S.MissingEmptyText>
              {onlySearching && animalList.length > 0 ? "지금 찾는 중인 글이 없어요" : "등록된 실종·제보 글이 없어요"}
            </S.MissingEmptyText>
          ) : (
            posts.map((post) => {
              const done = post.status === "COMPLETED";
              const photo = toImageUrl(post.mediaUrls?.[0]);
              const meta = [post.rescueLocation, timeAgo(post.createdAt), done ? "가족 품으로 돌아갔어요" : ""]
                .filter(Boolean)
                .join(" · ");
              return (
                <S.MissingRow key={post.id} as={Link} href={`/missing/${post.id}`} $done={done}>
                  {photo ? (
                    <S.MissingRowThumb src={photo} alt={`${post.breed || "실종 동물"} 사진`}/>
                  ) : (
                    <S.MissingRowThumbEmpty>사진 없음</S.MissingRowThumbEmpty>
                  )}
                  <S.MissingRowBody>
                    <S.MissingBadge $done={done}>{missingStatusLabel[post.status] ?? post.status}</S.MissingBadge>
                    <S.MissingRowTitle>{post.title || post.breed}</S.MissingRowTitle>
                    <S.MissingRowTraits>{[post.breed, missingTraits(post)].filter(Boolean).join(" · ")}</S.MissingRowTraits>
                    <S.MissingRowMeta>{meta}</S.MissingRowMeta>
                  </S.MissingRowBody>
                </S.MissingRow>
              );
            })
          )}

          {hasMore && (
            <S.MissingMoreButton
            type="button"
            disabled={loadingMore}
            onClick={() => dispatch(fetchMissingAnimals(lastId))}>
              {loadingMore ? "불러오는 중..." : "이전 글 더 보기"}
            </S.MissingMoreButton>
          )}
        </S.MissingRows>

        <S.MissingWriteFab type="button" onClick={() => setIsModalOpen(true)}>
          <S.MissingWritePlus aria-hidden="true"/>
          신고·제보하기
        </S.MissingWriteFab>

        <ModalSingle
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        titleText="실종/제보 글쓰기"
        submitText="등록하기"
        onSuccess={handleSuccessUpload}/>
      </S.Container>
      <Footer/>
    </S.AppWrapper>
  );
};
