"use client";

import DetailById from "@/app/components/DetailById";
import HelpDetail from "./HelpDetail";

// 💡 도움 요청 상세 (/shelter/help/?id=3): 함께해요 > 이야기 > 보호소 "도움이 필요해요", 홈 "함께 도와주세요"
export default function HelpDetailPage() {
  return <DetailById component={HelpDetail}/>;
};
