import type { Metadata } from "next";

import StyledComponentsRegistry from "@/lib/registry";

import { Providers } from "./store/Providers";
import * as S from "@/assets/css/Style.styles";

export const metadata: Metadata = {
  title: "어서찾아주개",
  description: "유기동물 입양 및 정보 제공 플랫폼"
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body id="page-top">
        <StyledComponentsRegistry>
          <S.GlobalStyle/>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
};
