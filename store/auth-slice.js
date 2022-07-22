import { createSlice } from '@reduxjs/toolkit';
import Router from 'next/router';
import {setCookie} from '/util/func/cookie';
import {cookieType} from "@store/TYPE/cookieType";

// - --------------------------------------------------------------------
// - cf. Cookie: expiredDate값이 null일 경우, application expired값이 session으로 설정
// const token = JSON.parse(localStorage.getItem('user'))?.token; // PAST VER.
// - --------------------------------------------------------------------
const autoLoginExpiredDate = 7;

const initialAuthState = {
  // refreshToken: null,
  isAuth: false,
  isAdmin: false,
  autoLogin: false,
};

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAdmin = false;
      state.isAuth = true;
      state.autoLogin = false;
      const accessToken = action.payload.token;
      setCookie(cookieType.LOGIN_COOKIE,  accessToken,  'hour', 24 , {path:'/'});
      // setCookie(cookieType.LOGIN_COOKIE, JSON.stringify({ autoLogin: false }), 'hour', 24 ,{path:'/'}); // SERVER에서 정한 만료시간기준
      Router.push('/');
    },
    autoLogin(state, action) {
      state.isAdmin = false;
      state.isAuth = true;
      state.autoLogin = true;
      const accessToken = action.payload.token;
      setCookie(cookieType.LOGIN_COOKIE, accessToken,  'date', cookieType.AUTO_LOGIN_PERIOD ,{path:'/'});
      setCookie(cookieType.AUTO_LOGIN_COOKIE, JSON.stringify({ autoLogin: true }), 'date', cookieType.AUTO_LOGIN_PERIOD ,{path:'/'}); // SERVER에서 정한 만료시간
      Router.push('/');
    },
    userRestoreAuthState(state) { // 쿠키가 존재할 경우 restoreAuthState
      console.log('User Restore Auth State');
      state.isAdmin = false;
      state.isAuth = true;
      state.autoLogin = true;
    },
    logout(state) {
      state.isAdmin = false;
      state.isAuth = false;
      state.autoLogin = false;
      alert('로그아웃');
      setCookie(cookieType.LOGIN_COOKIE,  null,  'date', 0, {path:'/'} );
      setCookie(cookieType.AUTO_LOGIN_COOKIE, null, 'date', 0)
      Router.push('/');
    },
    adminLogin(state, action) {
      state.isAdmin = true;
      state.isAuth = true;
      state.autoLogin = false;
      const accessToken = action.payload.token;
      setCookie(cookieType.LOGIN_COOKIE,  accessToken,  'hour', 24 , {path:'/'});
    },
    adminAutoLogin(state, action) {
      state.isAdmin = true;
      state.isAuth = true;
      state.autoLogin = true;
      const accessToken = action.payload.token;
      setCookie(cookieType.LOGIN_COOKIE, accessToken,  'date', cookieType.AUTO_LOGIN_PERIOD ,{path:'/'});
      setCookie(cookieType.AUTO_LOGIN_COOKIE, JSON.stringify({ autoLogin: true }), 'date', cookieType.AUTO_LOGIN_PERIOD ,{path:'/'});
    },
    adminRestoreAuthState (state, action) {
      console.log('admnin Restore Auth State');
      state.isAdmin = true;
      state.isAuth = true;
      state.autoLogin = true; // 유저의 autologin 상태를 FE에서 관라히기 위함.
    },
    adminUpdateAccessToken (state, action) {
      state.autoLogin = true;
      state.isAdmin = true;
      state.isAuth = true;
      const accessToken = action.payload.token;
      setCookie(cookieType.LOGIN_COOKIE,  accessToken,  'hour', 24, {path:'/'} );
      // REFRESH TOKEN : updateAccessToken시에, cookie에 저장하지 않는다. // autologin시점에만 업데이트한다.
    },
    adminResetPassword(state) {
      state.isAdmin = true;
    },
    adminLogout(state) {
      state.isAdmin = false;
      state.isAuth = false;
      state.autoLogin = null;
      setCookie(cookieType.LOGIN_COOKIE,  null,  'date', 0, {path:'/'} );
      setCookie(cookieType.AUTO_LOGIN_COOKIE, null, 'date', 0)
      alert('관리자 로그아웃 처리되었습니다.');
      Router.push('/bf-admin/login');
    },
  },
});

export const authAction = authSlice.actions;
export default authSlice;
