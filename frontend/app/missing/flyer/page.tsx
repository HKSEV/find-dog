"use client";

import DetailById from "@/app/components/DetailById";
import MissingFlyer from "./MissingFlyer";

// 💡 실종·목격 전단지 (/missing/flyer/?id=3)
export default function MissingFlyerPage() {
  return <DetailById component={MissingFlyer}/>;
};
