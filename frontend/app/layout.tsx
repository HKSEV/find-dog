import type { Metadata } from "next";
import Script from "next/script";

import StyledComponentsRegistry from "@/lib/registry";

import { Providers } from "./store/Providers";
import * as S from "@/assets/css/Style.styles";

export const metadata: Metadata = {
  title: "어서찾아주개",
  description: "유기동물 입양 및 정보 제공 플랫폼"
};

const adminEntryGuard = String.raw`
  (function () {
    const loginPath = "/admin/login";
    const pathname = window.location.pathname.replace(/\/+$/, "");
    const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
    if (!isAdminPath || pathname === loginPath) return;

    let hasSession = false;

    try {
      const stored = window.sessionStorage.getItem("find-dog-admin-session");
      const session = stored ? JSON.parse(stored) : null;

      hasSession = Boolean(
        session &&
        typeof session.token === "string" &&
        session.token.trim() &&
        Number.isFinite(session.expiresAt) &&
        Number.isFinite(session.clockOffset) &&
        session.expiresAt > Date.now() + session.clockOffset
      );
    } catch {
      hasSession = false;
    }

    if (!hasSession) window.location.replace(loginPath);
  })();
`;

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body id="page-top">
        <Script id="admin-entry-guard" strategy="beforeInteractive">
          {adminEntryGuard}
        </Script>
        <StyledComponentsRegistry>
          <S.GlobalStyle/>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};
