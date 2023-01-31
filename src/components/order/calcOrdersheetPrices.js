export const calcOrdersheetPrices = (form, orderType='general') => {
  
  let discountCoupon = 0;
  let discountReward = 0;
  let discountGrade = 0;
  if(orderType === 'general'){
    discountCoupon = form.orderItemDtoList?.length ? form.orderItemDtoList.map( item => item.discountAmount ).reduce( (acc, cur) => acc + cur ) : 0;
    discountReward = Number(form.discountReward);
    // discountGrade = Number(form.selfInfo?.discountGrade); // 일반결제는 등급할인 없음
  } else if ( orderType === 'subscribe') {
    discountCoupon = Number(form.discountCoupon);
    discountReward = Number(form.discountReward);
    discountGrade = Number(form.selfInfo?.discountGrade);
  }
  
  
  const calc = Number(form.orderPrice) - discountCoupon - discountReward - discountGrade + form.deliveryPrice;
  const paymentPrice = calc ? calc : 0;

  const reward = form.selfInfo?.reward;
  let availableMaxReward;
  const minimumPaymentPrice = 100; // 아임포트 최소 결제금액 100원.
  if(paymentPrice <= minimumPaymentPrice){
    availableMaxReward = 0;
  } else if (reward >= paymentPrice - minimumPaymentPrice)  {
    availableMaxReward = paymentPrice - minimumPaymentPrice;
  } else {
    availableMaxReward = reward;
  }
  
  const discountTotal = discountCoupon + discountReward + discountGrade;
  // console.log('쿠폰할인 ',discountCoupon,'적립금할인',discountReward, '등급할인',discountGrade,  '할인총합', discountTotal, '결제금액: ', paymentPrice)
  
  return {
    discountReward,
    discountCoupon,
    discountGrade,
    discountTotal,
    paymentPrice,
    availableMaxReward
  }
  
}
