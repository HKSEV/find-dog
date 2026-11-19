import React from "react";
import * as S from "@/assets/css/Style.styles";

// 💡 실종 글쓰기 맨 위 안내: 공식 신고처에도 함께 신고하도록 알려줌
export default function DemoNotice() {
  return (
    <S.DemoNotice role="note">
      <a href="https://www.animal.go.kr" target="_blank" rel="noopener noreferrer">국가동물보호정보시스템</a>
      이나 지자체에도 함께 신고하면 더 빨리 찾을 수 있어요.
    </S.DemoNotice>
  );
};
