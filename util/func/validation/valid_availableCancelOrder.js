import {orderStatus} from '/store/TYPE/orderStatusTYPE';

export const valid_availableCancelOrder = (status) => {
  let valid;
  const availableCancleStateList = [
    orderStatus.BEFORE_PAYMENT,
    orderStatus.PAYMENT_DONE,
    orderStatus.PRUDUCING,
    orderStatus.DELIVERY_READY,
  ];
  valid = availableCancleStateList.indexOf( status ) >= 0;
  return valid;
};