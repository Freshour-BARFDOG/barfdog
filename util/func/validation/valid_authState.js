import {userType} from '@store/TYPE/userAuthType';
import {valid_accessToken} from "/util/func/validation/valid_accessToken";

export const valid_authState = async (type) => {
  let valid;
  let error;
  const res = await valid_accessToken( type );
  const status = res.status;
  // console.log('RES:', res); //
  const availableToken = status === 200;
  const expiredToken = status === 401; // 추후 REFRESH TOKEN기능 개발 후 확인
  if ( availableToken ) {
    error = '';
  } else if ( expiredToken ) {
    error = '토큰이 만료되었습니다.';
  } else {
    error = '유효하지 않은 회원압니다.';
  }
  valid = !error;
  return {valid, status, error};
};