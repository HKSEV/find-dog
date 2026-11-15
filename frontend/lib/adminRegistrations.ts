import { dashboardSources, getDashboardDate } from "@/lib/adminDashboard";

const registrationSources = [
  ...dashboardSources,
  {key: "animals", label: "추천 동물", endpoint: "/api/animals/recommended"},
  {key: "adoptionApplications", label: "입양 신청", endpoint: "/api/admin/adoption-applications"},
  {key: "missingPosts", label: "실종·제보 글", endpoint: "/api/admin/missing-posts"},
  {key: "communityPosts", label: "회원 게시물", endpoint: "/api/admin/community-posts"}
] as const;

export type AdminRegistrationSource = (typeof registrationSources)[number]["key"];
export type AdminCreateKind = "needHelp" | "volunteer";
export type AdminRegistrationKind = "recommended" | "campaign" | "integrate" | "shelter" |
  AdminCreateKind | "adoption" | "missing" | "community";

export interface AdminRegistrationRow {
  key: string;
  id: number;
  source: AdminRegistrationSource;
  record: Record<string, unknown>;
  cells: string[];
  category: string;
  searchText: string;
  timestamp: number;
}

export const registrationConfigs: Record<
  AdminRegistrationKind,
  {
    title: string;
    columns: string[];
    placeholder: string;
    sources: AdminRegistrationSource[];
    filterLabel?: string;
    editLabel?: string;
    postPath?: string;
    deletable?: boolean;
  }
> = {
  recommended: {
    title: "등록된 추천 동물",
    columns: ["공고번호", "지역", "출생연도", "성별", "등록 방식"],
    placeholder: "공고번호·지역·등록 방식 검색",
    sources: ["animals"]
  },
  campaign: {
    title: "등록된 캠페인",
    columns: ["제목", "해시태그", "미디어 형식", "등록일"],
    placeholder: "제목·해시태그·미디어 형식 검색",
    sources: ["campaigns"]
  },
  integrate: {
    title: "등록된 보호소 콘텐츠",
    columns: ["제목", "유형", "등록일"],
    placeholder: "제목·유형 검색",
    sources: ["youtubePosts", "fellowNews"],
    filterLabel: "콘텐츠 유형"
  },
  shelter: {
    title: "등록된 보호 동물",
    columns: ["공고번호", "품종", "구조 위치", "성별", "상태", "등록일"],
    placeholder: "공고번호·품종·구조 위치 검색",
    sources: ["shelterAnimals"]
  },
  needHelp: {
    title: "등록된 도움 요청",
    columns: ["제목", "등록일"],
    placeholder: "제목 검색",
    sources: ["needHelps"]
  },
  volunteer: {
    title: "봉사 모집 목록",
    columns: ["제목", "봉사일", "장소", "신청 / 정원", "모집 상태"],
    placeholder: "제목·장소·모집 상태 검색",
    sources: ["volunteers"],
    filterLabel: "모집 상태",
    editLabel: "상세"
  },
  adoption: {
    title: "입양 신청 목록",
    columns: ["보호 동물", "공고번호", "신청자", "진행 상태", "신청일"],
    placeholder: "품종·공고번호·신청자·상태 검색",
    sources: ["adoptionApplications"],
    filterLabel: "진행 상태",
    editLabel: "신청서",
    deletable: false
  },
  missing: {
    title: "실종·제보 목록",
    columns: ["제목", "유형", "상태", "등록일"],
    placeholder: "제목·유형·상태 검색",
    sources: ["missingPosts"],
    filterLabel: "제보 유형",
    postPath: "/missing"
  },
  community: {
    title: "커뮤니티 회원 게시물",
    columns: ["제목", "분류", "등록일"],
    placeholder: "제목·분류 검색",
    sources: ["communityPosts"],
    filterLabel: "게시물 분류",
    postPath: "/story"
  }
};

export const normalizeAdminSearch = (text: string) =>
  text.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("ko-KR");

export const getRegistrationSources = (kind: AdminRegistrationKind) =>
  registrationSources.filter(({key}) => registrationConfigs[kind].sources.includes(key));

