import {IAMPORT_MIN_PAYMENT_PRICE} from "/store/TYPE/order/priceType";

export const calcOrdersheetPrices = (form, orderType='general') => {
  
  const reward = form.selfInfo?.reward; // 유저 적립금 총액
  let discountReward = Number(form.discountReward); // 적립금 할인
  let discountCoupon = 0; // 쿠폰 할인
  let discountGrade = Number(form.selfInfo?.discountGrade); // 등급 할인 ( ONLY 정기결제: 0 ~ 7%)
  let deliveryPrice = Number(form.deliveryPrice); // 배송비
  const orderPrice = Number( form.orderPrice ); // 상품금액
  const minPaymentPrice = IAMPORT_MIN_PAYMENT_PRICE; // 최소 결제 금액
  let overDiscountCoupon = 0; // 쿠폰의 초과할인금
  
  // console.log(discountReward, discountGrade, orderPrice);
  if(isNaN(discountReward) || isNaN(discountGrade) || isNaN(orderPrice)) return null;
  
  if(orderType === 'general'){
    discountCoupon = form.orderItemDtoList?.length ? form.orderItemDtoList.map( item => item.discountAmount ).reduce( (acc, cur) => acc + cur ) : 0;
    discountGrade = 0; // 일반결제는 등급할인 없음
  } else if ( orderType === 'subscribe') {
    discountCoupon = Number(form.discountCoupon);
    deliveryPrice = 0; // 정기결제는 항상 무료배송
  }
  
  
  const discountTotal = discountCoupon + discountReward + discountGrade;
  const calcedPaymentPrice = orderPrice + deliveryPrice - discountTotal ;
  if ( calcedPaymentPrice < minPaymentPrice ) {
    overDiscountCoupon = minPaymentPrice - calcedPaymentPrice;
  }
  
  
  
  const paymentPrice = calcedPaymentPrice > minPaymentPrice ? calcedPaymentPrice : minPaymentPrice; // 23.02. 고객사 요청: 초과할인이 발생하더라도 결제 가능함.
  const availableMaxDiscount = calcAvailableMaxReward(calcedPaymentPrice, minPaymentPrice, reward);
  // console.log("---------------",'\n적립금할인: ',discountReward, '\n쿠폰할인: ',discountCoupon, '\n등급할인: ',discountGrade, '\n할인총합:', discountTotal, '\n배송비:',deliveryPrice, "\nORIGIN-결제금액: ",orderPrice, "\nCALCED-주문금액: ",calcedPaymentPrice,  '\nFINAL-결제금액: ', paymentPrice, "\n쿠폰 초과할인금액:",overDiscountCoupon,);
  
  return {
    discountReward,
    discountCoupon,
    discountGrade,
    discountTotal,
    paymentPrice,
    availableMaxDiscount: availableMaxDiscount,
    overDiscountCoupon
  }
  
}


const calcAvailableMaxReward = (calcedPaymentPrice, minPaymentPrice, reward) => {
  let result;
  
  if(calcedPaymentPrice <= minPaymentPrice){
    result = calcedPaymentPrice - minPaymentPrice; // 변경: 적립금 input을 초기화시키기 위해, 음수까지 표현
  } else if (reward >= calcedPaymentPrice - minPaymentPrice)  {
    result = calcedPaymentPrice - minPaymentPrice;
  } else {
    result = reward;
  }
  
  return result;
  
};
