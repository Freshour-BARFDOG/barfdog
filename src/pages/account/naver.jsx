import { useRouter, useLocation } from 'next/router';
import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userType } from '/store/TYPE/userAuthType';
import { snsProviderType } from '/store/TYPE/snsProviderType';
import { userStateAction } from '/store/userState-slice';
import { authAction } from '/store/auth-slice';
import { FullScreenRunningDog } from '/src/components/atoms/FullScreenLoading';
import MetaTitle from '../../components/atoms/MetaTitle';

export default function NAVER_Auth({ data, err, token }) {
  // console.log(data, err);
  const router = useRouter();
  const dispatch = useDispatch();
  const userSnsInfo = {
    provider: data.provider,
    providerId: data.providerId,
    ...data.userInfo, // 그외 provider에게서 제공받은 데이터 추가 (ex. email 등)
  };

  useEffect(() => {
    // CASE : ERROR
    if (!window || typeof window === 'undefined') return;

    const redirUrl = '/account/login';
    if (err) {
      // return alert(err+'\n로그인페이지로 redir');
      return (window.location.href = redirUrl); // !  PRODUCT CODE
    }

    (async () => {
      if (data.snsUserType === userType.NON_MEMBER) {
        // CASE: 비회원 > 회원가입 페이지로 이동
        dispatch(userStateAction.setSnsInfo({ data: userSnsInfo }));
        await router.push('/account/signup');
      } else if (data.snsUserType === userType.MEMBER) {
        // CASE: 회원 > 연동되지 않았을 경우, 연동페이지로 이동
        dispatch(userStateAction.setSnsInfo({ data: userSnsInfo }));
        await router.push('/account/valid-sns');
      } else if (data.snsUserType === userType.MEMBER_WITH_SNS.KAKAO) {
        alert('카카오 간편로그인이 연동되어있습니다. 카카오로 시작해주세요.');
        return (window.location.href = redirUrl);
      } else if (data.snsUserType === userType.MEMBER_WITH_SNS.NAVER) {
        // CASE: SNS연동완료된 회원 => 로그인 처리
        const payload = {
          token,
          expiredDate: 10,
        };
        dispatch(authAction.naverLogin(payload));
      }
    })();
    // CASE : SUCCESS SNS LOGIN
  }, [data, err]);

  return (
    <>
      <MetaTitle title="Naver Login Auth" />
      <FullScreenRunningDog opacity={1} />
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { code } = query;

  let err = null;

  let snsUserType = null;
  let userInfo = null;
  let naverToken = null;
  let token = null;

  if (!code) {
    // 인가코드 없을 경우, Redir
    return {
      redirect: {
        destination: '/account/login',
      },
    };
  }

  // let token = await axios.post(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET}&code=${code}`,

  try {
    const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const NAVER_CLIENT_SECRET = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET;
    const NAVER_REDIRECT_URI = encodeURI(
      process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI,
    );
    const GRANT_TYPE = 'authorization_code';
    // // console.log('NAVER_REDIRECT_URI: ',NAVER_REDIRECT_URI);

    let naverResponse = await axios.post(
      `https://nid.naver.com/oauth2.0/token?grant_type=${GRANT_TYPE}&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}`,
      {},
      {
        headers: {
          'content-Type': 'application/json',
        },
      },
    );
    // console.log('naverResponse: ', naverResponse);
    naverToken = naverResponse.data.access_token;
  } catch (err) {
    // console.log('error:', err.response);
  }

  try {
    const body = {
      accessToken: naverToken, // Naver Api Access Token
      tokenValidDays: 10, // null일경우 2시간 유효 ( 회원검증을 위해서 , 최소한의 시간만 로그인 State을 유지시킴)
    };
    let res = await axios
      .post('/api/login/naver', body, {
        headers: {
          'content-Type': 'application/json',
        },
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });

    // console.log('BARFDOG API SERVER res::::: ', res);
    // res = DUMMY_NEW_MEMBER_RESPONSE; ////////  ! TEST
    // res = DUMMY_MEMBER_RESPONSE; ////////  ! TEST
    if (res.status === 500) {
      // 서버응답이 없을 경우, Redir
      return {
        redirect: {
          permanent: false,
          destination: '/account/login',
        },
      };
    }

    if (res.data) {
      const resultCode = Number(res.data.resultcode) || null;
      const resultMessage = res.data.message || null;
      const serverRes = res.data.response;

      userInfo = {
        accessToken: body.accessToken, // Naver Api Access Token
        tokenValidDays: body.tokenValidDays, // 토큰 지속시간
        id: serverRes?.id || null,
        gender: serverRes?.gender || null,
        email: serverRes?.email || null,
        mobile: serverRes?.mobile || null,
        mobile_e164: serverRes?.mobile_e164 || null,
        name: serverRes?.name || null,
        birthday: serverRes?.birthday || null,
        birthyear: serverRes?.birthyear || null,
      };
      if (resultCode === 251) {
        // 비회원
        snsUserType = userType.NON_MEMBER;
      } else if (resultCode === 252) {
        // 회원 & SNS연동 아직 안 한 CASE
        snsUserType = userType.MEMBER;
      } else if (resultCode === 253) {
        // 이미 카카오 연동되어있는 계정 => 연동 불가 처리
        snsUserType = userType.MEMBER_WITH_SNS.KAKAO;
        token = null;
      } else if (resultCode === 254 || resultCode === 200) {
        // 기존 네이버 연동 계정 => 로그인 처리
        snsUserType = userType.MEMBER_WITH_SNS.NAVER;
        token = res.headers.authorization;
      }
      // console.log(userInfo)
      if (
        resultCode === 24 ||
        resultCode === 28 ||
        resultCode === 403 ||
        resultCode === 404 ||
        resultCode === 500
      ) {
        err = resultMessage;
      }
    } else {
      err = 'Failed to get Server Response\n서버 응답값이 없습니다.';
    }
  } catch (err) {
    console.error(err);
  }

  const serverSideData = {
    snsUserType,
    providerId: code,
    provider: snsProviderType.NAVER, // ! IMPORTANT:  PROVIDER > NAVER
    userInfo: userInfo,
  };
  return { props: { data: serverSideData, err, token } };
}

/*
- response body에 resultcode, message 값 / 설명
  024, Authentication failed / 인증에 실패했습니다.
  028, Authentication header not exists / OAuth 인증 헤더(authorization header)가 없습니다.
  251, new member / 기존회원 존재하지않고 처음 방문한 사용자 → 네이버 api 회원 정보 이용해서 회원가입 페이지로 가서 추가 입력
  252, need to connect new sns / 기존회원 존재하나 sns 연동 되지 않음 → sns 연동 페이지로 이동
  253, has already been connected by kakao / 이미 카카오로 연동되어있는 계정 (카카오 로그인시 200 success 로그인 처리)
  254, has already been connected by naver / 이미 네이버로 연동되어있는 계정 (네이버 로그인시 200 success 로그인 처리)
  200, success / 간편로그인 성공: 응답 header에 'Authorization' 존재함
  500, internal error: 내부 에러
- 기타 네이버 api 에러
  024, Authentication failed / 인증에 실패했습니다.
  028, Authentication header not exists / OAuth 인증 헤더(authorization header)가 없습니다.
  403, Forbidden / 호출 권한이 없습니다. API 요청 헤더에 클라이언트 ID와 Secret 값을 정확히 전송했는지 확인해보시길 바랍니다.
  404, Not Found / 검색 결과가 없습니다. -
  500, Internal Server Error / 데이터베이스 오류입니다. 서버 내부 에러가 발생하였습니다. 포럼에 올려주시면 신속히 조치하겠습니다.
*/

//
//
// const DUMMY_NEW_MEMBER_RESPONSE = {
//   // 신규 멤버일 경우
//   data: {
//     resultcode: '251',
//     message: 'new member',
//     response: {
//       id: 'p4N4jAY5Q0qszLDW8Wx2W30K3eKkRUlHEVivAHgR0XQ222', // SNS 고유 식별 ID
//       gender: 'F',
//       email: 'develope07@binter.co.kr',
//       mobile: '01056781234',
//       mobile_e164: '+821056781234',
//       name: '관리자계정',
//       birthday: '12-01',
//       birthyear: '1999',
//     },
//   },
// };
//
// const DUMMY_MEMBER_RESPONSE = {
//   // 기존에 회원가입된 멤버일 경우
//   data: {
//     resultcode: '252',
//     message: 'need to connect new sns',
//     response: {
//       id: 'p4N4jAY5Q0qszLDW8Wx2W30K3eKkRUlHEVivAHgR0XQ', // SNS 고유 식별 ID
//       gender: 'F',
//       email: 'develope07@binter.co.kr',
//       mobile: '01056781234',
//       mobile_e164: '+821056781234',
//       name: '관리자계정',
//       birthday: '12-01',
//       birthyear: '1999',
//     },
//   },
// };
