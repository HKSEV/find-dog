"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { setActiveTab } from "../redux/shelterSlice";
import * as S from "@/assets/css/Style.styles";

// 💡 실종·제보 목록 위 "보호소 공고도 확인해 보세요" 안내
//    잠깐 보여 주고 5초 뒤 접힘. 손가락·마우스를 올리거나 키보드로 들어가 있으면 기다렸다가 2초 뒤 접힘
//    이번 방문(탭을 닫기 전까지)에 한 번 봤으면 다시 띄우지 않음
const SEEN_KEY = "missingShelterHintSeen";
const SHOW_MS = 5000;
const RESUME_MS = 2000;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function ShelterHint() {
  const dispatch = useDispatch<AppDispatch>();
  const [phase, setPhase] = useState<"show" | "hiding" | "gone">("show");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  // 접기 예약: 움직임 줄이기 설정이면 바로 없앰, 아니면 접히는 애니메이션 뒤 없앰(transitionend)
  const schedule = (ms: number) => {
    stop();
    timerRef.current = setTimeout(() => setPhase(prefersReducedMotion() ? "gone" : "hiding"), ms);
  };

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // 저장소를 못 쓰는 브라우저(사생활 보호 모드 등)는 매번 잠깐 보여 줌
    };
    if (seen) {
      timerRef.current = setTimeout(() => setPhase("gone"), 0);
    } else {
      timerRef.current = setTimeout(() => setPhase(prefersReducedMotion() ? "gone" : "hiding"), SHOW_MS);
    };
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (phase === "gone") return null;

  const hiding = phase === "hiding";

  return (
    <S.MissingHintCollapse
    $hiding={hiding}
    onTransitionEnd={(e) => {
      if (hiding && e.propertyName === "grid-template-rows") setPhase("gone");
    }}>
      <div>
        <S.MissingShelterHint
        as={Link}
        href="/shelter"
        tabIndex={hiding ? -1 : undefined}
        onClick={() => dispatch(setActiveTab("입양"))}
        onPointerEnter={() => !hiding && stop()}
        onPointerLeave={() => !hiding && schedule(RESUME_MS)}
        onFocus={() => !hiding && stop()}
        onBlur={() => !hiding && schedule(RESUME_MS)}>
          <S.MissingHintSearchIcon aria-hidden="true"/>
          <span><strong>잃어버린 아이가 보호소에 들어왔을 수도 있어요.</strong> 보호소 공고도 확인해 보세요.</span>
          <S.MissingHintChevron aria-hidden="true"/>
        </S.MissingShelterHint>
      </div>
    </S.MissingHintCollapse>
  );
};