const text = (value: unknown) => (typeof value === "string" || typeof value === "number" ? String(value) : "—");
const genderLabels: Record<string, string> = {M: "수컷", MALE: "수컷", F: "암컷", FEMALE: "암컷", UNKNOWN: "미상"};
const sourceLabels: Record<string, string> = {DIRECT: "직접 등록", FACEBOOK: "페이스북", INSTAGRAM: "인스타그램"};
const mediaLabels: Record<string, string> = {IMAGE: "이미지", YOUTUBE: "유튜브", DIRECT_VIDEO: "동영상"};
const statusLabels: Record<string, string> = {ACTIVE: "보호 중", COMPLETED: "입양 완료"};
const volunteerStates: Record<string, string> = {OPEN: "모집 중", FULL: "정원 마감", CLOSED: "모집 종료"};
const communityCategories: Record<string, string> = {
  FREE: "자유 이야기", ADOPTION_REVIEW: "입양 후기", RESCUE_STORY: "구조 이야기", QUESTION: "질문"
};
export const adoptionStates: Record<string, string> = {
  RECEIVED: "접수", FORWARDED: "보호소 전달", ADOPTED: "입양 확정", REJECTED: "입양 불가", CANCELED: "신청 취소"
};

export const createRegistrationRows = (
  kind: AdminRegistrationKind,
  source: AdminRegistrationSource,
  records: unknown
): AdminRegistrationRow[] => {
  if (!Array.isArray(records)) throw new Error("목록 응답이 올바르지 않습니다.");
  const sourceLabel = registrationSources.find(({key}) => key === source)?.label || "";

  return records.map((record: Record<string, unknown>) => {
    if (!record || typeof record !== "object" || record.id == null || !Number.isFinite(Number(record.id))) {
      throw new Error("등록 항목 정보가 올바르지 않습니다.");
    };
    const rawDate =
      typeof record.insertDt === "string"
        ? record.insertDt
        : typeof record.createdAt === "string"
          ? record.createdAt
          : "";
    const date = getDashboardDate(rawDate);
    const dateLabel = date ? date.replaceAll("-", ".") : "—";
    let category = sourceLabel;
    let cells: string[];

    if (kind === "recommended") {
      cells = [
        text(record.noticeNo),
        text(record.region),
        text(record.birthYear),
        genderLabels[text(record.gender)] || text(record.gender),
        sourceLabels[text(record.sourceType)] || text(record.sourceType)
      ];
    } else if (kind === "campaign") {
      cells = [
        text(record.title),
        text(record.hashtag),
        mediaLabels[text(record.mediaType)] || text(record.mediaType),
        dateLabel
      ];
    } else if (kind === "integrate") {
      cells = [text(record.title), category, dateLabel];
    } else if (kind === "needHelp") {
      cells = [text(record.title), dateLabel];
    } else if (kind === "volunteer") {
      category = volunteerStates[text(record.state)] || text(record.state);
      cells = [
        text(record.title), text(record.activityDate), text(record.place),
        `${text(record.appliedCount)} / ${text(record.capacity)}`, category
      ];
    } else if (kind === "adoption") {
      category = adoptionStates[text(record.status)] || text(record.status);
      cells = [text(record.animalBreed), text(record.animalNoticeNo), text(record.applicantName), category, dateLabel];
    } else if (kind === "missing") {
      category = record.category === "FOUND" ? "목격" : "실종";
      cells = [text(record.title), category, record.status === "COMPLETED" ? "완료" : "진행 중", dateLabel];
    } else if (kind === "community") {
      category = communityCategories[text(record.category)] || text(record.category);
      cells = [text(record.title), category, dateLabel];
    } else {
      cells = [
        text(record.noticeNo),
        text(record.breed),
        text(record.rescueLocation),
        genderLabels[text(record.gender)] || text(record.gender),
        statusLabels[text(record.status)] || text(record.status),
        dateLabel
      ];
    };

    return {
      key: `${source}-${record.id}`,
      id: Number(record.id),
      source,
      record,
      cells,
      category,
      searchText: normalizeAdminSearch(cells.join(" ")),
      timestamp: rawDate
        ? Date.parse(
            /(?:Z|[+-]\d{2}:\d{2})$/.test(rawDate)
              ? rawDate
              : `${rawDate.length === 10 ? rawDate + "T00:00:00" : rawDate}+09:00`
          ) || 0
        : 0
    };
  });
};

export const filterRegistrationRows = (rows: AdminRegistrationRow[], query: string, category: string) => {
  const terms = normalizeAdminSearch(query).split(" ").filter(Boolean);
  return rows.filter(
    (row) => (!category || row.category === category) && terms.every((term) => row.searchText.includes(term))
  );
};
