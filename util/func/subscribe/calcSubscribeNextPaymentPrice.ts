type price ={
  originPrice: number,
  discountCoupon: number,
  discountGrade: number,
  overDiscount: number
}

export const calcSubscribeNextPaymentPrice = ({originPrice, discountCoupon, discountGrade, overDiscount}: price) => {
  // ! 서버에서 subscribe > nextPaymentPrice는 실제 다음구독의 결제금액이 아니라, 구독 상품의 원가이다.
  const ogPrice = Math.max(originPrice, 0);
  const dCoupon = discountCoupon || 0;
  const dGrade = discountGrade || 0;
  const overD = overDiscount || 0;
  return ogPrice - (dGrade + dCoupon) + overD;
};
