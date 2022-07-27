export const subscribePlanType = {
  FULL: {
    NAME:'FULL', // 서버에 전송할 이름
    numberOfPacksPerDay: 2,
    weeklyPaymentCycle: 2,
    totalNumberOfPacks: 28,
    discountPercent: 5
  },
  HALF: {
    NAME:'HALF',
    numberOfPacksPerDay: 1,
    weeklyPaymentCycle: 4,
    totalNumberOfPacks: 14,
    discountPercent: 2
  },
  TOPPING: {
    NAME:'TOPPING',
    numberOfPacksPerDay: 1,
    weeklyPaymentCycle: 4,
    totalNumberOfPacks: 10,
    discountPercent: 1
  },
}