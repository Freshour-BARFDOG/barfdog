export const calcOrdersheetPrices = (form, orderType='general') => {
  
  let discountCoupon = 0;
  let discountReward = 0;
  let discountGrade = 0;
  if(orderType === 'general'){
    discountCoupon = form.orderItemDtoList?.length ? form.orderItemDtoList.map( item => item.discountAmount ).reduce( (acc, cur) => acc + cur ) : 0;
    discountReward = Number(form.discountReward);
  } else if ( orderType === 'subscribe') {
    discountCoupon = Number(form.discountCoupon);
    discountReward = Number(form.discountReward);
    discountGrade = Number(form.selfInfo?.discountGrade);
  }
  
  
  const calc = Number(form.orderPrice) - discountCoupon - discountReward - discountGrade + form.deliveryPrice;
  const paymentPrice = calc ? calc : 0;
  const reward = form.selfInfo?.reward;
  let availableMaxReward;
  if(reward > paymentPrice && paymentPrice >= 0){
    availableMaxReward = paymentPrice
  } else if (paymentPrice <= 0){
    availableMaxReward = 0;
  } else {
    availableMaxReward = reward;
  }
  
  const discountTotal = discountCoupon + discountReward + discountGrade;

  // console.log('쿠폰할인 ',discountCoupon, '할인총합', discountTotal, 'paymentPrice: ', paymentPrice)
  
  return {
    discountReward,
    discountCoupon,
    discountGrade,
    discountTotal,
    paymentPrice,
    availableMaxReward: availableMaxReward
  }
  
}