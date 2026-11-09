export const dashboardSources = [
  {key: "animals", label: "추천 동물", endpoint: "/api/animals/recommended"},
  {key: "campaigns", label: "캠페인", endpoint: "/api/campaigns"},
  {key: "youtubePosts", label: "유튜브", endpoint: "/api/youtube"},
  {key: "fellowNews", label: "펠로우 소식", endpoint: "/api/fellow-news"},
  {key: "needHelps", label: "도움 요청", endpoint: "/api/need-help"},
  {key: "shelterAnimals", label: "보호 동물", endpoint: "/api/shelter-animals"}
] as const;

export type DashboardSource = (typeof dashboardSources)[number]["key"];
export type DashboardPeriod = 7 | 30 | "all";

export interface DashboardRecord {
  id: number;
  title?: string;
  insertDt?: string | null;
  createdAt?: string | null;
}

export type DashboardData = Record<DashboardSource, DashboardRecord[]>;

export const dashboardPostSources: DashboardSource[] = ["youtubePosts", "fellowNews", "needHelps"];

export const createDashboardData = (): DashboardData => ({
  animals: [],
  campaigns: [],
  youtubePosts: [],
  fellowNews: [],
  needHelps: [],
  shelterAnimals: []
});

export const getDashboardDate = (value?: string | null) => {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}(?:T[\d:.]+)?$/.test(value)) {
    const key = value.slice(0, 10);
    const date = new Date(`${key}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(key) ? key : "";
  };

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
};

export const getDashboardMetrics = (data: DashboardData, failedSources: DashboardSource[]) => {
  const count = (sources: DashboardSource[]) =>
    sources.some((source) => failedSources.includes(source))
      ? null
      : sources.reduce((total, source) => total + data[source].length, 0);

  return [
    {label: "추천 동물", value: count(["animals"]), unit: "마리", description: "홈에 노출되는 추천 동물 수입니다."},
    {label: "등록 캠페인", value: count(["campaigns"]), unit: "건", description: "전체 등록된 캠페인 수입니다."},
    {
      label: "등록 게시물",
      value: count(dashboardPostSources),
      unit: "건",
      description: "유튜브·펠로우 소식·도움 요청 합계입니다."
    },
    {label: "보호 동물", value: count(["shelterAnimals"]), unit: "마리", description: "보호소에 등록된 동물 수입니다."}
  ];
};

export const getDashboardPosts = (data: DashboardData) =>
  dashboardSources
    .filter(({key}) => key === "campaigns" || dashboardPostSources.includes(key))
    .flatMap(({key, label}) =>
      data[key].map((record) => ({
        ...record,
        key: `${key}-${record.id}`,
        category: label,
        date: getDashboardDate(record.insertDt),
        timestamp:
          record.insertDt && getDashboardDate(record.insertDt)
            ? new Date(
                /(?:Z|[+-]\d{2}:\d{2})$/.test(record.insertDt)
                  ? record.insertDt
                  : `${record.insertDt.length === 10 ? record.insertDt + "T00:00:00" : record.insertDt}+09:00`
              ).getTime() || 0
            : 0
      }))
    )
    .sort((a, b) => b.timestamp - a.timestamp || b.id - a.id);

export const getDashboardTrend = (data: DashboardData, period: DashboardPeriod, referenceDate: string) => {
  const end = getDashboardDate(referenceDate);
  if (!end) return [];

  const records = [
    ...dashboardPostSources.flatMap((source) =>
      data[source].map((record) => ({date: getDashboardDate(record.insertDt), series: "posts" as const}))
    ),
    ...data.shelterAnimals.map((record) => ({date: getDashboardDate(record.createdAt), series: "animals" as const}))
  ].filter(({date}) => date && date <= end);
  const points: {date: string; posts: number; animals: number}[] = [];

  if (period === "all") {
    if (!records.length) return [];
    const first = records.reduce((earliest, {date}) => (date < earliest ? date : earliest), end);
    const [firstYear, firstMonth] = first.split("-").map(Number);
    const [lastYear, lastMonth] = end.split("-").map(Number);
    const start = firstYear * 12 + firstMonth - 1;
    const finish = lastYear * 12 + lastMonth - 1;

    for (let month = start; month <= finish; month++) {
      const year = String(Math.floor(month / 12)).padStart(4, "0");
      const label = String((month % 12) + 1).padStart(2, "0");
      points.push({date: `${year}-${label}`, posts: 0, animals: 0});
    }
  } else {
    const endTime = new Date(`${end}T00:00:00Z`).getTime();
    for (let index = 0; index < period; index++) {
      points.push({
        date: new Date(endTime - (period - index - 1) * 86400000).toISOString().slice(0, 10),
        posts: 0,
        animals: 0
      });
    }
  };

  const byDate = new Map(points.map((point) => [point.date, point]));
  for (const {date, series} of records) {
    const point = byDate.get(period === "all" ? date.slice(0, 7) : date);
    if (point) point[series]++;
  }

  return points;
};

export const createDashboardReport = (
  data: DashboardData,
  failedSources: DashboardSource[],
  referenceDate: string,
  period: DashboardPeriod
) => {
  const rows: (string | number)[][] = [
    ["어서찾아주개 관리자 운영 현황"],
    ["조회일", getDashboardDate(referenceDate)],
    [],
    ["항목", "등록 수", "단위"],
    ...getDashboardMetrics(data, failedSources).map(({label, value, unit}) => [label, value ?? "조회 실패", unit]),
    [],
    ["최근 등록 게시물"],
    ["제목", "구분", "등록일"],
    ...getDashboardPosts(data).map(({title, category, date}) => [title || "제목 없음", category, date || "날짜 없음"])
  ];

  if (![...dashboardPostSources, "shelterAnimals" as const].some((source) => failedSources.includes(source))) {
    rows.push(
      [],
      [period === "all" ? "전체 기간 등록 현황 (월별)" : `최근 ${period}일 등록 현황`],
      ["집계 기준", "등록일이 확인된 항목"],
      [period === "all" ? "월" : "날짜", "게시물", "보호 동물"],
      ...getDashboardTrend(data, period, referenceDate).map(({date, posts, animals}) => [date, posts, animals])
    );
  };

  if (failedSources.length) {
    rows.push(
      [],
      [
        "조회하지 못한 항목",
        dashboardSources
          .filter(({key}) => failedSources.includes(key))
          .map(({label}) => label)
          .join(", ")
      ]
    );
  };

  return (
    "\uFEFF" +
    rows
      .map((row) =>
        row
          .map((value) => {
            let text = String(value);
            if (/^[\s]*[=+\-@]/.test(text)) text = "'" + text;
            return `"${text.replaceAll('"', '""')}"`;
          })
          .join(",")
      )
      .join("\r\n")
  );
};
