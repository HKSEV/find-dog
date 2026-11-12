// 💡 로그인하고 나서 "하려던 화면"으로 돌아가기
//    로그인이 필요한 곳에서는 loginHref(지금 주소)로 보내고, 로그인 화면은 safeNext로 돌아갈 곳을 고름

// 지금 화면 주소 (예: /shelter/2/apply)
export const currentPath = () => (typeof window === "undefined" ? "/" : window.location.pathname + window.location.search);

export const loginHref = (next?: string) => {
  const target = next ?? currentPath();
  return target && target !== "/" ? `/login?next=${encodeURIComponent(target)}` : "/login";
};

// 다른 사이트로 보내는 주소(//evil.com, https://...)나 로그인·회원가입 화면은 막고 홈으로
export const safeNext = (value: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  if (value.startsWith("/login") || value.startsWith("/signup")) return "/";
  return value;
};

// 회원가입을 마치고 로그인 화면으로 갈 때 넘기는 이메일 (주소에 개인정보를 남기지 않으려고 세션에 잠깐 저장)
export const SIGNUP_EMAIL_KEY = "signup-done-email";
