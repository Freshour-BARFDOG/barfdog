export const userType = {
  NON_MEMBER:'NON_MEMBER',
  MEMBER:'MEMBER',
  SUBSCRIBER:'SUBSCRIBER',
  ADMIN:'ADMIN',
  MEMBER_WITH_SNS:{
    KAKAO: 'MEMBER_WITH_KAKAO',
    NAVER: 'MEMBER_WITH_NAVER'
  },
  KOR: {
    NON_MEMBER:'비회원',
    MEMBER:'회원',
    SUBSCRIBER:'구독',
    ADMIN:'관리자',
    MEMBER_WITH_SNS:{
      KAKAO: '카카오 간편로그인 연동회원',
      NAVER: '네이버 간편로그인 연동회원'
    },
  }
}