import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import axios from 'axios';
import { userType } from '/store/TYPE/userAuthType';
import { useDispatch } from 'react-redux';
import { userStateAction } from '/store/userState-slice';
import { snsProviderType } from '/store/TYPE/snsProviderType';

export default function KAKAO_Auth({ data, err }) {
  // ! 현재 KAKAO API 개발되지 않음 => USERTYPE을 확인할 수 없음.
  // ! 현재 KAKAO API 개발되지 않음 => USERTYPE을 확인할 수 없음.
  // ! 현재 KAKAO API 개발되지 않음 => USERTYPE을 확인할 수 없음.
  // ! 현재 KAKAO API 개발되지 않음 => USERTYPE을 확인할 수 없음.
  // ! 현재 KAKAO API 개발되지 않음 => USERTYPE을 확인할 수 없음.
  console.log(data, err);
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
    // if (err) {
    //   const redirUrl = '/account/login';
    //   return alert(err+'\n로그인페이지로 redir예정');
    //   // return window.location.href = redirUrl;
    // }
    // !  TEST 후에 해제

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

  // const getToken = async () => {
  //   try {
  //     // console.log(router);
  //     // console.log(router.query);
  //     //카카오에서 전달해주는 인가코드, 서버에 전달해줘야함
  //     console.log(router.query.code);
  //     // history.replace('/');
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  //
  // useEffect(() => {
  //   getToken();
  // }, []);

  return (
    <div>
      <h1>KAKAO &gt; valid Login State</h1>
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

  const data = {
    code: code,
  };
  try {
    let res = await axios({
      url: '/api/login/kakao',
      method: 'post',
      headers: {
        'content-Type': 'application/json',
      },
      data,
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return err;
      });

    // res = DUMMY_NEW_MEMBER_RESPONSE; ////////  ! TEST
    // res = DUMMY_MEMBER_RESPONSE; ////////  ! TEST

    const resultCode = Number(res.data.resultcode) || null;
    const resultMessage = res.data.message;
    // console.log(res)
    // console.log('resultCode', resultCode);

    if (resultCode === 251) {
      snsUserType = userType.NON_MEMBER; // 비회원
    } else if (resultCode === 252) {
      snsUserType = userType.MEMBER; // 회원 & SNS연동 아직 안 한 CASE
      userInfo = res.data.response;
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
  } catch (err) {
    console.error(err);
  }

  const serverSideData = {
    snsUserType,
    providerId: code,
    provider: snsProviderType.KAKAO,
    userInfo,
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
