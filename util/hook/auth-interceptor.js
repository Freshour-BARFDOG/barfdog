import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authAction } from '@store/auth-slice';
import useUserData from "@util/hook/useUserData";


const FullScreenLoading = () => {
  return <p>풀스크린 로딩컴포넌트: 추후 추가예정</p>
}






 const AuthInterceptor = ({children}) => {

   const [loading, setLoading] = useState(false);
   const [isAuth, setIsAuth] = useState(false);

   const userData = useUserData();
   const router = useRouter();
   const dispatch = useDispatch();
   const curPath = router.route;




   useEffect(() => {


     // ADMIN PATH
     const ADMIN_BASE_PATH_KEY = "bf-admin";
     const ADMIN_PUBLIC_PATH = ['/index', '/login', '/dashboard'];
     const isAdminPath = router.asPath.split("/")[1] === ADMIN_BASE_PATH_KEY;


     // USER PATH
     const USER_FOBBIDEN_PATH = ['cart', 'mypage','survey'];
     let nonMemberPath;
     router.asPath.split("/").map((path)=>{
       if(USER_FOBBIDEN_PATH.indexOf(path) >= 0){
         return nonMemberPath = true
       }
     });

     setIsAuth(!!userData)

    if (!isAuth && nonMemberPath ) {
      // alert('로그인이 필요한 서비스입니다.')
      console.error('Redir: User FOBBIDEN PAGE');
      // router.push('/account/login');
      // ! 로그인상태확인
      // ! 포비든 페이지확인
      // ! 안내문을 띄우고, 로그인페이지로 이동시킨다.
    }


    if (isAdminPath){ // TEST
      dispatch(authAction.adminRestoreAuthState()); // 토큰 다시 발급

      let isPublicAdminPath;
      ADMIN_PUBLIC_PATH.map(path=>{
        if(curPath.indexOf(`/${ADMIN_BASE_PATH_KEY}${path}`) >= 0) return isPublicAdminPath = true;
      })

      const adminAuth = localStorage?.getItem("admin");
      if (!adminAuth && !isPublicAdminPath) {
        console.error('Redir');
        router.push(`/${ADMIN_BASE_PATH_KEY}/login`);
      }
    }
   }, [curPath, dispatch, router, userData, isAuth]);




   return (
     <>
       {loading ? <FullScreenLoading /> : children}
     </>
   );
 };

export default AuthInterceptor;
