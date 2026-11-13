// 💡 회원 로그인 토큰(localStorage "token")이 끝났는지 확인
//    서버 토큰은 1시간 뒤 끝나는데(jwt.expiration-time), 화면은 토큰이 남아 있으면 계속 로그인 상태로 보였음

// JWT 가운데 부분(payload)의 exp(초)를 읽어서 지났는지 확인. 읽지 못하면 끝나지 않은 것으로 봄 (서버가 401로 알려 줌)
export const isTokenExpired = (token: string) => {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const {exp} = JSON.parse(atob(padded)) as {exp?: number};
    return typeof exp === "number" && exp * 1000 <= Date.now();
  } catch {
    return false;
  };
};

// 로그인 정보 지우기
export const clearLoginStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("nickname");
  localStorage.removeItem("email");
};

// 끝난 토큰을 누가 먼저 지웠든(화면의 로그인 확인이 먼저일 수 있음) 알림은 한 번 띄우게 표시해 둠
let expiredNotice = false;

export const clearIfExpired = () => {
  const token = localStorage.getItem("token");
  if (!token || !isTokenExpired(token)) return false;
  clearLoginStorage();
  expiredNotice = true;
  return true;
};

// 알릴 게 있으면 true를 주고 표시를 지움
export const takeExpiredNotice = () => {
  clearIfExpired();
  const pending = expiredNotice;
  expiredNotice = false;
  return pending;
};
