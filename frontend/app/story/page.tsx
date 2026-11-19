"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { setActiveTab } from "../redux/shelterSlice";

// 💡 예전 커뮤니티 주소(/story): 커뮤니티는 함께해요 탭의 "이야기"로 옮겨서 그쪽으로 보냄
//    (글 상세·글쓰기에서 돌아올 때 쓰는 /story 링크가 그대로 동작하게 남겨 둠)
export default function StoryRedirectPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(setActiveTab("이야기"));
    router.replace("/shelter");
  }, [dispatch, router]);

  return null;
};
