// src/redux/userSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { clearIfExpired } from "../components/authToken";

interface UserState {
  isLoggedIn: boolean;
  nickname: string;
  email: string;
}

const initialState: UserState = {
  isLoggedIn: false,
  nickname: "회원",
  email: ""
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 로컬스토리지에서 유저 정보를 읽어와 상태를 세팅하는 액션
    loadUserFromStorage: (state) => {
      clearIfExpired(); // 시간이 지난 토큰은 지우고 로그아웃 상태로
      const token = localStorage.getItem("token");
      const storedNickname = localStorage.getItem("nickname");
      const storedEmail = localStorage.getItem("email");

      state.isLoggedIn = Boolean(token); // 토큰이 끝나서 지워졌으면 로그아웃 상태로 돌려놓음
      state.nickname = token && storedNickname ? storedNickname : "회원";
      state.email = token && storedEmail ? storedEmail : "";
    },
    // 로그아웃 시 상태 초기화 액션
    logoutUser: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("nickname");
      localStorage.removeItem("email");
      state.isLoggedIn = false;
      state.nickname = "회원";
      state.email = "";
    }
  }
});

export const {loadUserFromStorage, logoutUser} = userSlice.actions;
export default userSlice.reducer;
