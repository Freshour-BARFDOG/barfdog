import {useRouter,useLocation} from 'next/router';
import React, {useEffect} from 'react';
import axios from "axios";

const Auth = () => {
  const router = useRouter();
  
  const getNaverToken = () => {
    // console.log(router);
    // console.log(router.asPath);
    
    const token = router.asPath.split('=')[1].split('&')[0];
    // console.log(token);
    // 서버에 naver token 전송 /api/login/naver
    axios
    .post('/api/login/naver', {
      'accessToken':token
    }, {
      headers: {
        'content-Type': 'application/json',
      }
    })
    .then((res) => {
      console.log(res);
      // console.log(res.data);

      //251, new member / 기존회원 존재하지않고 처음 방문한 사용자 → 네이버 api 회원 정보 이용해서 회원가입 페이지로 가서 추가 입력
      if(res.data.resultcode==251){
        router.push('/account/signup');
      }
      // 252, need to connect new sns / 기존회원 존재하나 sns 연동 되지 않음 → sns 연동 페이지로 이동
      if(res.data.resultcode==252){
        router.push('/account/valid-sns');
      }
      // 이미 네이버, 카카오 연동되어있는 계정
      if(res.data.resultcode==253||res.data.resultcode==254) {
        router.push('/');
      }

    })
    .catch((err) => { 
      setAlertModalMessage(`ERROR\n\n서버와 통신할 수 없습니다.`);
      console.error('서버통신오류: ',err);
      // console.log(err.request)
      // console.log(err.response)
    });
    };
  
  
    useEffect(() => {
      getNaverToken();
    }, []);
      
  return (
    <div>
      <h1>naver login loading</h1>
    </div>
  );
};

export default Auth;