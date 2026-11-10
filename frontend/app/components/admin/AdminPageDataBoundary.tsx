"use client";

import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { loadAdminPageData } from "@/lib/adminPageLoading";
import AdminPageLoading from "./AdminPageLoading";
import * as S from "@/assets/css/Style.styles";

export default function AdminPageDataBoundary({pathname, children}: {pathname: string; children: ReactNode}) {
  const dispatch = useDispatch<AppDispatch>();
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;
    const load = loadAdminPageData(dispatch, pathname);
    void load.completed.then((isReady) => {
      if (isActive) setStatus(isReady ? "ready" : "failed");
    });
    return () => {
      isActive = false;
      load.cancel();
    };
  }, [attempt, dispatch, pathname]);

  if (status === "ready") return children;
  if (status === "loading") return <AdminPageLoading/>;
  return (
    <S.AdminPageLoadingPanel role="alert">
      <S.AdminPageLoadingText>관리자 로그인 정보를 확인하지 못했습니다. 연결 상태를 확인해 주세요.</S.AdminPageLoadingText>
      <S.AdminProfileRetry
      type="button"
      onClick={() => {
        setStatus("loading");
        setAttempt((previous) => previous + 1);
      }}>
        다시 시도
      </S.AdminProfileRetry>
    </S.AdminPageLoadingPanel>
  );
};
