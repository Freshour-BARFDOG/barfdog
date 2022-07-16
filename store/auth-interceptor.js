import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authAction } from '/store/auth-slice';
import useUserData from '/util/hook/useUserData';
import { getData, testTokenStateWithOldToken } from '/src/pages/api/reqData';
import {getCookie} from "@util/func/cookie";
import getAdminToken from "@src/pages/api/getAdminToken";

export default function AuthInterceptor({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const userData = useUserData();
  const router = useRouter();
  const curPath = router.route;
  const dispatch = useDispatch();
  

  useEffect(() => {
    // USER PATH
    
    // STEP1
    const USER_FOBBIDEN_PATH = [];
    // const USER_FOBBIDEN_PATH = ['cart', 'order','mypage', 'survey'];
    let nonMemberPath;
    router.asPath.split('/').map((path) => {
      if (USER_FOBBIDEN_PATH.indexOf(path) >= 0) {
        return (nonMemberPath = true);
      }
    });
    
    // STEP 2 // CHECK member & admin Logged in
    if(window && typeof window !=='undefined'){
      const isAutoLoginState = getCookie('adminAutoLogin');
      const loginAdminAccount = isAutoLoginState && !!JSON.parse(isAutoLoginState)?.email;
      const loginMemberAccount = !!userData;
      setIsAuth(loginMemberAccount || loginAdminAccount);
    }
    
    // STEP 3 // BLOCKING auth PATH
    if (nonMemberPath) {
      dispatch(authAction.userRestoreAuthState());
      if (!isAuth) {
        // alert('로그인이 필요한 서비스입니다.');  // ! 실제 서비스에서는 작동시켜야하는 기능입니다.
        // router.push('/account/login');
        console.error('Redir: User FOBBIDEN PAGE');
      }
    }
    
    
    // ADMIN PATH
    (async () => {
      const ADMIN_BASE_PATH = '/bf-admin';
      const ADMIN_PUBLIC_PATH = ['/index', '/login', '/dashboard'];
      const isAdminPath = router.asPath.split('/')[1] === ADMIN_BASE_PATH.split('/')[1];
      if(!isAdminPath) return;
      let isPublicAdminPath = router.asPath === ADMIN_BASE_PATH;
      ADMIN_PUBLIC_PATH.map((path) => {
        if (curPath.indexOf(`${ADMIN_BASE_PATH}${path}`) >= 0)
          return (isPublicAdminPath = true);
      });
      
      
      try {
        if (!isPublicAdminPath) {
          // const adminAuth = localStorage?.getItem('admin'); // PAST VERSION.
          const res = await valid_adminAuthToken();
          // console.log(res)
          const status = res.status;
          const expiredTokenStatus = res.status === 401
          const isAutoLoginState = getCookie('adminAutoLogin');
          if(expiredTokenStatus && isAutoLoginState){
            const refreshToken = JSON.parse(isAutoLoginState);// ! 리프레쉬 토큰 기능에 대한 임시방편 수단
            // ! 또는 server에서 token의 생명주기를 autoLogin에 따라 조절
            const accessToken = await getAdminToken(refreshToken)
            dispatch(authAction.adminRestoreAuthState(accessToken));
          } else if (res.error) {
            await router.push(`${ADMIN_BASE_PATH}/login?redir=${status}`);
            const errorMessage = res.error;
            // console.log(router.query)
            // console.error(errorMessage);
          }
          
          
        }
      } catch (err) {
        console.error(err);
      }
    })();
    
  }, [userData, router,  isAuth]);


  return <>{children}</>;
}


export const valid_adminAuthToken = async () => {
  let error = null;
  let status;
  try {
    const checkTokenAPiUrl = '/api/admin/setting'; // 임의의 admin api를 통하여, admin token의 유효성 체크
    const response = await getData(checkTokenAPiUrl);
    // const response = await testTokenStateWithOldToken(checkTokenAPiUrl);
    status = response.status;
    switch (status) {
      case 200:
        error = '';
        // 유효한 토큰 : 요청을 성공적으로 처리함
        break;
      case 201:
        error = '';
        // 새 리소스를 성공적으로 생성함. 응답의 Location 헤더에 해당 리소스의 URI가 담겨있다.
        break;
      case 400:
        error = '잘못된 요청을 보냈습니다.';
        break;
      case 401:
        error = '인증 토큰이 만료되었습니다';
        break;
      case 403:
        error = '해당 토큰으로는 접근할 수 없습니다.';
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
    console.error('TOKEN VALID > ERROR RESPONSE : ', err.response);
  }
  return { error, status };
};
