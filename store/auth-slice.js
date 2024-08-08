import { createSlice } from '@reduxjs/toolkit';
import Router from 'next/router';
import { setCookie } from '/util/func/cookie';
import { cookieType } from '@store/TYPE/cookieType';
import { userType } from '@store/TYPE/userAuthType';
import { postObjData } from '@src/pages/api/reqData';

// - --------------------------------------------------------------------
// - CF. Cookie: expiredDate값이 null일 경우, application expired값이 session으로 설정
// const token = JSON.parse(localStorage.getItem('user'))?.token; // PAST VER.
// - CF. TOKEN > 개발자모드 > application > Storage > Cookies > Expires / Max-Age (실제 시간과 다름)
//   - EX. Expires / Max-Age: 2022-07-28T08:33:28.000Z
//   - EX. 실제 시간: 2022-07-28 오후 5시 33분 28초
//       const d = new Date();
//       d.setTime(d.getTime() + 10*1000); // in milliseconds
//       document.cookie = 'TEST____foo=bar;path=/;expires='+d.toUTCString()+';';
// - --------------------------------------------------------------------
/*
  ! Login SSR Condition : use window.location or native A Tag
  ! using Router or Link (X) : only works Client-Side
* */

const initialAuthState = {
  isAuth: false,
  isAdmin: false,
  userType: null,
  userInfo: null,
};

// 설문조사 Id 가져온 후, 설문조사 결과 페이지로 이동
const onSubmitSurvey = async (formValues) => {
  try {
    const postData = { dogSaveRequestDtos: formValues };
    const postFormValuesApiUrl = '/api/dogs';
    const res = await postObjData(postFormValuesApiUrl, postData);
    // console.log(res);
    if (res.isDone) {
      //! [수정] 다견 설문조사 id 추출
      const surveyReportsIds =
        res.data.data._embedded.createDogsResponseDtoList.map((dogResponse) => {
          const slicedReportApiLink =
            dogResponse._links.query_surveyReport.href.split('/');
          const surveyReportsId =
            slicedReportApiLink[slicedReportApiLink.length - 1];
          return surveyReportsId;
        });
      const idsString = surveyReportsIds.join(',');

      window.location.href = `/survey/statistics?id=${idsString}`;
    }
  } catch (err) {
    console.log(err);
    alert('API 통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
  }
};

const authSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.isAdmin = false;
      state.isAuth = true;
      state.userType = userType.MEMBER;
      const accessToken = action.payload.token || '';
      const expiredDate =
        action.payload.expiredDate && cookieType.LOGIN_EXPIRED_PERIOD.VALUE; // 서버 token지속 기본값: 2시간
      const temporaryPassword = action.payload.data?.temporaryPassword || null;
      setCookie(
        cookieType.LOGIN_COOKIE,
        accessToken,
        cookieType.LOGIN_EXPIRED_PERIOD.UNIT,
        expiredDate,
        { path: '/' },
      );
      // if (action.payload.previousPath !== '/') {
      //   window.location.href = action.payload.previousPath;
      // }

      if (action.payload.surveyData) {
        onSubmitSurvey(action.payload.surveyData); // 설문조사 Id 가져온 후, 설문조사 결과 페이지로 이동
      } else {
        const query = temporaryPassword
          ? '?tempPw=true'
          : action.payload.previousPath.slice(1); //! [수정] 로그인하기 이전 페이지로 돌아가기
        window.location.href = '/' + query;
      }
    },
    autoLogin(state, action) {
      state.isAdmin = false;
      state.isAuth = true;
      const accessToken = action.payload.token || '';
      const expiredDate =
        action.payload.expiredDate &&
        cookieType.AUTO_LOGIN_EXPIRED_PERIOD.VALUE; // 서버로 부터 전달받은 값을 그대로 cookie의 expiredDate로 사용.
      const temporaryPassword = action.payload.data?.temporaryPassword || null;
      setCookie(
        cookieType.AUTO_LOGIN_COOKIE,
        accessToken,
        cookieType.AUTO_LOGIN_EXPIRED_PERIOD.UNIT,
        expiredDate,
        { path: '/' },
      );
      const query = temporaryPassword ? '?tempPw=true' : '';
      window.location.href = '/' + query;
    },
    kakaoLogin(state, action) {
      state.isAdmin = false;
      state.isAuth = true;
      // state.userType = userType.MEMBER_WITH_SNS.KAKAO;
      state.userType = userType.MEMBER;
      const accessToken = action.payload.token || '';
      const expiredDate =
        action.payload.expiredDate || cookieType.LOGIN_EXPIRED_PERIOD.VALUE; // 서버 token지속 기본값: 2시간
      setCookie(
        cookieType.LOGIN_COOKIE,
        accessToken,
        cookieType.AUTO_LOGIN_EXPIRED_PERIOD.UNIT,
        expiredDate,
        { path: '/' },
      );
      window.location.href = '/';
    },
    naverLogin(state, action) {
      state.isAdmin = false;
      state.isAuth = true;
      state.userType = userType.MEMBER_WITH_SNS.NAVER;
      const accessToken = action.payload.token || '';

      setCookie(
        cookieType.LOGIN_COOKIE,
        accessToken,
        cookieType.AUTO_LOGIN_EXPIRED_PERIOD.UNIT,
        { path: '/' },
      );
      window.location.href = '/';
    },
    logout(state) {
      state.isAdmin = false;
      state.isAuth = false;
      // alert('로그아웃'); // ! TEST 시 사용
      setCookie(cookieType.LOGIN_COOKIE, null, 'date', 0, { path: '/' });
      window.location.href = '/';
    },
    adminLogin(state, action) {
      state.isAdmin = true;
      state.isAuth = true;
      const accessToken = action.payload.token || '';
      const expiredDate =
        action.payload.expiredDate && cookieType.LOGIN_EXPIRED_PERIOD.VALUE; // 서버 token지속 기본값: 2시간
      setCookie(
        cookieType.LOGIN_COOKIE,
        accessToken,
        cookieType.LOGIN_EXPIRED_PERIOD.UNIT,
        expiredDate,
        { path: '/' },
      );
    },
    adminAutoLogin(state, action) {
      state.isAdmin = true;
      state.isAuth = true;
      const accessToken = action.payload.token || '';
      const expiredDate =
        action.payload.expiredDate &&
        cookieType.AUTO_LOGIN_EXPIRED_PERIOD.VALUE; // 서버로 부터 전달받은 값을 그대로 cookie의 expiredDate로 사용.
      setCookie(
        cookieType.AUTO_LOGIN_COOKIE,
        accessToken,
        cookieType.AUTO_LOGIN_EXPIRED_PERIOD.UNIT,
        expiredDate,
        { path: '/' },
      );
    },
    adminLogout(state) {
      state.isAdmin = false;
      state.isAuth = false;
      setCookie(cookieType.LOGIN_COOKIE, null, 'date', 0, { path: '/' });
      // alert('관리자 로그아웃 처리되었습니다.'); // ! TEST 시 사용
      window.location.href = '/';
    },
    adminResetPassword(state, action) {
      state.isAdmin = true;
      state.adminInfo = {
        email: action.payload.data.email,
      };
    },
    userRestoreAuthState(state, action) {
      // 쿠키가 존재할 경우 restoreAuthState
      // console.log('Restored User Auth State');
      state.isAuth = true;
      state.isAdmin = action.payload.data.member?.userType === userType.ADMIN;
      state.userType = action.payload.data.member?.userType;
      state.userInfo = action.payload.data.member;
    },
  },
});

export const authAction = authSlice.actions;
export default authSlice;
