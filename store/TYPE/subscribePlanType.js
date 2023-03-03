export const subscribePlanType = {
  FULL: {
    NAME: 'FULL', // 서버에 전송할 이름
    KOR:'풀 플랜',
    numberOfPacksPerDay: 2,
    weeklyPaymentCycle: 2,
    totalNumberOfPacks: 28,
    maxRecipeCount: 2,
  },
  HALF: {
    NAME:'HALF',
    KOR:'하프 플랜',
    numberOfPacksPerDay: 1,
    weeklyPaymentCycle: 4,
    totalNumberOfPacks: 28,
    maxRecipeCount: 1,
  },
  TOPPING: {
    NAME:'TOPPING',
    KOR:'토핑 플랜',
    numberOfPacksPerDay: 1,
    weeklyPaymentCycle: 4,
    totalNumberOfPacks: 20,
    maxRecipeCount: 1,
  },
}
