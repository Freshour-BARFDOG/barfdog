import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authAction } from '/store/auth-slice';
import useUserData from '/util/hook/useUserData';
import { getData, testTokenStateWithOldToken } from '/src/pages/api/reqData';
import {getCookie, setCookie} from '/util/func/cookie';
import getAdminToken from '/src/pages/api/getAdminToken';
import {cookieType} from "/store/TYPE/cookieType";
import {userType} from "/store/TYPE/userAuthType";

export default function AuthInterceptor({ children }) {

  const router = useRouter();
  const dispatch = useDispatch();


  useEffect(() => {
    (async () => {
      
      // const res = await fetch('/api/authState');
      // console.log(res);
      //
      // SET CONDITION
      // STEP 1 : CHECK USER TYPE
      const valid_adminState = await valid_authByTokenStatus(userType.ADMIN); // 토큰의 유효성 검증함
      const valid_memberState = await valid_authByTokenStatus(userType.MEMBER); // 토큰
      
      // 토큰 만료 시, 만료된 Cookie 자동 삭제
      const EXPIRED_TOKEN_ADMIN = valid_adminState.status === 401;
      const EXPIRED_TOKEN_MEMBER = valid_memberState.status === 401;
      if(EXPIRED_TOKEN_MEMBER){
        setCookie(cookieType.LOGIN_COOKIE,  null,  'date', 0, {path:'/'} );
      }else if(EXPIRED_TOKEN_ADMIN){
        // CF. ADMIN과 USER가 동일한 쿠키를 사용하지만, (Server에서 발급하는 JWT에서 Role을 구별하는 방식)
        // CF.  FONTEND에서 해당 사항을 인지할 수 있도록, 명시성을 위해 중복하여 코드를 작성함
        setCookie(cookieType.LOGIN_COOKIE,  null,  'date', 0, {path:'/'} );
      }
  
  
      const USER_TYPE_ADMIN = valid_adminState.status === 200 && valid_memberState.status === 200;
      const USER_TYPE_MEMBER = valid_adminState.status !== 200 && valid_memberState.status === 200;
      const USERTYPE = USER_TYPE_ADMIN ? userType.ADMIN : USER_TYPE_MEMBER ? userType.MEMBER : userType.NON_MEMBER;
      // console.log('valid_adminState', valid_adminState)
      // console.log('valid_memberState', valid_memberState)
      // console.log('USERTYPE: ', USERTYPE)
      // STEP. FE SERVER > VALIDATION > COOKIE
      if(USERTYPE !== userType.NON_MEMBER){
        const loginCookie = getCookie(cookieType.LOGIN_COOKIE);
        loginCookie && dispatch(authAction.userRestoreAuthState());
      }
      

      
      
  
      // MEMBER PATH
      const ADMIN_BASE_PATH_KEY = 'bf-admin';
      let MEMBER_PATH = false;
      const memberPathList = ['cart', 'order', 'mypage', 'survey'];
      router.asPath.split('/').forEach((path, index) => {
        if(memberPathList.indexOf(path) >= 0 && (index === 1 && path !== ADMIN_BASE_PATH_KEY)){
          return MEMBER_PATH = true;
        }
      });
      
      // ADMIN PATH
      let ADMIN_PATH = false;
      const curPath = router.asPath;
      const ADMIN_BASE_PATH = '/bf-admin';
      const adminPublicPathList = ['/index', '/login'];
      let ADMIN_PUBLIC_PATH = false;
      adminPublicPathList.forEach((path) => {
        const adminPath = curPath.replace(ADMIN_BASE_PATH, '')
        if (adminPath.indexOf(`${path}`) >= 0){
          ADMIN_PUBLIC_PATH = true;
        }
      });
      if(router.asPath.indexOf('bf-admin')  >= 0 && !ADMIN_PUBLIC_PATH){
        ADMIN_PATH = true;
      }
      // console.log('MEMBER_PATH', MEMBER_PATH)
      // console.log('ADMIN_PATH', ADMIN_PATH)
      if(!MEMBER_PATH && !ADMIN_PATH)return;
      
      try {
        
        // LAYER : ADMIN LAYER (BASE) => MEMBER LAYER => SUBSCRIBER LAYER (TOP)
        const REDIR_PATH = ADMIN_PATH ? '/bf-admin/login' : '/account/login'

        if (MEMBER_PATH && USERTYPE === userType.NON_MEMBER){
          alert('회원가입이 필요한 페이지입니다.');
          return  await router.push(REDIR_PATH);
        } else if (USERTYPE !== userType.ADMIN && ADMIN_PATH){
          alert('일반 사용자에게 접근권한이 없는 페이지입니다.');
          return await router.push(REDIR_PATH);
        }
  
  
        
       
        // 이동 중에 토큰 만료됐을 경우.
        if(EXPIRED_TOKEN_MEMBER){
          alert('사용자 인증 시간이 만료되었습니다. 다시 로그인해주세요.');
          dispatch(authAction.logout());
          return await router.push(REDIR_PATH);
        }else if(EXPIRED_TOKEN_ADMIN){
          alert('어드민 인증 시간이 만료되었습니다. 다시 로그인해주세요.');
          dispatch(authAction.adminLogout());
          return await router.push(REDIR_PATH);
        }
        
        
        
        const autoLoginCookie = JSON.parse(getCookie(cookieType.AUTO_LOGIN_COOKIE));
  
        // 쿠키 데이터가 존재하면
        if (autoLoginCookie && (!valid_adminState.valid || !valid_memberState.valid)) {
          // const accessToken = await getAdminToken(refreshToken);
        }

        // STEP 3 : GET COOKIE && UPDATE USER STATE ( REDUX )

      } catch (err) {
        console.error(err);
      }
    })();
  }, [router]);

  return <>{children}</>;
}

