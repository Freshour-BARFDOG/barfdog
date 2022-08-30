import { useRouter, useLocation } from 'next/router';
import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userType } from '/store/TYPE/userAuthType';
import { snsProviderType } from '/store/TYPE/snsProviderType';
import {userStateAction} from "/store/userState-slice";

export default function NAVER_Auth({ data, err}) {
  console.log(data, err)
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
    if (err) {
      const redirUrl = '/account/login';
      return alert(err+'\n로그인페이지로 redir예정');
      // return window.location.href = redirUrl; // !  PRODUCT CODE
    }
    
    
    // CASE : SUCCESS SNS LOGIN
    if (data.snsUserType === userType.NON_MEMBER) {
      // alert('REDUX에 정보를 담아서, 회원가입페이지로 이동');
      // console.log(userInfo)
      dispatch(userStateAction.setSnsInfo({ data: userSnsInfo }));
      router.push('/account/signup');
    } else if (data.snsUserType === userType.MEMBER) {
      alert('sns 연동페이지로 이동');
      dispatch(userStateAction.setSnsInfo({ data: userSnsInfo }));
      router.push('/account/valid-sns');
    } else if (
      data.snsUserType === userType.MEMBER_WITH_SNS.KAKAO ||
      data.snsUserType === userType.MEMBER_WITH_SNS.NAVER
    ) {
      alert('이미 SNS연동완료된 회원입니다 => 로그인처리');
    }
  }, [data, err]);
  // const getNaverToken = () => {
  //   // console.log(router);
  //   // console.log(router.asPath);
  //
  //   const token = router.asPath.split('=')[1].split('&')[0];
  //   // console.log(token);
  //   // 서버에 naver token 전송 /api/login/naver
  //   axios
  //     .post(
  //       '/api/login/naver',
  //       {
  //         accessToken: token,
  //       },
  //       {
  //         headers: {
  //           'content-Type': 'application/json',
  //         },
  //       },
  //     )
  //     .then((res) => {
  //       console.log(res);
  //       // console.log(res.data);
  //
  //       //251, new member / 기존회원 존재하지않고 처음 방문한 사용자 → 네이버 api 회원 정보 이용해서 회원가입 페이지로 가서 추가 입력
  //       if (res.data.resultcode === 251) {
  //         router.push('/account/signup');
  //       }
  //       // 252, need to connect new sns / 기존회원 존재하나 sns 연동 되지 않음 → sns 연동 페이지로 이동
  //       if (res.data.resultcode === 252) {
  //         router.push('/account/valid-sns');
  //       }
  //       // 이미 네이버, 카카오 연동되어있는 계정 => 로그인 처리
  //       if (res.data.resultcode === 253 || res.data.resultcode === 254) {
  //         router.push('/');
  //       }
  //     })
  //     .catch((err) => {
  //       alert(`ERROR\n\n서버와 통신할 수 없습니다.`);
  //       console.error('서버통신오류: ', err);
  //       // console.log(err.request)
  //       // console.log(err.response)
  //     });
  // };
  //
  // useEffect(() => {
  //   getNaverToken();
  // }, []);

  return (
    <div>
      <h1>NAVER login &gt; valid Login State...</h1>
    </div>
  );
}

const DUMMY_NEW_MEMBER_RESPONSE = {
  // 신규 멤버일 경우
  data: {
    resultcode: '251',
    message: 'new member',
    response: {
      id: 'p4N4jAY5Q0qszLDW8Wx2W30K3eKkRUlHEVivAHgR0XQ222', // SNS 고유 식별 ID
      gender: 'F',
      email: 'develope07@binter.co.kr',
      mobile: '01056781234',
      mobile_e164: '+821056781234',
      name: '관리자계정',
      birthday: '12-01',
      birthyear: '1999',
    },
  },
};

const DUMMY_MEMBER_RESPONSE = {
  // 기존에 회원가입된 멤버일 경우
  data: {
    resultcode: '252',
    message: 'need to connect new sns',
    response: {
      id: 'p4N4jAY5Q0qszLDW8Wx2W30K3eKkRUlHEVivAHgR0XQ', // SNS 고유 식별 ID
      gender: 'F',
      email: 'develope07@binter.co.kr',
      mobile: '01056781234',
      mobile_e164: '+821056781234',
      name: '관리자계정',
      birthday: '12-01',
      birthyear: '1999',
    },
  },
};

