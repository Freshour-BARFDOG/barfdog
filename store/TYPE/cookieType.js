export const cookieType = {
  LOGIN_COOKIE: 'LOGIN_COOKIE', // 로그인 시 만료일 n 일 // 페이지 접속 시, 로그인 상태를 확인하여, 토큰 만료시간 이전이라면  로그인상태를 복구
  AUTO_LOGIN_EXPIRED_PERIOD: {
    UNIT: 'date',
    VALUE:  10, // 지속일자 DAYS
  },
  
  AUTO_LOGIN_COOKIE: 'LOGIN_COOKIE', // 동일한 쿠키 사용한다. // expiredDate 차이로 구별한다.
  LOGIN_EXPIRED_PERIOD: {
    UNIT: 'hour',
    VALUE: 2, // REST API서버 기본 토큰 지속시간
    VALUE_FOR_RESTAPI: null, // token=> 기본 지속시간을 사용하려면, null값을 보낸다.
  },
  
  GOOGLE_ANALYTICS_TOKEN: 'GOOGLE_ANALYTICS_TOKEN', // 어드민 > 방문자수 조회에 필요한 토큰
}