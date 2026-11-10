"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Layout } from "../layout/Layout";

export default function AdminShell({children}: {children: ReactNode}) {
  const pathname = usePathname();
  return pathname === "/admin/login" ? children : <Layout>{children}</Layout>;
};
