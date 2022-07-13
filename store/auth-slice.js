import { createSlice } from '@reduxjs/toolkit';
import Router from 'next/router';
import setExpiryDate from '/util/func/setExpiryDate';
import {deleteCookie, setCookie} from '/util/func/cookie';
import getAdminToken from "@src/pages/api/getAdminToken";

const initialAuthState = {
  token: null,
  isAuth: false,
  isAdmin: false,
  autoLogin: false,
};

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAuth = true;
      state.isAdmin = false;
      state.token = action.payload.token;
      if (state.isAdmin) {
        return alert('관리자는 중복 로그인할 수 없습니다.');
      }
      Router.push('/');
    },
    autoLogin(state, action) {
      state.isAuth = true;
      state.isAdmin = false;
      state.autoLogin = true;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify({ token: state.token }));
      if (state.isAdmin) return alert('관리자는 중복 로그인할 수 없습니다.');
      Router.push('/');
    },
    userRestoreAuthState(state) {
      const token = JSON.parse(localStorage.getItem('user'))?.token;
      // * 서버측 refresh token 없이 임시로 만듦
      console.log('User Restore Auth State');
      if (token) {
        state.isAdmin = false;
        state.isAuth = true;
        state.token = token;
        state.autoLogin = true;
      }
    },
    logout(state) {
      state.isAuth = false;
      state.token = null;
      localStorage.removeItem('user');
      alert('로그아웃');
      Router.push('/');
    },
    // --------------------------------------------- //
    // --------------------------------------------- //
    // --------------------------------------------- //
    adminLogin(state, action) {
      state.isAdmin = true;
      state.isAuth = true;
      state.token = action.payload.token;
      // setCookie('adminLoginCookie',  state.token,  'date', autoLoginExpiredDate , {path:'/bf-admin'}); // ! 필요할 경우 path설정
      setCookie('adminLoginCookie',  state.token,  'date', autoLoginExpiredDate , {path:'/'});
      // localStorage.setItem('admin', JSON.stringify({ token: state.token }));
    },
    adminAugoLogin(state, action) {
      state.isAdmin = true;
      state.isAuth = true;
      state.token = action.payload.token;
      state.autoLogin = true;
      const { email, password } = action.payload.account;
      const autoLoginExpiredDate = action.payload.expiredDate;
      // setCookie('adminLoginCookie',  state.token,  'date', autoLoginExpiredDate , {path:'/bf-admin'}); // ! 필요할 경우 path설정
      setCookie('adminLoginCookie',  state.token,  'date', autoLoginExpiredDate , {path:'/'});
      setCookie('adminAutoLogin', JSON.stringify({ email, password }),  'date', autoLoginExpiredDate ,{path:'/'});
      // localStorage.setItem(
      //   'admin',
      //   JSON.stringify({ token: state.token, account: { email, password }, expires: expiryDate }),
      // );
      // ! 추후에 Backend API > refresh토큰이 개발 후, refresh token으로 변경하기
    },
    adminLogout(state) {
      state.isAdmin = false;
      state.isAuth = false;
      state.token = null;
      // localStorage.removeItem('admin');
      setCookie('adminLoginCookie',  state.token,  'date', 0, {path:'/'} );
      // deleteCookie('adminAuth')
      alert('로그아웃 처리되었습니다.');
      Router.push('/bf-admin/login');
    },
    adminRestoreAuthState (state, action) {
      state.isAdmin = true;
      state.isAuth = true;
      state.autoLogin = true;
      state.token = action.payload.token;
    },
    adminResetPassword(state) {
      state.isAdmin = true;
    },
  },
});

export const authAction = authSlice.actions;
export default authSlice;
