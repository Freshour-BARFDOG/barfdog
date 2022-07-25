export const cookieType = {
  LOGIN_COOKIE: 'LOGIN_COOKIE', // 로그인 시 만료일 n 일 // 페이지 접속 시, 로그인 상태를 확인하여, 토큰 만료시간 이전이라면  로그인상태를 복구 시킨다.
  AUTO_LOGIN_COOKIE: 'AUTO_LOGIN_COOKIE', // AUTO LOGIN 여부를 COOKIE를 통해 확인, => 개발자 테스트 모드 외에는 필요없을 가능성이 높음.
  AUTO_LOGIN_PERIOD: 14,  // (client 에서 로그인 시, Server에 만료일값을 전달할 수 있다)
}