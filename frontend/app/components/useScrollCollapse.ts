"use client";

import { useEffect, useRef, useState } from "react";

// 💡 아래로 스크롤하면 true(헤더 숨김·버튼 줄임), 위로 스크롤하거나 맨 위 근처면 false
//    조금씩 흔들리는 스크롤에는 반응하지 않게 MIN_DELTA 만큼 움직였을 때만 바꿈
const TOP_ZONE = 80;
const MIN_DELTA = 8;

export function useScrollCollapse() {
  const [collapsed, setCollapsed] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y < TOP_ZONE) {
        setCollapsed(false);
      } else if (Math.abs(delta) >= MIN_DELTA) {
        setCollapsed(delta > 0);
      } else {
        return;
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return collapsed;
};
