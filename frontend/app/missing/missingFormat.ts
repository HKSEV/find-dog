// 💡 실종·제보 글 표시용 함수 (실종 목록, 실종 상세에서 같이 사용)
import type { MissingAnimal } from "../redux/missingSlice";

export const missingStatusLabel: Record<string, string> = {MISSING: "실종 · 찾는 중", COMPLETED: "찾았어요"};

// 작성 시각 -> "방금 전", "N분 전", "N시간 전", "어제", "N일 전", "11.07"
export const timeAgo = (iso?: string) => {
  if (!iso) return "";
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (Number.isNaN(minutes)) return "";
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}시간 전`;
  const days = Math.floor(minutes / (60 * 24));
  if (days === 1) return "어제";
  if (days < 30) return `${days}일 전`;
  return iso.substring(5, 10).replace("-", ".");
};

// 성별 · 나이 · 체중 · 털색 (비어 있는 값은 빼고)
export const missingTraits = (post: MissingAnimal) =>
  [post.gender, post.age, post.weight, post.color].filter(Boolean).join(" · ");
