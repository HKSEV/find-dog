"use client";

import React from "react";
import * as S from "@/assets/css/Style.styles";

// 💡 입양·봉사 탭 > 보호소
//    보호소 정보(이름, 주소, 연락처, 위치)를 담을 백엔드 테이블이 아직 없어서 안내만 보여줌
export default function ShelterTab() {
  return (
    <S.VolunteerSection $first>
      <S.VolunteerNotice>
        <strong>보호소 정보를 준비하고 있어요</strong>
        <span>가까운 보호소와 보호 중인 친구 수, 봉사 모집 소식을 여기서 볼 수 있게 할게요.</span>
      </S.VolunteerNotice>
    </S.VolunteerSection>
  );
};
