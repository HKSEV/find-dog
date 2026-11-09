"use client";

import { useState } from "react";
import { AdminProfile, getAdminProfileImage } from "@/lib/adminProfile";
import * as S from "@/assets/css/Style.styles";

export default function AdminProfileAvatar({profile, large = false}: {profile: AdminProfile | null; large?: boolean}) {
  const [failedImage, setFailedImage] = useState("");
  const image = getAdminProfileImage(profile?.profileImageUrl);
  const name = profile?.name || "관리자";

  return image && image !== failedImage ? (
    <S.AdminAvatarImage src={image} alt={`${name}님의 프로필`} $large={large} onError={() => setFailedImage(image)}/>
  ) : (
    <S.AdminAvatarFallback $large={large} role="img" aria-label={`${name} 프로필 이미지 없음`}>
      {name.slice(0, 1)}
    </S.AdminAvatarFallback>
  );
};
