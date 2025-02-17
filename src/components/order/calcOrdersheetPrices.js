import { IAMPORT_MIN_PAYMENT_PRICE } from '/store/TYPE/order/priceType';

export const calcOrdersheetPrices = (
  form,
  orderType = 'general',
  deliveryInfo = { deliveryFreeConditionPrice: null },
  hasAllianceDiscount = false,
) => {
  const userTotalReward = form.selfInfo?.reward; // 유저 적립금 총액
  let discountReward = Number(form.discountReward); // 적립금 할인
  let discountCoupon = 0; // 쿠폰 할인
  let deliveryPrice = Number(form.deliveryPrice); // 배송비
  const orderPrice = Number(form.orderPrice); // 상품금액
  const minPaymentPrice = IAMPORT_MIN_PAYMENT_PRICE; // 최소 결제 금액
  let overDiscountCoupon = 0; // 쿠폰의 초과할인금
  let discountGrade = Number(form.selfInfo?.discountGrade); // 등급 할인 ( ONLY 정기결제: 0 ~ 7%)

  const hasAllianceGeneralDiscount = orderType === 'general' && hasAllianceDiscount && form?.orderItemDtoList?.some(item => item.deliveryFree === true);
  const hasAllianceSubscribeDiscount = orderType !== 'general' && hasAllianceDiscount;

  if (
    isNaN(discountReward) ||
    isNaN(discountGrade) ||
    isNaN(orderPrice) ||
    isNaN(deliveryPrice)
  )
    return null;

  if (orderType === 'general') {
    discountCoupon = form.orderItemDtoList?.length
      ? form.orderItemDtoList
          .map((item) => item.discountAmount)
          .reduce((acc, cur) => acc + cur)
      : 0;
    discountGrade = 0; // 일반결제는 등급할인 없음

    const deliveryFreeCondition =
      form.bundle || // 묶음 배송일 경우
      orderPrice >= deliveryInfo.deliveryFreeConditionPrice || // 상품 총 주문금액이, 사이트 무료배송 조건 이상일 경우
      !form.orderItemDtoList.filter((item) => !item.deliveryFree).length; // 무료배송이 아닌 상품이 없을 경우
    deliveryPrice = deliveryFreeCondition ? 0 : deliveryPrice;
  } else if (orderType === 'subscribe') {
    discountCoupon = Number(form.discountCoupon);
    deliveryPrice = 0; // 정기결제는 항상 무료배송
  }

  // 기존 할인 총합 (쿠폰 + 적립금 + 등급 할인)
  const discountBaseTotal = discountCoupon + discountReward + discountGrade;

  // 정기결제 + 제휴 할인인 경우 추가 할인 (orderPrice - (기존 할인 총합 * 0.5))
  const discountRate = 0.5;
  const discountSubscribeAlliance = hasAllianceSubscribeDiscount
    ? Math.round(orderPrice - (discountBaseTotal * discountRate))
    : 0;

  console.log('discountSubscribeAlliance', discountSubscribeAlliance);

  // 전체 할인 총액 (기존 할인 + discountSubscribeAlliance)
  const discountTotal = discountBaseTotal + discountSubscribeAlliance;

  // 결제 금액 계산
  const calcedPaymentPrice = orderPrice + deliveryPrice - discountTotal;

  if (calcedPaymentPrice < minPaymentPrice) {
    overDiscountCoupon = minPaymentPrice - calcedPaymentPrice;
  }

  // 최종 결제 금액 설정 (최소 결제 금액 보장)
  const paymentPrice = Math.max(calcedPaymentPrice, minPaymentPrice);

  const availableMaxDiscount = paymentPrice - minPaymentPrice; // 결제금액
  const availableMaxReward = Math.min(
    availableMaxDiscount,
    userTotalReward - discountReward,
  );
  const availableMaxCoupon = availableMaxDiscount;

  return {
    discountReward,
    discountCoupon,
    discountGrade,
    discountTotal,
    paymentPrice,
    availableMaxDiscount: {
      reward: availableMaxReward,
      coupon: availableMaxCoupon,
    },
    overDiscount: overDiscountCoupon,
    deliveryPrice: hasAllianceGeneralDiscount ? 0 : deliveryPrice, // 일반결제 페이지에서만 사용
    discountSubscribeAlliance,
  };
};
