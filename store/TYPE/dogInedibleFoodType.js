// 세부 리스트
// : ADMIN > createRecipePage 생성한 Recipe Ingredient에서 동적으로 생성됨


export const dogInedibleFoodType = {
  FAKE_TYPE: '', // UI를 만들기 위한 FAKE TYPE
  NONE: 'NONE', // 못 먹는 음식 [없으면 'NONE', 기타일 경우 'ETC']
  ETC: 'ETC',
  KOR: {
    FAKE_TYPE: '있어요',
    NONE: '없어요',
    ETC: '기타',
  }
}