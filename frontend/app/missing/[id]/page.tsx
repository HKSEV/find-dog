"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchMissingPost } from "../../redux/missingSlice";
import { setActiveTab } from "../../redux/shelterSlice";
import { toImageUrl } from "../../shelter/animalFormat";
import { formatWhen, genderText, missingBadge, placeLabel, timeAgo, whenLabel } from "../missingFormat";

import Header from "@/app/components/Header";
import DetailTopBar from "@/app/components/DetailTopBar";
import MiniMap from "@/app/components/map/MiniMap";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import { queueToast, showToast } from "@/app/components/Toast";
import { completeMissingPost, deleteMissingPost, toMissingError } from "../missingApi";
import * as S from "@/assets/css/Style.styles";

export default function MissingPostDetail() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams<{id: string}>();
  const id = Number(params.id);

  const {detail, detailError} = useSelector((state: RootState) => state.missing);
  const post = detail?.id === id ? detail : null;

  const [confirm, setConfirm] = useState<"complete" | "delete" | null>(null); // 한 번 더 묻는 중인 일
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (Number.isFinite(id)) dispatch(fetchMissingPost(id));
  }, [dispatch, id]);

  // 💡 작성자만: 찾았어요로 바꾸기 / 삭제
  const handleConfirm = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      if (confirm === "complete") {
        await completeMissingPost(id);
        setConfirm(null);
        dispatch(fetchMissingPost(id));
        showToast("찾았어요로 바꿨어요. 다행이에요!");
      } else {
        await deleteMissingPost(id);
        queueToast("글을 지웠어요");
        router.replace("/missing");
      };
    } catch (error) {
      setConfirm(null);
      showToast(toMissingError(error, "처리하지 못했어요. 잠시 후 다시 시도해 주세요."));
    } finally {
      setBusy(false);
    };
  };

  // 목록에서 들어왔으면 뒤로, 주소로 바로 들어왔으면 실종·제보 목록으로
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/missing");
    };
  };

  if (!post) {
    const message = detailError === "NOT_FOUND" || !Number.isFinite(id)
      ? "삭제됐거나 없는 글이에요"
      : detailError
        ? "글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요"
        : "불러오는 중이에요";

    return (
      <S.AppWrapper>
        <S.Container>
          <Header title="실종·제보" onBackClick={handleBack}/>
          <S.HeaderOffset/>
          <S.AdoptEmpty>{message}</S.AdoptEmpty>
        </S.Container>
      </S.AppWrapper>
    );
  };

  const done = post.status === "COMPLETED";
  const author = post.authorName?.trim(); // 백엔드가 닉네임을 줌 (없으면 "익명")
  const photos = (post.mediaUrls ?? []).map((url) => toImageUrl(url)).filter((url): url is string => Boolean(url));
  const facts = [
    {label: "품종", value: post.breed},
    {label: "성별", value: genderText(post.gender)},
    {label: "나이", value: post.age},
    {label: "체중", value: post.weight},
    {label: "털색", value: post.color},
    {label: whenLabel(post.type), value: formatWhen(post.occurredAt, post.occurredTime)}
  ].filter((fact) => fact.value);

  // 3칸 격자의 마지막 줄이 비지 않게, 마지막 칸이 남은 자리를 채움
  const lastSpan = 1 + ((3 - (facts.length % 3)) % 3);

  return (
    <S.AppWrapper>
      <S.Container>
        <DetailTopBar title={post.title || post.breed} onBack={handleBack}/>
        <S.DetailPage>
          <S.DetailHero>
            {photos.length > 0 ? (
              <S.DetailGallery>
                {photos.map((url, index) => (
                  <S.DetailHeroImage key={url} src={url} alt={`${post.breed || "실종 동물"} 사진 ${index + 1}`}/>
                ))}
              </S.DetailGallery>
            ) : (
              <S.AdoptPhotoEmpty $height="400px" $square>사진 없음</S.AdoptPhotoEmpty>
            )}
            {photos.length > 1 && <S.DetailPhotoCount>사진 {photos.length}장 · 옆으로 넘겨 보세요</S.DetailPhotoCount>}
          </S.DetailHero>

          <S.DetailSection>
            <S.MissingBadge $tone={missingBadge(post).tone}>{missingBadge(post).label}</S.MissingBadge>
            <S.DetailTitle>{post.title || post.breed}</S.DetailTitle>
            <S.DetailNotice>{[author && `작성자 ${author}`, timeAgo(post.createdAt)].filter(Boolean).join(" · ")}</S.DetailNotice>

            {facts.length > 0 && (
              <S.DetailFacts>
                {facts.map((fact, index) => (
                  <S.DetailFact key={fact.label} $span={index === facts.length - 1 ? lastSpan : undefined}>
                    <dt>{fact.label}</dt><dd>{fact.value}</dd>
                  </S.DetailFact>
                ))}
                {post.rescueLocation && (
                  <S.DetailFact $span={3}><dt>{placeLabel(post.type)}</dt><dd>{post.rescueLocation}</dd></S.DetailFact>
                )}
              </S.DetailFacts>
            )}
          </S.DetailSection>

          {/* 지도에서 고른 장소가 있으면 근처 반경 원으로 */}
          {post.lat != null && post.lng != null && (
            <S.DetailSection>
              <S.DetailHeading>{placeLabel(post.type)} 근처</S.DetailHeading>
              <S.DetailMapWrap>
                <MiniMap point={{lat: post.lat, lng: post.lng}} label={post.rescueLocation || placeLabel(post.type)}/>
              </S.DetailMapWrap>
            </S.DetailSection>
          )}

          {post.content && (
            <S.DetailSection>
              <S.DetailHeading>{done ? "돌아온 이야기" : post.type === "FOUND" ? "이런 아이를 봤어요" : "찾고 있어요"}</S.DetailHeading>
              <S.DetailText>{post.content}</S.DetailText>
            </S.DetailSection>
          )}

          {!done && post.type !== "FOUND" && (
            <S.DetailSection>
              <S.MissingShelterHint as={Link} href="/shelter" $flush onClick={() => dispatch(setActiveTab("입양"))}>
                <S.MissingHintSearchIcon aria-hidden="true"/>
                <span><strong>보호소에 들어왔을 수도 있어요.</strong> 보호소 공고도 확인해 보세요.</span>
                <S.MissingHintChevron aria-hidden="true"/>
              </S.MissingShelterHint>
            </S.DetailSection>
          )}
        </S.DetailPage>

        {/* 내 글이면 아래에 관리 버튼 */}
        {post.mine && (
          <S.DetailActionBar>
            <S.MissingOwnerButton type="button" onClick={() => router.push(`/missing/write?edit=${post.id}`)}>수정</S.MissingOwnerButton>
            <S.MissingOwnerButton type="button" $danger onClick={() => setConfirm("delete")}>삭제</S.MissingOwnerButton>
            {!done && (
              <S.DetailApplyButton type="button" onClick={() => setConfirm("complete")}>
                {post.type === "FOUND" ? "주인을 찾았어요" : "찾았어요"}
              </S.DetailApplyButton>
            )}
          </S.DetailActionBar>
        )}
      </S.Container>

      <ConfirmDialog
      isOpen={confirm === "complete"}
      title={post.type === "FOUND" ? "주인을 찾았나요?" : "아이를 찾았나요?"}
      message="목록에서 '찾았어요'로 바뀌고, 찾는 중인 글 목록에서는 빠져요."
      confirmText="찾았어요"
      busy={busy}
      onConfirm={handleConfirm}
      onCancel={() => setConfirm(null)}/>

      <ConfirmDialog
      isOpen={confirm === "delete"}
      title="글을 지울까요?"
      message="지운 글은 되돌릴 수 없어요."
      confirmText="지우기"
      danger
      busy={busy}
      onConfirm={handleConfirm}
      onCancel={() => setConfirm(null)}/>
    </S.AppWrapper>
  );
};
