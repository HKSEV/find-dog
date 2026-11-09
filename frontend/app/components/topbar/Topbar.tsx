"use client";

//상태관리를 위해 useState와 useEffect를 추가로 불러옵니다
//상태관리를 위해 useState와 useEffect를 추가로 불러옵니다
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as S from "@/assets/css/Style.styles";

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
    <S.AdminTopbar>
      {/*Sidebar Toggle(Mobile) */}
      <S.MobileMenuButton>
        <S.Menu/>
      </S.MobileMenuButton>

      <S.TopbarSearch>
        <S.InputGroup>
          <S.SearchInput type="text" placeholder="검색어를 입력하세요..."/>
          <S.InputGroupAppend>
            <S.SearchButton type="button">
              <S.StyledSearch/>
              Search
            </S.SearchButton>
          </S.InputGroupAppend>
        </S.InputGroup>
      </S.TopbarSearch>

      {/*Topbar Navbar */}
      <S.StyledTopbarNavbar>
        {/*User Information */}
        <S.ProfileMenu>
          <S.ProfileTrigger
          href="#"
          id="userDropdown"
          onClick={(e) => {
            e.preventDefault();
            setIsDropdownOpen(!isDropdownOpen);
          }}>
            {" "}
            {/*a태그의 기본 클릭이벤트 (페이지 최상단으로 올라가는 현상을 )막기위해 */}
            <S.ProfileName>{userName}</S.ProfileName>
            <S.StyledTopbarProfile src="http://localhost:3000/img/profile.jpg" alt="프로필이미지"/>
          </S.ProfileTrigger>

          {isDropdownOpen && (
            <S.ProfileDropdown aria-labelledby="userDropdown">
              <S.ProfileMenuItem href="#" onClick={(e) => e.preventDefault()}>
                <S.ProfileIcon/>
              </S.ProfileMenuItem>

              <S.ProfileMenuDivider/>

              <S.ProfileMenuItem
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}>
                <S.LogoutIcon/>
                로그아웃
              </S.ProfileMenuItem>
            </S.ProfileDropdown>
          )}
        </S.ProfileMenu>
      </S.StyledTopbarNavbar>
    </S.AdminTopbar>
  );
};
