import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authAction } from '/store/auth-slice';
import { setCookie } from '/util/func/cookie';
import { cookieType } from '/store/TYPE/cookieType';
import { userType } from '/store/TYPE/userAuthType';
import { cartAction } from './cart-slice';

export default function AuthInterceptor({ CustomProps, children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const {data, token, EXPIRED_TOKEN, USERTYPE} = CustomProps;
  const [currentUSERTYPE, setCurrentUSERTYPE] = useState(USERTYPE); // ! IMPORTANT // INITIALIZE BY _app.jsx

  console.log('auth-interceptor.js\n','USER_TYPE: ',currentUSERTYPE, '\nEXPIRED_TOKEN:',EXPIRED_TOKEN, '\ndata: ', data)
  
  useEffect(() => {
    // 장바구니 정보 REDUX 저장 > 헤더 장바구니 개수 표기
    if (data?.cart) {
      dispatch(cartAction.setInfo({ data: data.cart }));
    }
  }, [data]);
  
  useEffect(() => {
    // STEP 1. CHECK USER TYPE (IN FE SERVER)
    if (USERTYPE !== null) {
      // IMPORTANT
      dispatch(authAction.setUserType({ userType: USERTYPE }));
      token && dispatch(authAction.userRestoreAuthState({USERTYPE}));
      setCurrentUSERTYPE(USERTYPE);
    }


    // STEP 2. 만료된 토큰 삭제
    // CF. ADMIN과 USER가 동일한 쿠키를 사용하지만, (Server에서 발급하는 JWT에서 Role을 구별하는 방식)
    // CF.  FONTEND에서 해당 사항을 인지할 수 있도록, 명시성을 위해 중복하여 코드를 작성함
    if (EXPIRED_TOKEN.ADMIN === true) {
      setCookie(cookieType.LOGIN_COOKIE, null, 'date', 0, { path: '/' });
      alert('어드민 인증 시간이 만료되었습니다. 다시 로그인해주세요.');
      dispatch(authAction.adminLogout());
    }

    if (EXPIRED_TOKEN.MEMBER === true) {
      setCookie(cookieType.LOGIN_COOKIE, null, 'date', 0, { path: '/' });
      alert('사용자 인증 시간이 만료되었습니다. 다시 로그인해주세요.');
      dispatch(authAction.logout());
    }



    // LAYER : ADMIN LAYER (BASE) => MEMBER LAYER => SUBSCRIBER LAYER (TOP)
    // STEP 3. MEMBER PATH > 권한에 따른 접근경로 설정
    if (!window || typeof window === 'undefined') return; //validation
    const ADMIN_BASE_PATH_KEY = 'bf-admin';
    let MEMBER_PATH = false;
    const memberPathList = ['cart', 'order', 'mypage', 'survey'];
    router.asPath.split('/').forEach((path, index) => {
      if (memberPathList.indexOf(path) >= 0 && index === 1 && path !== ADMIN_BASE_PATH_KEY) {
        return (MEMBER_PATH = true);
      }
    });



    // STEP 4. ADMIN PATH > 권한에 따른 접근경로 설정
    let ADMIN_PATH = false;
    const curPath = router.asPath;
    const ADMIN_BASE_PATH = '/bf-admin';
    const adminPublicPathList = ['/index', '/login'];
    let ADMIN_PUBLIC_PATH = false;
    adminPublicPathList.forEach((path) => {
      const adminPath = curPath.replace(ADMIN_BASE_PATH, '');
      if (adminPath.indexOf(`${path}`) >= 0) {
        ADMIN_PUBLIC_PATH = true;
      }
    });
    if (router.asPath.indexOf('bf-admin') >= 0 && !ADMIN_PUBLIC_PATH) {
      ADMIN_PATH = true;
    }

    if (!MEMBER_PATH && !ADMIN_PATH) return;

    const REDIR_PATH = ADMIN_PATH ? '/bf-admin/login' : '/account/login';
    if (MEMBER_PATH && currentUSERTYPE === userType.NON_MEMBER) {
      alert('회원가입이 필요한 페이지입니다.');
      router.push(REDIR_PATH);
    } else if (ADMIN_PATH && currentUSERTYPE !== userType.ADMIN) {
      alert('일반 사용자에게 접근권한이 없는 페이지입니다.');
      router.push(REDIR_PATH);
    }
    // console.log('MEMBER_PATH', MEMBER_PATH)
    // console.log('ADMIN_PATH', ADMIN_PATH)
  }, [USERTYPE, EXPIRED_TOKEN, router]);




  return <>{children}</>;
}

