"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import * as S from "@/assets/css/Style.styles";

// 💡 없는 주소 (out/404.html): 영어 기본 화면 대신 우리말 안내 + 홈으로
//    배포 서버(Apache)는 public/.htaccess 의 ErrorDocument 로 이 화면을 보여 줌
export default function NotFound() {
  const router = useRouter();

  // 주소로 바로 들어와서 돌아갈 곳이 없으면 홈으로
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    };
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="페이지 없음" onBackClick={handleBack}/>
        <S.HeaderOffset/>
        <S.MissingEmptyText>
          주소가 바뀌었거나 없는 페이지예요.<br/>
          <Link href="/">홈으로 가기</Link>
        </S.MissingEmptyText>
      </S.Container>
    </S.AppWrapper>
  );
};
