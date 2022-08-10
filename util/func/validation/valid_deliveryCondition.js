import {orderStatus} from '/store/TYPE/orderStatusTYPE';

export const valid_deliveryCondition = (deliveryStatus) => {
  return (
    deliveryStatus === orderStatus.DELIVERY_START || deliveryStatus === orderStatus.DELIVERY_DONE
  );
};