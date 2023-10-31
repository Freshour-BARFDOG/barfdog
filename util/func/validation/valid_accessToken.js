import {userType} from '/store/TYPE/userAuthType';
import {getData} from '/src/pages/api/reqData';

export const valid_accessToken = async (type = userType.ADMIN) => {
  // 임의의 admin api를 통하여, admin token의 유효성 체크
  
  let error = null;
  let status;
  try {
    const checkTokenAPiUrl = type === userType.ADMIN ? '/api/admin/setting' : '/api/members';
    const response = await getData( checkTokenAPiUrl, type );
    status = response.status;
    // // console.log(type, checkTokenAPiUrl, response)
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
        if ( response.data.reason === 'EXPIRED_TOKEN' ) {
          // 토큰 생사여부 체크 (SERVER 첫 번째 검증단계)
          error = 'EXPIRED_TOKEN';
        } else if ( response.data.reason === 'UNAUTHORIZED' ) {
          error = 'UNAUTHORIZED';
        }
        error = `인증 토큰이 만료되었습니다`;
        break;
      case 403:
        error = '해당 토큰으로는 접근할 수 없습니다.'; // 권한 체크 ( SERVER 토큰 이후 검증 단계)
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
    // console.log( err );
    console.error( 'TOKEN VALID > ERROR RESPONSE : ', err.response );
  }
  return {error, status};
};