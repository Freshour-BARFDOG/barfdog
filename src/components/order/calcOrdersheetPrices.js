export const calcOrdersheetPrices = (form) => {
  
  const discountCoupon = form.orderItemDtoList?.length ? form.orderItemDtoList.map( item => item.discountAmount ).reduce( (acc, cur) => acc + cur ) : 0;
  const discountReward = form.discountReward;
  const calc = form.orderPrice - discountCoupon - discountReward;
  const paymentPrice = calc ? calc : 0;
  const reward = form.selfInfo?.reward;
  let availableMaxReward;
  
  if(reward > paymentPrice && paymentPrice >= 0){
    availableMaxReward = paymentPrice
  } else if (paymentPrice <= 0){
    availableMaxReward = 0;
  } else {
    availableMaxReward = reward
  }
  return {
    discountReward,
    discountCoupon,
    discountTotal: discountCoupon + discountReward,
    paymentPrice,
    availableMaxReward: availableMaxReward
  }
  
}