import { dashboardSources, DashboardSource, getDashboardDate } from "@/lib/adminDashboard";

export type AdminRegistrationKind = "recommended" | "campaign" | "integrate" | "shelter";

export interface AdminRegistrationRow {
  key: string;
  id: number;
  source: DashboardSource;
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
    sources: DashboardSource[];
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
    title: "등록된 통합 게시물",
    columns: ["제목", "게시물 유형", "등록일"],
    placeholder: "제목·게시물 유형 검색",
    sources: ["youtubePosts", "fellowNews", "needHelps"]
  },
  shelter: {
    title: "등록된 보호 동물",
    columns: ["공고번호", "품종", "구조 위치", "성별", "상태", "등록일"],
    placeholder: "공고번호·품종·구조 위치 검색",
    sources: ["shelterAnimals"]
  }
};

export const normalizeAdminSearch = (text: string) =>
  text.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("ko-KR");

export const getRegistrationSources = (kind: AdminRegistrationKind) =>
  dashboardSources.filter(({key}) => registrationConfigs[kind].sources.includes(key));

const text = (value: unknown) => (typeof value === "string" || typeof value === "number" ? String(value) : "—");
const genderLabels: Record<string, string> = {M: "수컷", MALE: "수컷", F: "암컷", FEMALE: "암컷", UNKNOWN: "미상"};
const sourceLabels: Record<string, string> = {DIRECT: "직접 등록", FACEBOOK: "페이스북", INSTAGRAM: "인스타그램"};
const mediaLabels: Record<string, string> = {IMAGE: "이미지", YOUTUBE: "유튜브", DIRECT_VIDEO: "동영상"};
const statusLabels: Record<string, string> = {ACTIVE: "보호 중", COMPLETED: "입양 완료"};

export const createRegistrationRows = (
  kind: AdminRegistrationKind,
  source: DashboardSource,
  records: unknown
): AdminRegistrationRow[] => {
  if (!Array.isArray(records)) throw new Error("목록 응답이 올바르지 않습니다.");
  const category = dashboardSources.find(({key}) => key === source)?.label || "";

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
