"use client";

import React from "react";
import type { MissingAnimal } from "../redux/missingSlice";
import { foundPlaceLine, missingRowHead, missingRowTraits } from "./missingFormat";
import * as S from "@/assets/css/Style.styles";

// 💡 실종·목격 목록 한 줄의 제목 + 둘째 줄 (실종 목록, 내 글, 근처 제보에서 같이 씀)
//    실종: [이름 품종] / 털색 · 성별 · 나이 · 몸무게
//    목격: [품종 털색] / (핀) 사직동에서 봤어요 · 성별
export default function MissingRowLines({post}: {post: MissingAnimal}) {
  const head = missingRowHead(post);
  const place = foundPlaceLine(post);
  const traits = missingRowTraits(post);
  return (
    <>
      <S.MissingRowTitle>{head.main}{head.sub && <small>{head.sub}</small>}</S.MissingRowTitle>
      {(place || traits) && (
        <S.MissingRowTraits>
          {place && <><S.MissingRowPinIcon aria-hidden="true"/>{place}</>}
          {place && traits ? " · " : ""}
          {traits}
        </S.MissingRowTraits>
      )}
    </>
  );
};
