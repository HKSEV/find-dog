"use client";

//상태관리를 위해 useState와 useEffect를 추가로 불러옵니다
//상태관리를 위해 useState와 useEffect를 추가로 불러옵니다
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TopbarSearch,
  InputGroup,
  SearchInput,
  InputGroupAppend,
  SearchButton
} from "../../../assets/css/admin/Topbar.styled";
import * as I from "@/assets/css/admin/AdminIcons.styles";
import {
  AdminTopbar,
  MobileMenuButton,
  StyledSearch,
  StyledTopbarNavbar,
  ProfileMenu,
  ProfileTrigger,
  ProfileName,
  StyledTopbarProfile,
  ProfileDropdown,
  ProfileMenuItem,
  ProfileIcon,
  ProfileMenuDivider,
  LogoutIcon
} from "@/assets/css/admin/TopbarContent.styles";

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
