export const adminOperationPages = [
  {slug: "need-help", kind: "needHelp", area: "홈", title: "도움 요청", description: "홈과 함께해요 탭에 표시할 도움 요청을 등록하고 관리하세요."},
  {slug: "volunteers", kind: "volunteer", area: "입양·봉사", title: "봉사 모집", description: "봉사 일정을 등록하고 모집 상태와 신청자를 확인하세요."},
  {slug: "adoptions", kind: "adoption", area: "입양·봉사", title: "입양 신청", description: "회원의 신청서를 확인하고 보호소 전달과 입양 결과를 기록하세요."},
  {slug: "missing", kind: "missing", area: "실종·제보", title: "실종·제보 글", description: "회원이 등록한 실종 신고와 목격 제보를 확인하세요."},
  {slug: "community", kind: "community", area: "커뮤니티", title: "회원 게시물", description: "커뮤니티에 올라온 자유 글, 입양 후기, 구조 이야기와 질문을 확인하세요."}
] as const;

export type AdminOperation = (typeof adminOperationPages)[number];

export const adminOperationHref = (slug: AdminOperation["slug"]) => `/admin/manage/${slug}`;
