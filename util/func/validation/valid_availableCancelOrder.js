import {orderStatus} from '/store/TYPE/orderStatusTYPE';

export const valid_availableCancelOrder = (status) => {
  let valid;
  const availableCancleStateList = [
    // orderStatus.BEFORE_PAYMENT, // 결제 전일 때 주문취소가.......... 필요한지 ??????? (아임포트에는 심지어 결제가 됐다)
    orderStatus.PAYMENT_DONE,
    orderStatus.PRUDUCING,
    orderStatus.DELIVERY_READY,
  ];
  valid = availableCancleStateList.indexOf( status ) >= 0;
  return valid;
};