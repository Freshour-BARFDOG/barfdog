export const kakaoGender = function (gender) {
  // naver 성별
  // - F: 여성
  // - M: 남성
  // - U: 확인불가
  switch (gender) {
    case 'female':
      return 'FEMALE';
    case 'male':
      return 'MALE';
    case 'U':
    default:
      return 'NONE';
  }
}