export async function getServerSideProps({ query }) {
  const { code } = query;
 
  let err = null;

  let snsUserType = null;
  let userInfo = null;
  let token = null;

  // let token = await axios.post(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET}&code=${code}`,
  try{
    let tokenData = await axios.post(`https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=V3rQRVaRHmNC2v_9RF76&client_secret=ItgUL9cVR4&code=${code}`,
    {
    },
    {
      headers: {
        'content-Type': 'application/json',
      },
    }
    );
    console.log(tokenData);
    token = tokenData.data.access_token;
  }catch(e){
    console.log(e);
  }
  
  // console.log('code::::: ',code)
  const body = {
    accessToken: token, // Naver Api Access Token
    tokenValidDays: null, // null일경우 2시간 유효 ( 회원검증을 위해서 , 최소한의 시간만 로그인 State을 유지시킴)
  };

  try {

    let res = await axios
      .post(
        '/api/login/naver',
        body,
        {
          headers: {
            'content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });

    console.log('BARFDOG API SERVER res::::: ',res);
    // res = DUMMY_NEW_MEMBER_RESPONSE; ////////  ! TEST
    // res = DUMMY_MEMBER_RESPONSE; ////////  ! TEST

    if(res.data){
      const resultCode = Number(res.data.resultcode) || null;
      const resultMessage = res.data.message;

      if (resultCode === 251) {
        snsUserType = userType.NON_MEMBER; // 비회원
        const serverRes = res.data.response;
        userInfo = {
          accessToken: body.accessToken, // Naver Api Access Token
          tokenValidDays: body.tokenValidDays, // 토큰 지속시간
          id: serverRes.id,
          gender: serverRes.gender,
          email: serverRes.email,
          mobile: serverRes.mobile,
          mobile_e164: serverRes.mobile_e164,
          name: serverRes.name,
          birthday: serverRes.birthday,
          birthyear: serverRes.birthyear,
        };
        console.log('USERINFO : ', userInfo)
      } else if (resultCode === 252) {
        snsUserType = userType.MEMBER; // 회원 & SNS연동 아직 안 한 CASE
        //res.data.response
        const serverRes = res.data.response;
        userInfo = {
          accessToken: body.accessToken, // Naver Api Access Token
          tokenValidDays: body.tokenValidDays, // 토큰 지속시간
          id: serverRes.id,
          gender: serverRes.gender,
          email: serverRes.email,
          mobile: serverRes.mobile,
          mobile_e164: serverRes.mobile_e164,
          name: serverRes.name,
          birthday: serverRes.birthday,
          birthyear: serverRes.birthyear,
        };
        console.log('USERINFO : ', userInfo)
      } else if (resultCode === 253) {
        snsUserType = userType.MEMBER_WITH_SNS.KAKAO; // 이미 카카오로 연동되어있는 계정
        // 로그인 처리시킴
      } else if (resultCode === 254) {
        snsUserType = userType.MEMBER_WITH_SNS.NAVER; // 이미 네이버로 연동되어있는 계정
      } else if (resultCode === 200) {
        // 이미 연동되어있는 회원 => 메인페이지로 이동
      }
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
      err = 'Failed to get Server Response\n서버 응답값이 없습니다.'
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
  return { props: { data: serverSideData, err } };
}

/*
- response body에 resultcode, message 값 / 설명
  251, new member / 기존회원 존재하지않고 처음 방문한 사용자 → 네이버 api 회원 정보 이용해서 회원가입 페이지로 가서 추가 입력
  252, need to connect new sns / 기존회원 존재하나 sns 연동 되지 않음 → sns 연동 페이지로 이동
  253, has already been connected by kakao / 이미 카카오로 연동되어있는 계정 (카카오 로그인시 200 success 로그인 처리)
  254, has already been connected by naver / 이미 네이버로 연동되어있는 계정 (네이버 로그인시 200 success 로그인 처리)
+ 200, success / 간편로그인 성공 - 응답 header에 'Authorization' 존재함
+ 500, internal error / 내부 에러
- 기타 네이버 api 에러
  024, Authentication failed / 인증에 실패했습니다.
  028, Authentication header not exists / OAuth 인증 헤더(authorization header)가 없습니다.
  403, Forbidden / 호출 권한이 없습니다. API 요청 헤더에 클라이언트 ID와 Secret 값을 정확히 전송했는지 확인해보시길 바랍니다.
  404, Not Found / 검색 결과가 없습니다. -
  500, Internal Server Error / 데이터베이스 오류입니다. 서버 내부 에러가 발생하였습니다. 포럼에 올려주시면 신속히 조치하겠습니다.
*/
