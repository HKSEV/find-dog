"use client";

import React, { useEffect, useState } from "react";
import * as S from "@/assets/css/Style.styles";

// 💡 상세 화면(실종 글, 보호 동물) 상단 바
//    사진(400px) 위에서는 투명하고 뒤로 버튼만 흰 동그라미로 보임
//    사진을 거의 지나면 흰 헤더 + 제목으로 바뀌고, 스크롤해도 위에 고정
const SOLID_AFTER = 400 - 56 - 24; // 사진 높이 - 헤더 높이 - 여유

export default function DetailTopBar({title, onBack}: {title: string; onBack: () => void}) {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > SOLID_AFTER);
    window.addEventListener("scroll", onScroll, {passive: true});
    const timer = setTimeout(onScroll, 0); // 스크롤된 채로 들어온 경우
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <S.DetailTopBar $solid={solid}>
      <S.DetailBackButton type="button" aria-label="뒤로" $solid={solid} onClick={onBack}>
        <S.DetailBackIcon/>
      </S.DetailBackButton>
      <S.DetailTopTitle $show={solid} aria-hidden={!solid}>{title}</S.DetailTopTitle>
    </S.DetailTopBar>
  );
};
