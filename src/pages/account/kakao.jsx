import {useRouter} from 'next/router';
import React from 'react';

const Auth = () => {
  const router = useRouter();

  const getToken = async () => { 
    try {
      console.log(router);
      console.log(router.query);
      //카카오에서 전달해주는 인가코드, 서버에 전달해줘야함
      console.log(router.query.code);
      history.replace("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <div> 
      <h1>kakao login success</h1>
    </div>
  );
};

export default Auth;