import transformDate, {transformToday} from './transformDate';
import {getDiffDateNumber} from './getDiffDate';
import {orderStatus} from '../../store/TYPE/orderStatusTYPE';

export const valid_availableReturnAndExchangelOrder = (status, arrivalDate) => {
  let valid;
  if(!arrivalDate || !status){
    return false;
  }
  const delvieryDoneDate = transformDate( arrivalDate );
  const today = transformToday();
  const diffDate = getDiffDateNumber( today, delvieryDoneDate );
  const availableReturnAndExchangeTerm = 7;
  valid = status === orderStatus.DELIVERY_DONE && diffDate <= availableReturnAndExchangeTerm;
  return valid;
};