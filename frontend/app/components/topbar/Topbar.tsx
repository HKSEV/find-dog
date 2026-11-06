"use client";

//상태관리를 위해 useState와 useEffect를 추가로 불러옵니다
//상태관리를 위해 useState와 useEffect를 추가로 불러옵니다
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TopbarContainer,
  TopbarSearch,
  TopbarProfile,
  TopbarNavbar,
  InputGroup,
  SearchInput,
  InputGroupAppend,
  SearchButton
} from "../../../assets/css/admin/Topbar.styled";
import * as I from "@/assets/css/admin/AdminIcons.styles";
import styled from "styled-components";

const AdminTopbar = styled(TopbarContainer)`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  flex-flow: row nowrap;
  justify-content: flex-start;
`;

const MobileMenuButton = styled.button`
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 400;
  color: #007bff;
  text-decoration: none;
  &:hover {
    color: #0056b3;
    text-decoration: underline;
  }
  @media (min-width: 768px) {
    display: none !important;
  }
  border-radius: 50% !important;
  margin-right: 1rem !important;
`;

const StyledSearch = styled(I.Search)`
  font-size: 0.875em;
`;

const StyledTopbarNavbar = styled(TopbarNavbar)`
  margin-left: auto !important;
`;

const ProfileMenu = styled.li`
  position: relative;
`;

const ProfileTrigger = styled.a`
  display: block;
  padding: 0.5rem 1rem;
  white-space: nowrap;
  &::after {
    display: inline-block;
    margin-left: 0.255em;
    vertical-align: 0.255em;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }
`;

const ProfileName = styled.span`
  margin-right: 0.5rem !important;
  display: none !important;
  @media (min-width: 992px) {
    display: inline !important;
  }
  color: #4b5563;
  font-size: 80%;
  font-weight: 400;
`;

const StyledTopbarProfile = styled(TopbarProfile)`
  border-radius: 50% !important;
`;

const ProfileDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  right: 0;
  left: auto;
  display: block;
`;

const ProfileMenuItem = styled.a`
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  &:hover {
    color: #16181b;
    text-decoration: none;
    background-color: #f8f9fa;
  }
`;

const ProfileIcon = styled(I.User)`
  font-size: 0.875em;
  margin-right: 0.5rem !important;
  color: #9ca3af;
`;

const ProfileMenuDivider = styled.div`
  height: 0;
  margin: 0.5rem 0;
  overflow: hidden;
  border-top: 1px solid #e9ecef;
`;

const LogoutIcon = styled(I.SignOut)`
  font-size: 0.875em;
  margin-right: 0.5rem !important;
  color: #9ca3af;
`;

export const Topbar: React.FC = () => {
  //페이지 이동 함수를 navigate라는 이름으로 사용할수있게 준비 ..
  //const navigate = useNavigate();
  const router = useRouter();

  //1.화면에 보여줄 사용자 이름 상태를 만듭니다.(기본값: Guest)
  const [userName, setUserName] = useState("Guest");

  //add
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //2.화면이 처름 켜질때 딱 한번만 실행
  useEffect(() => {
    //로그인 할때 저장해둔 'userName'을 브라우저 저장소에서 꺼내옵니다
    const storedName = localStorage.getItem("userName");

    //만약 저장된 이름이 있다면, 상태를 그이름으로 업데이트 합니다
    if (storedName) {
      //💡 setTimeout으로 감싸서
      // 리액트의 동기적 렌더링 감시망을 피해갑니다!
      setTimeout(() => {
        setUserName(storedName);
      }, 0);
    };
  }, []);

  //로그아웃 버튼을 눌렀을때 실행되는 함수를 만듭니다
  const handleLogout = () => {
    //1.브라우저 금고(localStorage)에서 'userName'데이터를 완전히 지웁니다
    localStorage.removeItem("userName");
    //2.로그인 페이지('/login)로 사용자를 이동시킵니다
    //navigate('/login');
    router.push("/login");
  };

  return (
    <AdminTopbar>
      {/*Sidebar Toggle(Mobile) */}
      <MobileMenuButton>
        <I.Menu/>
      </MobileMenuButton>

      <TopbarSearch>
        <InputGroup>
          <SearchInput type="text" placeholder="검색어를 입력하세요..."/>
          <InputGroupAppend>
            <SearchButton type="button">
              <StyledSearch/>
              Search
            </SearchButton>
          </InputGroupAppend>
        </InputGroup>
      </TopbarSearch>

      {/*Topbar Navbar */}
      <StyledTopbarNavbar>
        {/*User Information */}
        <ProfileMenu>
          <ProfileTrigger
          href="#"
          id="userDropdown"
          onClick={(e) => {
            e.preventDefault();
            setIsDropdownOpen(!isDropdownOpen);
          }}>
            {" "}
            {/*a태그의 기본 클릭이벤트 (페이지 최상단으로 올라가는 현상을 )막기위해 */}
            <ProfileName>{userName}</ProfileName>
            <StyledTopbarProfile src="http://localhost:3000/img/profile.jpg" alt="프로필이미지"/>
          </ProfileTrigger>

          {isDropdownOpen && (
            <ProfileDropdown aria-labelledby="userDropdown">
              <ProfileMenuItem href="#" onClick={(e) => e.preventDefault()}>
                <ProfileIcon/>
              </ProfileMenuItem>

              <ProfileMenuDivider/>

              <ProfileMenuItem
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}>
                <LogoutIcon/>
                로그아웃
              </ProfileMenuItem>
            </ProfileDropdown>
          )}
        </ProfileMenu>
      </StyledTopbarNavbar>
    </AdminTopbar>
  );
};
