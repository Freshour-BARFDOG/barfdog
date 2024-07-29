// 고민과 추천 레시피 ID를 매핑한 객체
export const concernsRecipeMap = {
  관절: [7, 9],
  '피부·모질': [8, 11],
  소화력부족: [5, 9],
  빈혈: [6, 12],
  피로회복: [7, 11],
  체중조절: [8, 12],
  '음수량 부족': [5, 9],
};

// inedibleFood에 따른 레시피 제외 조건
export const inedibleFoodRecipeMap = {
  닭: [5, 9],
  칠면조: [5, 6, 10],
  소: [6, 8, 12],
  오리: [7],
  양: [7, 8, 11],
};
