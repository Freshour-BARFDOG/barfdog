import { createSlice } from '@reduxjs/toolkit';
import Router from 'next/router';
import {setCookie} from '/util/func/cookie';

// - --------------------------------------------------------------------
// - cf. Cookie: expiredDate값이 null일 경우, application expired값이 session으로 설정
// const token = JSON.parse(localStorage.getItem('user'))?.token; // PAST VER.
// - --------------------------------------------------------------------
const autoLoginExpiredDate = 7;

const initialAuthState = {
  refreshToken: null,
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
      setCookie('userLoginCookie',  accessToken,  'date', 1 , {path:'/'});
      setCookie('userRefreshToken', JSON.stringify({refreshToken:null,  autoLogin: false }),  'date', 1 ,{path:'/'});
      Router.push('/');
    },
    autoLogin(state, action) {
      state.isAdmin = false;
      state.isAuth = true;
      state.autoLogin = true;
      const accessToken = action.payload.token;
      setCookie('userLoginCookie',  accessToken,  'date', autoLoginExpiredDate , {path:'/'});
      setCookie('userRefreshToken', JSON.stringify({refreshToken: 'make_your_refreshToken', autoLogin:true}),  'date', autoLoginExpiredDate ,{path:'/'});
      Router.push('/');
    },
    userRestoreAuthState(state) {
      console.log('User Restore Auth State');
      state.isAdmin = false;
      state.isAuth = true;
      state.autoLogin = true;
    },
    userSaveNewAccessToken (state, action) {
      state.isAdmin = false;
      state.isAuth = true;
      state.autoLogin = true;
      state.refreshToken = action.payload.token; // ! 유저 리프레쉬 토큰 기능없음. 만료될 경우, 다시 로그인해야함.
      setCookie('userRefreshToken',  state.token,  'date', 7, {path:'/'} );
    },
    logout(state) {
      state.isAdmin = false;
      state.isAuth = false;
      state.refreshToken = null;
      alert('로그아웃');
      Router.push('/');
      // localStorage.removeItem('user');
    },
    // ------------------------------------------------------------------------------------ //
    // ------------------------------------------------------------------------------------ //
    adminLogin(state, action) {
      state.isAdmin = true;
      state.isAuth = true;
      state.autoLogin = false;
      const accessToken = action.payload.token;
      setCookie('adminLoginCookie',  accessToken,  'date', 1 , {path:'/'});
      setCookie('adminRefreshToken', JSON.stringify({refreshToken:null,  autoLogin: false }),  'date', 1, {path:'/'})
    },
    adminAutoLogin(state, action) {
      state.isAdmin = true;
      state.isAuth = true;
      state.autoLogin = true;
      const accessToken = action.payload.token;
      setCookie('adminLoginCookie',  accessToken,  'date', 1 , {path:'/'});
      const refreshToken = action.payload.refreshToken;
      // ! 추후 Backend API  refresh토큰 개발될 경우, 변경
      setCookie('adminRefreshToken',  JSON.stringify({ refreshToken: refreshToken, autoLogin: true }),  'date', autoLoginExpiredDate ,{path:'/'});
    },
    adminRestoreAuthState (state, action) {
      console.log('admnin Restore Auth State');
      // console.log('autoLogin : ',state.payload.autoLogin)
      state.isAdmin = true;
      state.isAuth = true;
      state.autoLogin = action.payload.autoLogin; // 유저의 autologin 상태를 FE에서 관라히기 위함.
    },
    adminUpdateAccessToken (state, action) {
      state.autoLogin = true;
      state.isAdmin = true;
      state.isAuth = true;
      const accessToken = action.payload.token;
      const refreshToken = action.payload.refreshToken; // REDUX에만 표기한다.
      state.refreshToken = refreshToken
      setCookie('adminLoginCookie',  accessToken,  'date', 1, {path:'/'} );
      // REFRESH TOKEN : updateAccessToken시에, cookie에 저장하지 않는다. // autologin시점에만 업데이트한다.
    },
    adminResetPassword(state) {
      state.isAdmin = true;
    },
    adminLogout(state) {
      state.isAdmin = false;
      state.isAuth = false;
      state.refreshToken = null;
      setCookie('adminLoginCookie',  null,  'date', 0, {path:'/'} );
      setCookie('adminRefreshToken',  null,  'date', 0, {path:'/'} );
      alert('관리자 계정 로그아웃 처리되었습니다.');
      Router.push('/bf-admin/login');
    },
  },
});

export const authAction = authSlice.actions;
export default authSlice;
