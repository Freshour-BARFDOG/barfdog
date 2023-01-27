import { useRouter } from 'next/router';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { authAction } from '/store/auth-slice';
import { setCookie } from '/util/func/cookie';
import { cookieType } from '/store/TYPE/cookieType';
import { userType } from '/store/TYPE/userAuthType';
import { cartAction } from './cart-slice';
import {URLPathClass} from "../src/class/URLPathClass";

export default function AuthInterceptor({ CustomProps, children }) {

  const router = useRouter();
  const dispatch = useDispatch();
  const {data, token, EXPIRED_TOKEN, USERTYPE} = CustomProps; // DATA FROM SSR
  
  // DATA FROM CLIENT SERVER // 새로고침 이전까지 유지되는 데이터
  const [DATA, setDATA] = useState( {data, token, EXPIRED_TOKEN, USERTYPE} );
  // console.log('DATA : ',  DATA)
  
  // console.log('SSR >> auth-interceptor.js', '\nDATA: ', DATA);
  // console.log('CRS >> auth-interceptor.js\n','USER_TYPE: ',DATA.USERTYPE, '\nEXPIRED_TOKEN: ',!DATA.EXPIRED_TOKEN, '\nDATA: ', DATA.data)
  //
  // STEP 1. CHECK USER TYPE UPDATE & stored DATA in REDUX (in NextJS SERVER)
  token && dispatch(authAction.userRestoreAuthState({data: DATA.data}));
  
  
  useEffect(() => {
    // STEP 2. 만료된 토큰 삭제
    // CF. ADMIN과 USER가 동일한 쿠키를 사용하지만, (Server에서 발급하는 JWT에서 Role을 구별하는 방식)
    // CF.  FONTEND에서 해당 사항을 인지할 수 있도록, 명시성을 위해 중복하여 코드를 작성함
    if (DATA.USERTYPE !== userType.ADMIN && DATA.EXPIRED_TOKEN.ADMIN === true) {
      setCookie(cookieType.LOGIN_COOKIE, null, cookieType.AUTO_LOGIN_COOKIE.UNIT, 0, { path: '/' });
      alert('어드민 인증 시간이 만료되었습니다. 다시 로그인해주세요.');
      dispatch(authAction.adminLogout());
      
    } else if (DATA.USERTYPE !== userType.MEMBER && DATA.EXPIRED_TOKEN.MEMBER === true) {
      setCookie(cookieType.LOGIN_COOKIE, null, cookieType.AUTO_LOGIN_COOKIE.UNIT, 0, { path: '/' });
      alert('사용자 인증 시간이 만료되었습니다. 다시 로그인해주세요.');
      dispatch(authAction.logout());
    }
  

    
    // REDIRECT (검증조건: 경로 & 권한)
    const pathClass = new URLPathClass();
    pathClass.checkAuthAndRedirect(DATA.USERTYPE);
    
  }, [router]);
  
  
  useEffect(() => {
    // 장바구니 정보 REDUX 저장 > 헤더 장바구니 개수 표기
    if (data?.cart) {
      dispatch(cartAction.setInfo({ data: data.cart }));
    }
  }, [data]);
  
  
  return <>{children}</>;
}
