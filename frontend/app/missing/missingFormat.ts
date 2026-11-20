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

const bandText: Record<string, string> = {DAWN: "새벽", MORNING: "오전", AFTERNOON: "오후", EVENING: "저녁", NIGHT: "밤", UNKNOWN: "(시간 모름)"};

// 잃어버린 때 표시: "11.11 오후" / "11.11 (시간 모름)" / "11.11 오후 2:30" (연도는 안 보임)
export const formatWhen = (iso?: string, occurredTime?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  // 정확한 시각 (예전 글은 occurredTime 없이 시각만 있음)
  if (occurredTime === "EXACT" || (!occurredTime && (hours || date.getMinutes()))) {
    return `${month}.${day} ${hours < 12 ? "오전" : "오후"} ${hours % 12 || 12}:${minutes}`;
  };
  return `${month}.${day} ${bandText[occurredTime ?? "UNKNOWN"] ?? ""}`.trim();
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

// 나이·체중이 숫자만 있으면 단위를 붙여서 보여줌 ("2" -> "2살", "3" -> "3kg", "6개월"은 그대로)
const withUnit = (value: string | undefined, unit: string) => {
  const text = value?.trim() ?? "";
  return /^\d+(\.\d+)?$/.test(text) ? `${text}${unit}` : text;
};
export const ageText = (age?: string) => withUnit(age, "살");
export const weightText = (weight?: string) => withUnit(weight, "kg");

// 이름 (앞뒤 공백 뺀 값, 없으면 "")
export const petNameOf = (post: Pick<MissingAnimal, "petName">) => post.petName?.trim() ?? "";

// 목록·상단 바·공유 제목: 이름이 있으면 이름을 맨 앞에 ("보리 · 진돗개 믹스 · 흰색")
export const missingTitle = (post: Pick<MissingAnimal, "petName" | "title" | "breed">) => {
  const base = post.title || post.breed || "";
  const name = petNameOf(post);
  return name ? `${name} · ${base}` : base;
};

// 저장값 "미상"은 화면에서 "성별 모름"으로
export const genderText = (gender?: string) => (gender === "미상" || gender === "모름" ? "성별 모름" : gender ?? "");

// 목록 한 줄 특징: 제목에 이미 품종·털색이 있으면 빼고 보여줌
// 주소에서 짧은 동네 이름만 ("서울특별시 종로구 사직동 사직공원" -> "사직동", 동이 없으면 구·군·시)
//    국가동물보호정보시스템 공고처럼 목록에는 동네 이름만 짧게 보여줌
export const shortPlace = (address?: string) => {
  const words = (address ?? "").trim().split(/\s+/).filter(Boolean);
  const town = [...words].reverse().find((word) => word.length >= 2 && /(동|읍|면|리|가)$/.test(word));
  if (town) return town;
  const district = [...words].reverse().find((word) => word.length >= 2 && /(구|군|시)$/.test(word));
  return district ?? words[0] ?? "";
};

// 장소 뒤에 "근처" (이미 근처·부근·주변으로 끝나면 그대로)
export const nearText = (place?: string | null) => {
  const text = (place ?? "").trim();
  if (!text) return "";
  return /(근처|부근|주변)$/.test(text) ? text : `${text} 근처`;
};

// 주소에서 동네까지만: "서울 강남구 신사동 649-9" -> "서울 강남구 신사동" (번지는 빼서 집 위치가 드러나지 않게)
export const areaFromAddress = (address?: string | null) => {
  const words = (address ?? "").trim().split(/\s+/).filter(Boolean);
  const numberAt = words.findIndex((word) => /^산?\d/.test(word));
  return words.slice(0, numberAt < 0 ? words.length : numberAt).join(" ");
};

// 목격 글 둘째 줄 앞부분: "사직동에서 봤어요" (장소가 없으면 "")
export const foundPlaceLine = (post: Pick<MissingAnimal, "type" | "rescueLocation">) => {
  if (post.type !== "FOUND") return "";
  const place = shortPlace(post.rescueLocation);
  return place ? `${place}에서 봤어요` : "";
};

// 목록 한 줄 제목
//    실종: 이름(굵게) + 옆에 품종(작고 연하게)
//    목격(이름 없음): 품종(굵게) + 옆에 털색·특징(작고 연하게)
//    이름 없는 예전 실종 글: "품종 · 털색"
export const missingRowHead = (post: Pick<MissingAnimal, "petName" | "title" | "breed" | "type" | "color">) => {
  const name = petNameOf(post);
  if (name) return {main: name, sub: post.breed || ""};
  if (post.type === "FOUND") return {main: post.breed || "품종 모름", sub: post.color || ""};
  return {main: post.title || post.breed || "", sub: ""};
};

// 목록 둘째 줄: 이름이 있으면 털색·특징 · 성별 · 나이 · 몸무게 (품종은 제목 옆에 있으니 뺌)
export const missingRowTraits = (post: MissingAnimal) => {
  if (post.type === "FOUND" && !petNameOf(post)) {
    // 목격 글: 털색은 제목 옆에 있으니 성별·나이·몸무게만 (앞에 "○○동에서 봤어요"가 붙음)
    return [genderText(post.gender), ageText(post.age), weightText(post.weight)].filter(Boolean).join(" · ");
  };
  if (petNameOf(post)) {
    return [post.color, genderText(post.gender), ageText(post.age), weightText(post.weight)].filter(Boolean).join(" · ");
  };
  const title = post.title ?? "";
  return [
    post.breed && !title.includes(post.breed) ? post.breed : "",
    genderText(post.gender),
    ageText(post.age),
    weightText(post.weight),
    post.color && !title.includes(post.color) ? post.color : ""
  ].filter(Boolean).join(" · ");
};
