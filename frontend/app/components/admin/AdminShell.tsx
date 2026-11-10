"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Layout } from "../layout/Layout";
import { getAdminRemainingSeconds, useAdminSession } from "@/lib/adminAuth";
import { isAdminSessionRenewing } from "@/lib/adminApi";

export default function AdminShell({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const {session, isHydrating} = useAdminSession();
  if (pathname === "/admin/login") return children;
  if (isHydrating || !session || (getAdminRemainingSeconds(session) === 0 && !isAdminSessionRenewing(session.token))) return null;
  return <Layout>{children}</Layout>;
};
