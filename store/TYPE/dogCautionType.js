
// 설문조사 > 기타 특이사항에 사용됨
export const dogCautionType = {
  
  FAKE_TYPE: '', // UI rendering 및 input value때문에, 반드시 ""빈값을 사용할것
  NONE: 'NONE', // 못 먹는 음식 > 기타('ETC') > 못 먹는 음식 입력 없는 상태
  // 값이 존재할 경우 해당 String
  KOR: {
    FAKE_TYPE: '있어요',
    NONE: '없어요'
  }
}