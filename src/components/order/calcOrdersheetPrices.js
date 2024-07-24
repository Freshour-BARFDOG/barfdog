import { subscriptionMonthType } from '../../../store/TYPE/subscriptionMonthType';
import { IAMPORT_MIN_PAYMENT_PRICE } from '/store/TYPE/order/priceType';

export const calcOrdersheetPrices = (
  form,
  orderType = 'general',
  deliveryInfo = { deliveryFreeConditionPrice: null },
  info,
) => {
  const getDeliveryCount = (type) => {
    if (type.VALUE === null) {
      return 1;
    } else if (
      info.subscribeDto.plan === 'FULL' ||
      info.subscribeDto.plan === 'TOPPING_FULL'
    ) {
      return type.fullDeliveryCount;
    } else if (
      info.subscribeDto.plan === 'HALF' ||
      info.subscribeDto.plan === 'TOPPING_HALF'
    ) {
      return type.halfDeliveryCount;
    } else return 1;
  };

  //! [추가] 구독개월수 할인금액 계산
  const getDiscount = (value) => {
    for (const key in subscriptionMonthType) {
      if (subscriptionMonthType[key].VALUE === value) {
        // 구독개월수 할인금액(discountSubscriptionMonth) = 1개원가(originPrice) * 배송횟수 * 개월수 할인율
        const discountPrice = Math.floor(
          info?.subscribeDto.originPrice *
            getDeliveryCount(subscriptionMonthType[key]) *
            (subscriptionMonthType[key].discount / 100),
        );
        return discountPrice;
      }
    }
    return null;
  };

  const userTotalReward = form.selfInfo?.reward; // 유저 적립금 총액
  let discountReward = Number(form.discountReward); // 적립금 할인
  let discountCoupon = 0; // 쿠폰 할인
  let deliveryPrice = Number(form.deliveryPrice); // 배송비
  const orderPrice = Number(form.orderPrice); // 상품금액
  const minPaymentPrice = IAMPORT_MIN_PAYMENT_PRICE; // 최소 결제 금액
  let overDiscountCoupon = 0; // 쿠폰의 초과할인금
  //! [리뉴얼] 3,6,12개월 패키지는 등급할인 중복적용 불가
  let discountGrade = form.subscriptionMonth
    ? 0
    : Number(form.selfInfo?.discountGrade); // 등급 할인 ( ONLY 정기결제: 0 ~ 7%)
  let discountSubscriptionMonth =
    form.subscriptionMonth === null ? 0 : getDiscount(form.subscriptionMonth); //! [구독개월수 할인]

  // console.log(discountReward, discountGrade, orderPrice);
  // console.log('discountSubscriptionMonth===>', discountSubscriptionMonth);
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
    discountSubscriptionMonth = 0; // 일반결제는 구독개월수 할인 없음

    const deliveryFreeCondition =
      form.bundle || // 묶음 배송일 경우
      orderPrice >= deliveryInfo.deliveryFreeConditionPrice || // 상품 총 주문금액이, 사이트 무료배송 조건 이상일 경우
      !form.orderItemDtoList.filter((item) => !item.deliveryFree).length; // 무료배송이 아닌 상품이 없을 경우
    deliveryPrice = deliveryFreeCondition ? 0 : deliveryPrice;
  } else if (orderType === 'subscribe') {
    discountCoupon = Number(form.discountCoupon);
    deliveryPrice = 0; // 정기결제는 항상 무료배송
  }

  const discountTotal =
    discountCoupon + discountReward + discountGrade + discountSubscriptionMonth;
  const calcedPaymentPrice = orderPrice + deliveryPrice - discountTotal;
  if (calcedPaymentPrice < minPaymentPrice) {
    overDiscountCoupon = minPaymentPrice - calcedPaymentPrice;
  }
  const paymentPrice = Math.max(calcedPaymentPrice, minPaymentPrice); // 23.02. 고객사 요청: 초과할인이 발생하더라도 결제 가능함.

  const availableMaxDiscount = paymentPrice - minPaymentPrice; // 결제금액
  const availableMaxReward = Math.min(
    availableMaxDiscount,
    userTotalReward - discountReward,
  );
  const availableMaxCoupon = availableMaxDiscount;

  // console.log(
  //   '---------------',
  //   '\n적립금할인: ',
  //   discountReward,
  //   '\n쿠폰할인: ',
  //   discountCoupon,
  //   '\n등급할인: ',
  //   discountGrade,
  //   '\n할인총합:',
  //   discountTotal,
  //   '\n배송비:',
  //   deliveryPrice,
  //   '\nORIGIN-결제금액: ',
  //   orderPrice,
  //   '\nCALCED-주문금액: ',
  //   calcedPaymentPrice,
  //   '\nFINAL-결제금액: ',
  //   paymentPrice,
  //   '\n쿠폰 초과할인금액:',
  //   overDiscountCoupon,
  //   '\n------ availableMaxDiscount: ',
  //   availableMaxDiscount,
  //   '\navailableMaxReward:',
  //   availableMaxReward,
  //   '\navailableMaxCoupon:',
  //   availableMaxCoupon,
  // );
  return {
    discountReward,
    discountCoupon,
    discountGrade,
    discountSubscriptionMonth,
    discountTotal,
    paymentPrice,
    availableMaxDiscount: {
      reward: availableMaxReward,
      coupon: availableMaxCoupon,
    },
    overDiscount: overDiscountCoupon,
    deliveryPrice: deliveryPrice, // 일반결제 페이지에서만 사용
  };
};
