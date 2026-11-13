// 💡 보호 동물 표시용 함수 (입양 목록, 동물 상세, 홈에서 같이 사용)

// 실종·제보와 같게 동물 성별은 수컷/암컷으로
export const genderLabel: Record<string, string> = {MALE: "수컷", FEMALE: "암컷", UNKNOWN: "성별 모름"};

export const statusLabel: Record<string, string> = {ACTIVE: "보호 중", COMPLETED: "입양 완료"};

// 백엔드에 올린 이미지(/uploads/...)는 백엔드 주소를 붙여서 사용
// (배포할 때 바꿀 곳. API는 next.config의 /api 프록시를 씀)
export const toImageUrl = (url?: string | null) =>
  url && url.startsWith("/uploads/") ? `http://localhost:8080${url}` : url || undefined;

// "2026-11-07" -> "11.07"
export const toMonthDay = (date?: string) => (date ? date.substring(5, 10).replace("-", ".") : "");

// 관심 동물은 아직 서버에 저장하지 않고 이 브라우저에만 저장
export const LIKED_STORAGE_KEY = "likedShelterAnimals";

export const loadLikedIds = (): number[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(LIKED_STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved.filter((id) => typeof id === "number") : [];
  } catch {
    return [];
  };
};

export const saveLikedIds = (ids: number[]) => {
  try {
    localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // 저장이 막힌 브라우저(사생활 보호 모드 등)에서는 이번 방문 동안만 유지
  };
};
