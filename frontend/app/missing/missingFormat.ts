// 💡 실종·제보 글 표시용 함수 (실종 목록, 실종 상세에서 같이 사용)
import type { MissingAnimal } from "../redux/missingSlice";

export type MissingTone = "lost" | "found" | "done";

// 배지 글자와 색: 실종(빨강) / 목격(브랜드 연한색) / 찾았어요(회색)
export const missingBadge = (post: Pick<MissingAnimal, "status" | "type">): {label: string; tone: MissingTone} => {
  if (post.status === "COMPLETED") return {label: "찾았어요", tone: "done"};
  if (post.type === "FOUND") return {label: "목격 · 주인 찾는 중", tone: "found"};
  return {label: "실종 · 찾는 중", tone: "lost"};
};

// 장소·때 칸 이름 (종류에 따라)
export const placeLabel = (type?: string) => (type === "FOUND" ? "발견한 장소" : "잃어버린 장소");
export const whenLabel = (type?: string) => (type === "FOUND" ? "발견한 때" : "잃어버린 때");

// "2026-11-11T14:30:00" -> "11.11 오후 2:30"
export const formatWhen = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}.${day} ${hours < 12 ? "오전" : "오후"} ${hours % 12 || 12}:${minutes}`;
};

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

// 저장값 "미상"은 화면에서 "성별 모름"으로
export const genderText = (gender?: string) => (gender === "미상" ? "성별 모름" : gender ?? "");

// 목록 한 줄 특징: 제목에 이미 품종·털색이 있으면 빼고 보여줌
export const missingRowTraits = (post: MissingAnimal) => {
  const title = post.title ?? "";
  return [
    post.breed && !title.includes(post.breed) ? post.breed : "",
    genderText(post.gender),
    post.age,
    post.weight,
    post.color && !title.includes(post.color) ? post.color : ""
  ].filter(Boolean).join(" · ");
};
