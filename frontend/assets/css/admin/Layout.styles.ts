"use client";

import styled from "styled-components";
import { coolGray, adminCard, adminColors } from "@/assets/css/admin/AdminBase.styles";
// 만들어둔 쿨그레이 믹스인 임포트

// ==========================================
// 💡 1. 사용자 작성 기존 뼈대 코드 (일부 컬러 믹스인 적용)
// ==========================================
export const AdminShellWrapper = styled.div`
  color: ${coolGray[700]};
  display: flex;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: clip;
`;

export const AdminShellContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 0;
  min-width: 0;
  /* 밝은 블루그레이 배경 */
  background-color: ${coolGray[50]};
`;

export const AdminShellMainContent = styled.div`
  flex: 1;
  width: 100%;
  min-width: 0;
`;

export const AdminShellContainerFluid = styled.div`
  width: 100%;
  padding-right: 1.5rem;
  padding-left: 1.5rem;
  margin-right: auto;
  margin-left: auto;

  @media (max-width: 767px) {
    padding-right: 16px;
    padding-left: 16px;
  }
`;

// ==========================================
// 💡 2. 덧붙여서 추가하는 어드민 레이아웃 요소들
// ==========================================

// 좌측 사이드바 (.sidebar 대체)
export const AdminShellSidebar = styled.ul`
  width: 224px;
  background-color: ${adminColors.sidebar}; /* 차분한 블루 */
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  height: 100%;
  overflow-y: auto; /* 메뉴가 길어지면 스크롤 생성 */
`;

export const AdminShellSidebarBrand = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: 0.05rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
`;

export const AdminShellNavItem = styled.li<{$active?: boolean}>`
  padding: 0 16px;
  margin-top: 8px;

  a {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: ${(props) => (props.$active ? "#FFFFFF" : adminColors.sidebarText)};
    font-weight: ${(props) => (props.$active ? "700" : "600")};
    font-size: 0.85rem;
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.2s;
    background-color: ${(props) => (props.$active ? adminColors.sidebarActive : "transparent")};

    &:hover {
      color: #FFFFFF;
      background-color: ${adminColors.sidebarActive}; /* 호버 시 강조된 블루 */
    }

    svg {
      margin-right: 12px;
      font-size: 1.1rem;
    }
  }
`;

// 상단 네비게이션 바 (.topbar 대체)
export const AdminShellTopbar = styled.nav`
  height: 70px;
  background-color: ${adminColors.header};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem; /* ContainerFluid 패딩과 통일 */
  box-shadow: 0 2px 4px rgba(39, 81, 133, 0.06);
  z-index: 10;
  margin-bottom: 1.5rem; /* 아래 콘텐츠와의 간격 확보 */
`;

// 페이지 제목 (.h3.mb-4 대체)
export const AdminShellPageHeading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${coolGray[800]};
  margin-bottom: 1.5rem;
`;

// 데이터 카드 (.card.shadow 대체)
export const AdminShellDataCard = styled.div`
  ${adminCard} /* 앞서 정의한 쿨그레이 그림자+테두리 믹스인 적용 */
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;

  .card-header {
    padding: 1rem 1.25rem;
    background-color: ${coolGray[50]}; /* 연한 쿨그레이 바탕 */
    border-bottom: 1px solid ${coolGray[200]};
    border-radius: 8px 8px 0 0;
    font-weight: 700;
    color: ${coolGray[700]};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-body {
    padding: 1.25rem;
  }
`;
