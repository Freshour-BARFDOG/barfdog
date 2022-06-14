import { createSlice } from '@reduxjs/toolkit';
import Router from "next/router";




// ! API SERVER > 에러처리 기능 추가예정 (0513금 )

/* 
*  (async () => {
*  const token = axiosConfig();
*  // console.log(token.headers.authorization);
*  const response = await axios
*    .get(
*      REQUEST_URL,
*      {
*        headers: {
*          authorization:
*            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLthqDtgbAg7J2066aEIiwiaWQiOjUsImV4cCI6MTY1MTg5MjU3NiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20ifQ.Wycm9ZmiiK-GwtsUkvMCHHeExDBtkveDbhKRealjmd8C4OZMp3SFqGFcFWudXMiL5Mxdj6FcTAV9OVsOYsn_Mw",  
// 만료된 쿠폰을 넣은 경우
*          "Content-Type": "application/json",
*        },
*      },
*      axiosConfig()
*    )
*    .then((res) => {
*      console.log(res.data);
*      return res.data;
*    })
*    .catch((err) => {
*      console.error(err.request.response); //////*******중요
*      const errorObj = JSON.parse(err.request?.response);
*      const status = errorObj.status;
*      console.log(status);
*      if(status === 401){
*        const EXPIRED_TOKEN = errorObj.reason === "EXPIRED_TOKEN";
*        const UNAUTHORIZED = errorObj.reason === "UNAUTHORIZED";
*        console.error("errorType > EXPIRED_TOKEN : ", EXPIRED_TOKEN);
*        console.error("errorType > UNAUTHORIZED : ", UNAUTHORIZED);
*        
*      }else if (status === 403) {
*        const FORBIDDEN = errorObj.reason === "FORBIDDEN";
*        console.error("errorType > FORBIDDEN : ", FORBIDDEN);
*      }
*      
*      
*    });
*/

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
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify({ token: state.token }));
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
      Router.push("/bf-admin/index");
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