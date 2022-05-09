import { createSlice } from '@reduxjs/toolkit';
import Router from "next/router";

const initialAuthState = {
  token: null,
  isAuth: false,
  isAdmin: false,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuth = true;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify({ token: state.token }));
      alert("로그인 성공");
      if (state.isAdmin) {
        return alert("관리자는 중복 로그인할 수 없습니다.");
      }
      Router.push("/");
    },
    logout(state) {
      state.isAuth = false;
      state.token = null;
      localStorage.removeItem("user");
      alert("로그아웃 처리되었습니다.");
      Router.push("/");
    },
    adminLogin(state, action) {
      state.isAdmin = true;
      state.isAuth = true;
      state.token = action.payload.token;
      localStorage.setItem("admin", JSON.stringify({ token: state.token }));
      alert("관리자 로그인에 성공하였습니다.");
      Router.push("/bf-admin/dashboard");
    },
    adminLogout(state) {
      state.isAdmin = false;
      state.isAuth = false;
      state.token = null;
      localStorage.removeItem("admin");
      alert("로그아웃 처리되었습니다.");
      Router.push("/bf-admin/login");
    },
    adminRestoreAuthState(state) {
      const token = JSON.parse(localStorage.getItem("admin"))?.token;
      // * 서버측 refresh token 없이 임시로 만듦
      if (token) {
         state.isAdmin = true;
         state.isAuth = true;
         state.token = token;
      }
      // * 토큰이 만료됐다는 response가 돌아온경우
      // * ( refresh Token이 있다면, Refresh토큰을이용한다)
      // if (state.isAuth) {
      // 토큰추카
      // } else {
      //   alert("권한이 없습니다. 로그인 후 다시 시도해주세요.");
      // }
    },
  },
});

export const authAction = authSlice.actions;
export default authSlice;