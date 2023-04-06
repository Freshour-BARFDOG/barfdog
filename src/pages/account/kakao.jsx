import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import axios from 'axios';
import { userType } from '/store/TYPE/userAuthType';
import { useDispatch } from 'react-redux';
import { userStateAction } from '/store/userState-slice';
import { snsProviderType } from '/store/TYPE/snsProviderType';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { FullScreenRunningDog } from '/src/components/atoms/FullScreenLoading';
import { authAction } from '/store/auth-slice';

export default function KAKAO_Auth({ data, err, token }) {
  // console.log('DATA: ', data, err);
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
      return (window.location.href = redirUrl);
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

      } else if (data.snsUserType === userType.MEMBER_WITH_SNS.NAVER) {

        alert ("네이버 간편로그인이 연동되어있습니다. 다시 로그인해주세요.");
        return (window.location.href = redirUrl);

      } else if (data.snsUserType === userType.MEMBER_WITH_SNS.KAKAO) {
        // CASE: SNS연동완료된 회원 => 로그인 처리
        const payload = {
          token,
          expiredDate: 10,
        };
        dispatch(authAction.kakaoLogin(payload));

      }
    })();
  }, [data, err]);

  return (
    <>
      <MetaTitle title="KaKao Login Auth" />
      <FullScreenRunningDog opacity={1} />
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { code } = query;

  let err = null;

  let snsUserType = null;
  let userInfo = null;
  let token = null;

  if (!code) {
    // 인가코드 없을 경우, Redir
    return {
      redirect: {
        destination: '/account/login',
      },
    };
  }

  try {
    const data = {
      code: code,
    };
    let res = await axios({
      url: '/api/login/kakao',
      method: 'post',
      data,
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

    console.log('Server RES: ', res);
    // console.log('Server RESPONSE DATA: ',res.data)
    // res = DUMMY_NEW_MEMBER_RESPONSE; ////////  ! TEST
    // res = DUMMY_MEMBER_RESPONSE; ////////  ! TEST


    if (res.status === 500) { // 서버응답이 없을 경우, Redir
      return {
        redirect: {
          permanent: false,
          destination: '/account/login',
        },
      };
    }

    if (res.data) {

      const resData = res.data;
      const resultCode = Number(resData.resultcode) || null;
      const resultMessage = resData.message || null;
      const internationalAreaCodeOfKorea = '+82';
      const transformedPhoneNumber =
        resData.kakao_account?.phone_number.indexOf(internationalAreaCodeOfKorea) >= 0
          ? resData.kakao_account?.phone_number
              .replace(internationalAreaCodeOfKorea, '0')
              .replace(' ', '')
          : resData.kakao_account?.phone_number;
      userInfo = {
        code: code, // kakao Api Access Token
        tokenValidDays: null, // ! 카카오톡에서 토큰 만료시간을 할당 => 바프독 서버에서 설정불가
        id: resData.id,
        gender: resData.kakao_account?.gender || null,
        email: resData.kakao_account?.email || null,
        mobile: transformedPhoneNumber || null,
        mobile_e164: resData.kakao_account?.phone_number || null,
        name: resData.kakao_account?.name || null,
        birthday: resData.kakao_account?.birthday || null,
        birthyear: resData.kakao_account?.birthyear || null,
      };
      if (resultCode === 251) {
        // 비회원
        snsUserType = userType.NON_MEMBER;
      } else if (resultCode === 252) {
        // 회원 & SNS연동 아직 안 한 CASE
        snsUserType = userType.MEMBER;
      } else if (resultCode === 253 || resultCode === 200) {
        // 기존 카카오 연동 계정 > 로그인 처리
        snsUserType = userType.MEMBER_WITH_SNS.KAKAO;
        token = res.headers.authorization;
      } else if (resultCode === 254) {
        // 이미 네이버로 연동되어있는 계정 => 연동 불가 처리
        snsUserType = userType.MEMBER_WITH_SNS.NAVER;
        token = null;
      }

      /*  error Code Validation 필요
          error code -101 카카오 연결 도중 실패한 경우
          error code -102 이미 카카오로 연결된 경우
          error code -103 존재하지 않는 계정
          error code -406 회읜 나이가 14세 미만인 경우
      * */

      if (
        resultCode === 24 ||
        resultCode === 28 ||
        resultCode === 101 ||
        resultCode === 403 ||
        resultCode === 404 ||
        resultCode === 500
      ) {
        err = resultMessage;
      }
    } else if (res.response.data?.error) {
      // console.log('ERROR REPONSE >  ', res.response)
      err = res.response.statusText;
    }
  } catch (err) {
    console.error('catch Error: ', err);
  }

  const DATA = {
    snsUserType,
    providerId: code,
    provider: snsProviderType.KAKAO,
    userInfo,
  };
  return { props: { data: DATA, err, token } };
}

/*
- response body에 resultcode, message 값 / 설명
  200 success / 간편로그인 성공 => 응답 header에 'Authorization' 존재함
  251 new member / 기존회원 존재하지않고 처음 방문한 사용자 → 네이버 api 회원 정보 이용해서 회원가입 페이지로 가서 추가 입력
  252 need to connect new sns / 기존회원 존재하나 sns 연동 되지 않음 → sns 연동 페이지로 이동
  253 has already been connected by kakao / 이미 카카오로 연동되어있는 계정 (카카오 로그인시 200 success 로그인 처리)
  254 has already been connected by naver / 이미 네이버로 연동되어있는 계정 (네이버 로그인시 200 success 로그인 처리)
  + 500 internal error / 내부 에러
- 기타 카카오 api 에러
  024 Authentication failed / 인증에 실패했습니다.
  028 Authentication header not exists / OAuth 인증 헤더(authorization header)가 없습니다.
  403 Forbidden / 호출 권한이 없습니다. API 요청 헤더에 클라이언트 ID와 Secret 값을 정확히 전송했는지 확인해보시길 바랍니다.
  404 Not Found / 검색 결과가 없습니다.
  500 Internal Server Error / 데이터베이스 오류입니다. 서버 내부 에러가 발생하였습니다. 포럼에 올려주시면 신속히 조치하겠습니다.
  error code -101 카카오 연결 도중 실패한 경우
  error code -102 이미 카카오로 연결된 경우
  error code -103 존재하지 않는 계정
  error code -406 회읜 나이가 14세 미만인 경우

*/



//
// const DUMMY_NEW_MEMBER_RESPONSE = {
//   // 신규 멤버일 경우
//   data: {
//     resultcode: '251',
//     message: 'new member',
//     id: 2439726893,
//     connected_at: '2022-09-22T06:53:57Z',
//     kakao_account: {
//       name_needs_agreement: false,
//       name: '홍길순',
//       has_email: true,
//       email_needs_agreement: false,
//       email: 'solsol1203@naver.com',
//       has_phone_number: true,
//       phone_number_needs_agreement: false,
//       phone_number: '+82 10-9851-7017',
//       has_birthyear: true,
//       birthyear_needs_agreement: false,
//       birthyear: '2008',
//       has_birthday: true,
//       birthday_needs_agreement: false,
//       birthday: '10-12',
//       birthday_type: 'SOLAR',
//       has_gender: true,
//       gender_needs_agreement: false,
//       gender: 'female',
//       _email_valid: false,
//       _email_verified: false,
//     },
//     accessToken: null,
//     tokenValidDays: 21599,
//     resultCode: 200,
//     _links: {
//       self: {
//         href: 'http://localhost:8080/api/login/kakao',
//       },
//       profile: {
//         href: '/docs/index.html#resources-login-kakao',
//       },
//     },
//   },
// };
//
// const DUMMY_MEMBER_RESPONSE = {
//   // 기존에 회원가입된 멤버일 경우
//   data: {
//     resultcode: '253',
//     message: 'member',
//     id: 2439726893,
//     connected_at: '2022-09-22T06:53:57Z',
//     kakao_account: {
//       name_needs_agreement: false,
//       name: '홍길동',
//       has_email: true,
//       email_needs_agreement: false,
//       email: 'solsol1203@naver.com',
//       has_phone_number: true,
//       phone_number_needs_agreement: false,
//       phone_number: '+82 10-9851-7017',
//       has_birthyear: true,
//       birthyear_needs_agreement: false,
//       birthyear: '1991',
//       has_birthday: true,
//       birthday_needs_agreement: false,
//       birthday: '09-08',
//       birthday_type: 'SOLAR',
//       has_gender: true,
//       gender_needs_agreement: false,
//       gender: 'female',
//       _email_valid: false,
//       _email_verified: false,
//     },
//     accessToken: null,
//     tokenValidDays: 21599,
//     resultCode: 200,
//     _links: {
//       self: {
//         href: 'http://localhost:8080/api/login/kakao',
//       },
//       profile: {
//         href: '/docs/index.html#resources-login-kakao',
//       },
//     },
//   },
// };
