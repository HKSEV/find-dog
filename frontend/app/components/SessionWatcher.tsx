"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { AppDispatch } from "../store/store";
import { logoutUser } from "../redux/userSlice";
import { takeExpiredNotice } from "./authToken";
import { showToast } from "./Toast";

const EXPIRED_MESSAGE = "로그인이 끝났어요. 다시 로그인해 주세요";

// 💡 회원 로그인이 끝났으면 로그아웃 상태로 바꾸고 한 번 알려 줌 (화면은 그대로, 로그인이 필요한 곳에서 로그인 안내가 뜸)
//    1) 화면을 옮길 때마다 토큰 시간을 확인
//    2) 회원 토큰을 보냈는데 서버가 401을 주면 (시간 전이라도 서버에서 무효) 같은 처리
//    관리자 토큰(sessionStorage)과는 상관없음
export default function SessionWatcher() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!takeExpiredNotice()) return;
    dispatch(logoutUser());
    // 새로고침 직후에는 ToastHost(layout에서 이 컴포넌트보다 뒤)가 아직 듣기 전이라 한 박자 뒤에 띄움
    // (개발 모드에서 effect가 두 번 돌아도 알림이 사라지지 않게 타이머는 취소하지 않음)
    setTimeout(() => showToast(EXPIRED_MESSAGE), 0);
  }, [pathname, dispatch]);

  useEffect(() => {
    const id = axios.interceptors.response.use(undefined, (error) => {
      const token = localStorage.getItem("token");
      const sent = error?.config?.headers?.Authorization ?? error?.config?.headers?.authorization;
      if (error?.response?.status === 401 && token && sent === `Bearer ${token}`) {
        dispatch(logoutUser());
        showToast(EXPIRED_MESSAGE);
      };
      return Promise.reject(error);
    });
    return () => axios.interceptors.response.eject(id);
  }, [dispatch]);

  return null;
};
