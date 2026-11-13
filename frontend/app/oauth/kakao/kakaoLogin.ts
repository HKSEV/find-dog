// 💡 카카오 로그인
//    1. startKakaoLogin: 백엔드가 카카오 로그인 화면으로 보냄
//    2. 로그인이 끝나면 백엔드가 /oauth/kakao#token=...&nickname=...&signup=0|1 로 돌려보냄
//    3. 처음 온 회원(signup=1)은 /signup/kakao 에서 약관 동의와 이름·휴대폰을 받은 뒤에 로그인 상태가 됨
import { safeNext } from "../../components/loginLink";

// 프록시를 거치지 않고 백엔드로 바로 보냄 (카카오가 돌려보내는 주소가 백엔드 8080이라 세션이 같은 곳에 있어야 함)
const KAKAO_START_URL = "http://localhost:8080/oauth2/authorization/kakao";
const NEXT_KEY = "kakao-next"; // 로그인 뒤 돌아갈 화면
const PENDING_KEY = "kakao-signup"; // 가입을 아직 안 마친 카카오 회원의 토큰

export interface KakaoPending {
  token: string;
  nickname: string;
}

export const startKakaoLogin = (next?: string | null) => {
  try {
    sessionStorage.setItem(NEXT_KEY, safeNext(next ?? null));
  } catch {
    // 저장이 막힌 브라우저면 홈으로 돌아옴
  };
  window.location.href = KAKAO_START_URL;
};

export const takeKakaoNext = () => {
  try {
    const next = sessionStorage.getItem(NEXT_KEY);
    sessionStorage.removeItem(NEXT_KEY);
    return safeNext(next);
  } catch {
    return "/";
  };
};

export const savePending = (pending: KakaoPending) => {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    return true;
  } catch {
    return false;
  };
};

export const readPending = (): KakaoPending | null => {
  try {
    const value = JSON.parse(sessionStorage.getItem(PENDING_KEY) ?? "null");
    return value && typeof value.token === "string" && typeof value.nickname === "string" ? value : null;
  } catch {
    return null;
  };
};

export const clearPending = () => {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // 무시
  };
};

// 로그인 상태로 저장 (카카오 회원은 이메일이 없어서 마이 화면에 이메일을 보이지 않음)
export const saveKakaoLogin = (token: string, nickname: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("nickname", nickname);
  localStorage.removeItem("email");
};
