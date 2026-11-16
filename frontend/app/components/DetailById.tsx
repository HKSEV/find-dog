"use client";

import { Suspense, type ComponentType } from "react";
import { useSearchParams } from "next/navigation";

import * as S from "@/assets/css/Style.styles";

interface DetailByIdProps {
  component: ComponentType<{id: number}>;
}

function DetailContent({component: Component}: DetailByIdProps) {
  const id = Number(useSearchParams().get("id"));
  if (!Number.isSafeInteger(id) || id < 1) {
    return (
      <S.AppWrapper>
        <S.Container>
          <S.AdoptEmpty>상세 주소를 확인해 주세요.</S.AdoptEmpty>
        </S.Container>
      </S.AppWrapper>
    );
  };
  return <Component key={id} id={id}/>;
};

export default function DetailById({component}: DetailByIdProps) {
  return (
    <Suspense fallback={null}>
      <DetailContent component={component}/>
    </Suspense>
  );
};
