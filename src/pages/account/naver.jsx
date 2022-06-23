import {useRouter} from 'next/router';
import React, {useEffect} from 'react';

const Auth = () => {
  const router = useRouter();

  const getToken = async () => {
    try {
      console.log(router);
      console.log(router.query);

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
      <h1>naver login success</h1>
    </div>
  );
};

export default Auth;