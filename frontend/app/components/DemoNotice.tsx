import React from "react";
import * as S from "@/assets/css/Style.styles";

// 💡 포트폴리오 데모 사이트 안내 (홈, 실종 글쓰기 맨 위)
//    실제로 반려동물을 잃어버린 사람이 여기에만 신고하지 않도록 공식 신고처를 같이 알려줌
export default function DemoNotice() {
  return (
    <S.DemoNotice role="note">
      포트폴리오용 데모 사이트예요. 실제 실종 신고는{" "}
      <a href="https://www.animal.go.kr" target="_blank" rel="noopener noreferrer">국가동물보호정보시스템</a>
      이나 지자체에 함께 해 주세요.
    </S.DemoNotice>
  );
};
