"use client";

import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { loadAdminPageData } from "@/lib/adminPageLoading";
import AdminPageLoading from "./AdminPageLoading";

export default function AdminPageDataBoundary({pathname, children}: {pathname: string; children: ReactNode}) {
  const dispatch = useDispatch<AppDispatch>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isActive = true;
    const load = loadAdminPageData(dispatch, pathname);
    void load.completed.then(() => {
      if (isActive) setIsReady(true);
    });
    return () => {
      isActive = false;
      load.cancel();
    };
  }, [dispatch, pathname]);

  return isReady ? children : <AdminPageLoading/>;
};
