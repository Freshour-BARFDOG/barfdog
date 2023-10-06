import axios from 'axios';
import { getCookie } from '@util/func/cookie';
import { cookieType } from '@store/TYPE/cookieType';

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL_PRODUCT
    : process.env.NEXT_PUBLIC_API_URL_DEV;

console.log('axios.defaults.baseURL: ',axios.defaults.baseURL);




// * axiosConfig > 유저 & ADMIN의 config이 동일하다 => 서버에서 토큰의 권한을 자체 검증하기 떄문에
// CLIENT에서 아래와 같이 처리할 필요가 없다
// 아래 코드 중에서 아무거나 골라써도 무방하다.

export default function axiosConfig(contType = 'application/json') {
  const accessToken = getCookie(cookieType.LOGIN_COOKIE);
  return {
    headers: {
      authorization: accessToken,
      'content-Type': contType,
    },
  };
}

export function axiosUserConfig(contType = 'application/json') {
  const accessToken = getCookie(cookieType.LOGIN_COOKIE);
  // console.log(accessToken)
  return {
    headers: {
      authorization: accessToken,
      'content-Type': contType,
    },
  };
}
