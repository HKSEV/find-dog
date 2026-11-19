"use client";

import { useState } from "react";
import { toImageUrl } from "../shelter/animalFormat";
import * as S from "@/assets/css/Style.styles";

// 💡 채팅 상대 프로필 사진 (사진이 없거나 못 불러오면 사람 아이콘)
export default function ChatAvatar({image, size}: {image: string | null | undefined; size: number}) {
  const url = toImageUrl(image ?? undefined);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  return (
    <S.ChatAvatar $size={size} aria-hidden="true">
      {url && failedUrl !== url ? (
        // eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 쓰지 않음
        <img src={url} alt="" onError={() => setFailedUrl(url)}/>
      ) : <S.ChatAvatarIcon/>}
    </S.ChatAvatar>
  );
};
