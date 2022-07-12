import { createSlice } from '@reduxjs/toolkit';
import Router from "next/router";
import setExpiryDate from "@util/func/setExpiryDate";
import transformDate from "@util/func/transformDate";
import {setCookie} from "@util/func/cookie";



const initialAuthState = {
  token: null,
  isAuth: false,
  isAdmin: false,
  autoLogin: false,
};

const authSlice = createSlice({
  name: "authentication",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuth = true;
      state.isAdmin = false;
      state.token = action.payload.token;
      if (state.isAdmin) {
        return alert("관리자는 중복 로그인할 수 없습니다.");
      }
      Router.push("/");
    },
    autoLogin(state, action) {
      state.isAuth = true;
      state.isAdmin = false;
      state.autoLogin = true;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify({ token: state.token}));
      if (state.isAdmin)  return alert("관리자는 중복 로그인할 수 없습니다.");
      Router.push("/");
    },
    userRestoreAuthState(state) {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      // * 서버측 refresh token 없이 임시로 만듦
      console.log('User Restore Auth State');
      if (token) {
        state.isAdmin = false;
        state.isAuth = true;
        state.token = token;
      }
    },
    logout(state) {
      state.isAuth = false;
      state.token = null;
      localStorage.removeItem("user");
      alert("로그아웃");
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
    adminAugoLogin(state, action) {
      state.isAdmin = true;
      state.isAuth = true;
      state.token = action.payload.token;
      state.autoLogin = true;
      const {email, password} = action.payload.account;
      // ! 개발단계에서 임시로 사용하는 방법
      const expiryDate = setExpiryDate(7);
      // setCookie('authorization',  state.token,  'date', 7 );
      
      // !  CF.) COOKIE를 사용할 경우 getInitialProps에서 Cookie정보속에서 token을 사용할 수 있다.
      localStorage.setItem("admin", JSON.stringify({ token: state.token, account: {email, password}, expires: expiryDate }));
      // ! 추후에 Backend API > refresh토큰이 개발 후, refresh token으로 변경하기
      // - 자동로그인 on일 경우, 로컬에 저장된 정보를 통해서 getToken함수를 실행하도록한다.
      alert(`관리자 로그인에 성공하였습니다.\n자동로그인: On\n반드시 본인 기기에서만 사용하시기 바랍니다.`);
      
      
      Router.push("/bf-admin/dashboard");
    },
    adminLogout(state) {
      state.isAdmin = false;
      state.isAuth = false;
      state.token = null;
      localStorage.removeItem("admin");
      alert("로그아웃 처리되었습니다.");
      Router.push("/bf-admin");
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
    adminResetPassword (state) {
      state.isAdmin = true;
    }
  },
});

export const authAction = authSlice.actions;
export default authSlice;