export const calcOrdersheetPrices = (form, orderType='general') => {
  
  let discountCoupon;
  let discountReward;
  if(orderType === 'general'){
    discountCoupon = form.orderItemDtoList?.length ? form.orderItemDtoList.map( item => item.discountAmount ).reduce( (acc, cur) => acc + cur ) : 0;
    discountReward = Number(form.discountReward);
  } else if ( orderType === 'subscribe') {
    discountCoupon = Number(form.discountCoupon);
    discountReward = Number(form.discountReward);
  }
  
  const calc = Number(form.orderPrice) - discountCoupon - discountReward;
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
  console.log(paymentPrice)
  console.log(paymentPrice, discountCoupon, discountReward)
  return {
    discountReward,
    discountCoupon,
    discountTotal: discountCoupon + discountReward,
    paymentPrice,
    availableMaxReward: availableMaxReward
  }
  
}