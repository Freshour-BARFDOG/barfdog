import transformDate, {transformToday} from './transformDate';
import {getDiffDateNumber} from './getDiffDate';
import {orderStatus} from '../../store/TYPE/orderStatusTYPE';

export const valid_availableReturnAndExchangelOrder = (status, deliveryDoneDate) => {
  let valid;
  const delvieryDoneDate = transformDate( deliveryDoneDate );
  const today = transformToday();
  const diffDate = getDiffDateNumber( today, delvieryDoneDate );
  const availableReturnAndExchangeTerm = 7;
  valid = status === orderStatus.DELIVERY_DONE && diffDate <= availableReturnAndExchangeTerm;
  return valid;
};