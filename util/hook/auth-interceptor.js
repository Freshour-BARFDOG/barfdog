import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authAction } from '@store/auth-slice';




 const AuthInterceptor = ({children}) => {
   const [loading, setLoading] = useState(false);


   const router = useRouter();
   const dispatch = useDispatch();
   const curPath = router.route;

   const ADMIN_BASE_PATH_KEY = "bf-admin";
   const ADMIN_PUBLIC_PATH_KEY = "/index";
   const isAdminPath = router.asPath.split("/")[1] === ADMIN_BASE_PATH_KEY;

   useEffect(() => {
    
    const isUserAuth = localStorage.getItem("user");
    if (!isUserAuth) {
      // 로그인해야만 접근할 수 있는 페이지
      // 해당 페이지 접근 시, login하세요 && 페이지 이동 막음
    }


    if (isAdminPath){
      dispatch(authAction.adminRestoreAuthState()); // 토큰 다시 발급
      const isPublicAdminPath =
        curPath.indexOf(`/${ADMIN_BASE_PATH_KEY}${ADMIN_PUBLIC_PATH_KEY}`) >=
        0;
      const adminAuth = localStorage?.getItem("admin");
      // 특정한 페이지면 무조건 redirection
      if (!adminAuth && !isPublicAdminPath) {
        router.push(`/${ADMIN_BASE_PATH_KEY}/login`);
      }
    }

   }, [curPath, isAdminPath, dispatch, router]);


   const FullScreenLoading = () => {
     return <p>풀스크린 로딩컴포넌트: 추후 추가예정</p>
   }

   return (
     <>
       {loading ? <FullScreenLoading /> : children}
     </>
   );
 };

export default AuthInterceptor;




AuthInterceptor.getInitialProps = async (ctx) => {
  // ! 2번째 이상 페이지일 경우 작동 (로그인을 먼저하고 접속해야 여기가 작동함);

  // const res = await fetch("https://api.github.com/repos/vercel/next.js");
  // const json = await res.json();
  // console.log('SSR -> getInitialProps 테스트')
  // console.log(json)
  return { data: 'SSR로 받아올 데이터가 있다면 출력한다.' };
};
