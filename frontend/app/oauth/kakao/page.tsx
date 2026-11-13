"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { loadUserFromStorage } from "../../redux/userSlice";
import { queueToast } from "../../components/Toast";
import { saveKakaoLogin, savePending, takeKakaoNext } from "./kakaoLogin";
import * as S from "@/assets/css/Style.styles";

// 이 화면이 새로 열린 첫 화면이라 토스트 자리(ToastHost)가 아직 준비 전일 수 있음 → 한 박자 뒤에 띄움
// (개발 모드에서 effect가 다시 돌아도 취소하지 않으려고 타이머를 지우지 않음)
const toastLater = (message: string) => {
  setTimeout(() => queueToast(message), 0);
};

// 💡 카카오 로그인에서 돌아오는 화면. 토큰을 저장하고 바로 다음 화면으로 넘김
export default function KakaoCallbackPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const handled = useRef(false); // 개발 모드에서 effect가 두 번 돌아도 한 번만 처리 (두 번째에는 주소의 토큰이 이미 지워져 있음)

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("token");
    const nickname = params.get("nickname") || "회원";
    // 토큰이 주소창·방문 기록에 남지 않게 지움
    window.history.replaceState(null, "", window.location.pathname);

    if (!token) {
      toastLater("카카오 로그인을 하지 못했어요. 다시 시도해 주세요.");
      router.replace("/login");
      return;
    };

    // 처음 온 회원: 추가 정보를 받기 전까지는 로그인 상태로 두지 않음
    if (params.get("signup") === "1" && savePending({token, nickname})) {
      router.replace("/signup/kakao");
      return;
    };

    saveKakaoLogin(token, nickname);
    dispatch(loadUserFromStorage());
    toastLater(`${nickname}님, 반가워요`);
    router.replace(takeKakaoNext());
  }, [dispatch, router]);

  return (
    <S.AppWrapper>
      <S.Container>
        <S.AdoptEmpty role="status">카카오 로그인 중이에요</S.AdoptEmpty>
      </S.Container>
    </S.AppWrapper>
  );
}
