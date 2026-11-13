// 💡 사용자 화면 전용 색상 토큰
// 관리자 화면도 styled-components로 옮기면 common/으로 옮겨서 같이 사용

export const colors = {
  // 브랜드
  brand: "#8a4e4b",        // 버튼, 강조 글자, 입력창 포커스
  brandBg: "#fbefec",      // 브랜드 연한 배경 (홈 "발견했어요", 모두 만나기 카드)
  brandBgSoft: "#fdf6f4",  // brandBg보다 옅은 배경 (알림의 새 알림: 상태 라벨 색이 묻히지 않게)
  logo: "#c17f4a",         // 로고 귀·글자
  logoFeature: "#2c2522",  // 로고 눈·코

  // 상태
  success: "#198754",
  successText: "#1f7a4d",  // 연한 초록 배지 글자 (알림 "입양 확정")
  successBg: "#e6f4ec",
  warning: "#b45309",      // 연한 주황 배지 글자 (봉사 "마감 임박")
  warningBg: "#fdf0e1",
  danger: "#dc3545",

  // 바깥 서비스 규정 색
  kakao: "#FEE500",        // 카카오 로그인 버튼 노란색 (카카오 디자인 가이드)

  // 글자 (진함 -> 흐림)
  gray900: "#222",         // 강조 제목 (예전 #111 포함)
  gray800: "#333",         // 본문 (예전 #444, #495057 포함)
  gray500: "#666",         // 보조 글자·아이콘 (예전 #555 포함)
  gray400: "#888",         // 흐린 글자·라벨 (예전 #999, #aaa 포함)
  gray200: "#ccc",         // 비활성 버튼·옅은 선

  // 배경·선
  white: "#fff",
  border: "#eee",
  bgSubtle: "#f1f3f5",
  bgLight: "#f9f9f9",      // (예전 #f8f9fa 포함)
  bgMuted: "#e4e5e7",      // 프로필 사진 자리
} as const;

// 💡 글자 굵기 3단계 (+ 보조 500)
//    제목(화면·섹션, 17px 이상)은 bold, 카드 이름·버튼·배지는 semibold, 본문·설명은 regular
//    800은 쓰지 않음 (작은 화면에서 글자가 뭉쳐 보임)
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700
} as const;

// 💡 큰 제목 크기: 화면 폭 430px 이상에서는 max, 좁아지면 줄어들되 min 아래로는 안 내려감
//    예: fluid(22, 26) -> 375px(아이폰 미니)에서 22px, 430px 이상에서 26px
export const fluid = (min: number, max: number) =>
  `clamp(${min}px, ${(max / 4.3).toFixed(2)}vw, ${max}px)`;
