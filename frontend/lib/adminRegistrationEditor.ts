import { AdminRegistrationRow, AdminRegistrationSource, adoptionStates } from "@/lib/adminRegistrations";

interface RegistrationOption {
  value: string;
  label: string;
}

export interface RegistrationEditField {
  name: string;
  label: string;
  type?: "text" | "url" | "number" | "date" | "time" | "textarea" | "select" | "radio" | "image";
  options?: RegistrationOption[];
  optional?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  wide?: boolean;
  when?: (values: Record<string, string>) => boolean;
}

const option = (value: string, label: string): RegistrationOption => ({value, label});
const title: RegistrationEditField = {name: "title", label: "제목", maxLength: 256, wide: true};
const content: RegistrationEditField = {name: "content", label: "상세 내용", type: "textarea", wide: true};
const thumbnail: RegistrationEditField = {name: "thumbnailUrl", label: "썸네일 이미지 URL", maxLength: 1000, wide: true};
const storyFields: RegistrationEditField[] = [
  title,
  content,
  {name: "imageUrl", label: "대표 이미지 URL", maxLength: 1000, wide: true},
  {name: "videoUrl", label: "동영상 첨부 URL (선택)", optional: true, maxLength: 1000},
  {name: "attachmentUrl", label: "기타 첨부파일 URL (선택)", optional: true, maxLength: 1000}
];

export const registrationEditFields: Record<AdminRegistrationSource, RegistrationEditField[]> = {
  animals: [
    {
      name: "sourceType", label: "등록 출처 선택", type: "radio", wide: true,
      options: [option("DIRECT", "자체 직접 등록"), option("FACEBOOK", "페이스북 링크"), option("INSTAGRAM", "인스타그램 링크")]
    },
    {name: "sourceUrl", label: "SNS 포스팅 URL", type: "url", maxLength: 500, wide: true, when: (values) => values.sourceType !== "DIRECT"},
    {name: "region", label: "지역", maxLength: 20},
    {name: "noticeNo", label: "공고번호 / 이름", maxLength: 100},
    {name: "birthYear", label: "출생년도", maxLength: 10},
    {name: "gender", label: "성별", type: "select", options: [option("M", "수컷 (M)"), option("F", "암컷 (F)")]},
    {name: "weight", label: "체중 (kg)", type: "number"},
    {name: "imageUrl", label: "동물 사진 URL", maxLength: 1000, wide: true}
  ],
  campaigns: [
    {
      name: "mediaType", label: "미디어 타입 설정", type: "radio", wide: true,
      options: [option("IMAGE", "이미지형"), option("YOUTUBE", "유튜브 링크형"), option("DIRECT_VIDEO", "서버 직접 업로드형")]
    },
    {
      name: "hashtag", label: "해시태그 (말머리)", type: "select",
      options: ["#제주입양", "#임시보호", "#치료지원", "#입양홍보", "#구조스토리"].map((tag) => option(tag, tag))
    },
    title,
    content,
    {name: "mediaUrl", label: "동영상 주소 / 업로드 경로", maxLength: 1000, wide: true, when: (values) => values.mediaType !== "IMAGE"},
    thumbnail
  ],
  youtubePosts: [title, {name: "youtubeUrl", label: "유튜브 영상 주소 (URL)", type: "url", maxLength: 1000, wide: true}, thumbnail],
  fellowNews: storyFields,
  needHelps: storyFields,
  shelterAnimals: [
    {name: "status", label: "공고상태", type: "select", options: [option("ACTIVE", "공고중 (보호중)"), option("COMPLETED", "입양 완료 / 종료")]},
    {name: "gender", label: "성별", type: "select", options: [option("UNKNOWN", "성별 미상"), option("MALE", "수컷"), option("FEMALE", "암컷")]},
    {name: "name", label: "이름 (선택)", optional: true, maxLength: 30},
    {name: "breed", label: "품종", maxLength: 255},
    {name: "noticeNo", label: "공고번호", maxLength: 255},
    {name: "regDate", label: "등록날짜", type: "date"},
    {name: "rescueLocation", label: "구조장소", maxLength: 255},
    {name: "imageUrl", label: "대표 사진", type: "image", maxLength: 1000, wide: true},
    {...content, label: "특이사항 및 상세 설명"}
  ],
  volunteers: [
    {...title, maxLength: 100},
    {name: "place", label: "봉사 장소", maxLength: 255, wide: true},
    {name: "activityDate", label: "봉사일", type: "date"},
    {name: "capacity", label: "모집 인원", type: "number", min: 1, max: 500, step: 1},
    {name: "startTime", label: "시작 시간", type: "time"},
    {name: "endTime", label: "종료 시간", type: "time"},
    {name: "closed", label: "관리자 마감", type: "select", options: [option("false", "일정·정원에 따라 모집"), option("true", "마감")]},
    {name: "imageUrl", label: "대표 이미지 URL", maxLength: 500, optional: true, wide: true},
    {...content, optional: true}
  ],
  adoptionApplications: [
    {name: "status", label: "변경할 상태", type: "select", options: ["FORWARDED", "ADOPTED", "REJECTED"].map((value) => option(value, adoptionStates[value]))},
    {name: "reason", label: "처리 사유 (선택)", optional: true, maxLength: 255, wide: true}
  ],
  missingPosts: [],
  communityPosts: []
};

export const getRegistrationEditValues = (row: AdminRegistrationRow) =>
  Object.fromEntries(registrationEditFields[row.source].map(({name}) => {
    const value = row.record[name];
    return [name, typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : ""];
  }));

export const getRegistrationThumbnail = (url: string) => {
  const match = url.match(/^.*(?:youtu.be\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/);
  return match?.[1].length === 11 ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
};