const valid_authByTokenStatus = async (type = userType.ADMIN) => {
  let valid;
  let error;
  const res = await valid_accessToken(type);
  const status = res.status;
  // console.log(res); //
  const availableToken = status === 200;
  const expiredToken = status === 401; // 추후 REFRESH TOKEN기능 개발 후 확인
  if (availableToken) {
    error = '';
  } else if (expiredToken) {
    error = '토큰이 만료되었습니다.';
  } else {
    error = '유효하지 않은 회원압니다.';
  }
  valid = !error;
  return { valid, status, error };
};

export const valid_accessToken = async (type = userType.ADMIN) => {
  // 임의의 admin api를 통하여, admin token의 유효성 체크
  
  let error = null;
  let status;
  try {
    const checkTokenAPiUrl = type === userType.ADMIN ? '/api/admin/setting' : '/api/members';
    const response = await getData(checkTokenAPiUrl, type);
    status = response.status;
    // console.log(type, checkTokenAPiUrl, response)
    // const response = await testTokenStateWithOldToken(checkTokenAPiUrl);
    switch (status) {
      case 200:
        error = ''; // 유효한 토큰 : 요청을 성공적으로 처리함
        break;
      case 201:
        error = '';
        // 새 리소스를 성공적으로 생성함. 응답의 Location 헤더에 해당 리소스의 URI가 담겨있다.
        break;
      case 400:
        error = '잘못된 요청을 보냈습니다.';
        break;
      case 401:
        if (response.data.reason === 'EXPIRED_TOKEN') { // 토큰 생사여부 체크 (SERVER 첫 번째 검증단계)
          error = 'EXPIRED_TOKEN';
        } else if (response.data.reason === 'UNAUTHORIZED') {
          error = 'UNAUTHORIZED';
        }
        error = `인증 토큰이 만료되었습니다`;
        break;
      case 403:
        error = '해당 토큰으로는 접근할 수 없습니다.'; // 권한 체크 ( SERVER 토큰 이후 검증 단계)
        break;
      case 404:
        error = '요청한 리소스가 서버에 없습니다.';
        break;
      case 409:
        error = '중복된 리소스가 이미 존재합니다.';
        break;
      case 500:
        error = `${status}: 데이터를 조회할 수 없습니다.`;
        break;
    }
  } catch (err) {
    console.log(err)
    console.error('TOKEN VALID > ERROR RESPONSE : ', err.response);
  }
  return { error, status };
};
