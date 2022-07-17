import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authAction } from '/store/auth-slice';
import useUserData from '/util/hook/useUserData';
import { getData, testTokenStateWithOldToken } from '/src/pages/api/reqData';
import { getCookie } from '/util/func/cookie';
import getAdminToken from '/src/pages/api/getAdminToken';

export default function AuthInterceptor({ children }) {
  // const [isAuth, setIsAuth] = useState(false);
  // const userData = useUserData();
  // console.log(userData);
  
  
  
  const router = useRouter();
  const curPath = router.route;
  const dispatch = useDispatch();


  //
  // useEffect(() => {
  //   // USER PATH
  //   // STEP1
  //   const USER_FOBBIDEN_PATH = [];
  //   // const USER_FOBBIDEN_PATH = ['cart', 'order','mypage', 'survey'];
  //   let nonMemberPath;
  //   router.asPath.split('/').map((path) => {
  //     if (USER_FOBBIDEN_PATH.indexOf(path) >= 0) {
  //       return (nonMemberPath = true);
  //     }
  //   });
  //   // STEP 2 // CHECK member & admin Logged in
  //   if(window && typeof window !=='undefined'){
  //     const isAutoLoginState = getCookie('adminAutoLogin');
  //     const loginAdminAccount = isAutoLoginState && !!JSON.parse(isAutoLoginState)?.email;
  //     const loginMemberAccount = !!userData;
  //     setIsAuth(loginMemberAccount || loginAdminAccount);
  //   }
  //
  //   // STEP 3 // BLOCKING auth PATH
  //   if (nonMemberPath) {
  //     dispatch(authAction.userRestoreAuthState());
  //     if (!isAuth) {
  //       // alert('로그인이 필요한 서비스입니다.');  // ! ---------- 실제 서비스에서는 작동시켜야하는 기능입니다.
  //       // router.push('/account/login');
  //       console.error('Redir: User FOBBIDEN PAGE');
  //     }
  //   }
  // }, [userData, router,  isAuth]);
  //
  //

  //
  //
  // useEffect(() => {
  //   // ADMIN PATH
  //   (async () => {
  //     const ADMIN_BASE_PATH = '/bf-admin';
  //     const ADMIN_PUBLIC_PATH = ['/index', '/login', '/dashboard'];
  //     const isAdminPath = router.asPath.split('/')[1] === ADMIN_BASE_PATH.split('/')[1];
  //
  //     // 너의 권한이 무엇이냐 => 쿠키를 통해서 알아봐라
  //
  //     if(!isAdminPath) return;
  //
  //
  //
  //     let isPublicAdminPath = router.asPath === ADMIN_BASE_PATH;
  //     ADMIN_PUBLIC_PATH.map((path) => {
  //       if (curPath.indexOf(`${ADMIN_BASE_PATH}${path}`) >= 0)
  //         return (isPublicAdminPath = true);
  //     });
  //     // admin은 모든 path에 대해서, 항상 토큰을 검증한다....... 그래서........... 공개된 adminPath를 제외하고
  //     //
  //     try {
  //       if (!isPublicAdminPath) {
  //         // const adminAuth = localStorage?.getItem('admin'); // PAST VERSION : localStorage
  //         const res = await valid_adminAuthToken();
  //         // console.log('Valid Token Response: \n',res);
  //         const status = res.status;
  //         const availableToken = status === 200;
  //         const expiredToken = status === 401 // 추후 REFRESH TOKEN기능 개발 후 확인
  //         const adminCookie = getCookie('adminRefreshToken');
  //         const data = JSON.parse(adminCookie);
  //         const autoLogin = data.autoLogin;
  //         if(availableToken) {
  //           dispatch(authAction.adminRestoreAuthState({ autoLogin}));
  //
  //         } else if (expiredToken){
  //           // CASE 1. (basic) Cookie의 토큰 만료 => 다시 로그인
  //           // CASE 2. (Advanced) Refresh Token기능을 server 쪽에서 개발돠고나서 가능할 것
  //           // CASE 3. (FORBIDDEN) 용자의 ID, PW를 클라이언트에 저장해 => 자동으로 재발급받게 하는것은 제외
  //           if(autoLogin){
  //             const refreshToken = data.refreshToken; // ! 리프레쉬 토큰의 임시방편
  //             const accessToken = await getAdminToken(refreshToken)
  //             dispatch(authAction.adminUpdateAccessToken({token: accessToken, refreshToken}));
  //           } else if (res.error) {
  //             await router.push(`${ADMIN_BASE_PATH}/login?redir=${status}`);
  //           }
  //         }
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   })();
  // }, [userData, router,  isAuth]);

  useEffect(() => {
    (async () => {
      // ADMIN
      const ADMIN_BASE_PATH = '/bf-admin';
      const ADMIN_PUBLIC_PATH = ['/index', '/login', '/dashboard'];
      
      let isPublicAdminPath = router.asPath === ADMIN_BASE_PATH;
      ADMIN_PUBLIC_PATH.map((path) => {
        if (curPath.indexOf(`${ADMIN_BASE_PATH}${path}`) >= 0) return (isPublicAdminPath = true);
      });
      // MEMBER
      const MEMBER_BASE_PATH = '/';
      const NON_MEMBER_FOBBIDEN_PATH = ['cart', 'order', 'mypage', 'survey'];
      let MEMBER_PATH;
      router.asPath.split('/').map((path) => {
        if (NON_MEMBER_FOBBIDEN_PATH.indexOf(path) >= 0) {
          return (MEMBER_PATH = true);
        }
      });

      try {
        // STEP 1 : VALIDATION COOKIE
        const adminTokenRes = await valid_authByTokenStatus('admin'); // 토큰의 유효성 검증함
        const isAdmin = adminTokenRes.valid;
        const userTokenRes = await valid_authByTokenStatus('user'); // 토큰
        const isAuthUser = userTokenRes.valid;
        const adminCookie = getCookie('adminRefreshToken');
        const userCookie = getCookie('userRefreshToken');

        // STEP 2 REISSUANCE WHEN TOKEN HAS EXPIRED
        const cookieData = JSON.parse(adminCookie || userCookie);
        console.log('adminTokenRes : ', adminTokenRes);
        console.log('userTokenRes : ', userTokenRes);
  
        const autoLogin = cookieData.autoLogin;
        if (autoLogin && (!adminTokenRes.valid || !userTokenRes.valid)) {
          const refreshToken = cookieData.refreshToken;
          const accessToken = await getAdminToken(refreshToken);
          dispatch(authAction.adminUpdateAccessToken({ token: accessToken, refreshToken })); //refreshToken은 client Dev 상태에서 redux check 용도로 사용
          // CASE 1. (basic) Cookie의 토큰 만료 => 다시 로그인
          // CASE 2. (Advanced) Refresh Token기능을 server 쪽에서 개발돠고나서 가능할 것
          // CASE 3. (FORBIDDEN) ID, PW 쿠키에 저장 후, refresh Token처럼 사용  => ! 현재 admin에서 임시로 사용
         
        }

        // STEP 3 : GET COOKIE && UPDATE USER STATE ( REDUX )
        if (isAdmin) {
          // console.log('어드민')
          dispatch(authAction.adminRestoreAuthState({ autoLogin }));
        } else if (isAuthUser) {
          // console.log('유저')
          dispatch(authAction.userRestoreAuthState({ autoLogin }));
        }

        // STEP 4 : REDIRECT (WHEN USER DO NOT HAVE PERMISSION)
        const isAdminPath = router.asPath.split('/')[1] === ADMIN_BASE_PATH.split('/')[1];
        if (!isAdmin && isAdminPath && !isPublicAdminPath) {
          // admin Path
          alert('관리자 외에 접근 권한이 없는 페이지입니다.');
          await router.push(`${ADMIN_BASE_PATH}/login?redir=${adminTokenRes.status}`);
        } else if (!isAdmin && !isAuthUser && MEMBER_PATH) {
          alert('비회원은 접근 권한이 없는 페이지입니다.');
          await router.push(`/account/login?redir=${userTokenRes.status}`);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [router]);

  return <>{children}</>;
}

const valid_authByTokenStatus = async (userType = 'admin') => {
  let valid;
  let error;
  const res = await valid_accessToken(userType);
  const status = res.status;
  console.log(res); //
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

export const valid_accessToken = async (type = 'admin') => {
  // 임의의 admin api를 통하여, admin token의 유효성 체크
  
  let error = null;
  let status;
  try {
    const checkTokenAPiUrl = type === 'admin' ? '/api/admin/setting' : '/api/members';
    const response = await getData(checkTokenAPiUrl);
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
        if (response.data.reason === 'EXPIRED_TOKEN') {
          error = 'EXPIRED_TOKEN';
        } else if (response.data.reason === 'UNAUTHORIZED') {
          error = 'UNAUTHORIZED';
        }
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
    console.log(err)
    console.error('TOKEN VALID > ERROR RESPONSE : ', err.response);
  }
  return { error, status };
};
