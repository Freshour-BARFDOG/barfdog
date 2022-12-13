import transformDate, { transformToday } from './transformDate';
import { getDiffDateNumber } from './getDiffDate';
import { orderStatus } from '../../store/TYPE/orderStatusTYPE';
import { general_itemType } from '../../store/TYPE/itemType';

export const valid_availableReturnAndExchangelOrder = (
  status,
  arrivalDate,
  category,
) => {
  let valid;
  // # Step 1 배송일자, 배송상태 확인
  // if (!arrivalDate || status !== orderStatus.DELIVERY_DONE) {
  //   return (valid = false);
  // }
  
  
  // const delvieryDoneDate = '2022-12-11'; // ! TEST
  const delvieryDoneDate = transformDate(arrivalDate);
  const today = transformToday();
  const diffDate = getDiffDateNumber(today, delvieryDoneDate);
  
  // 일반상품 신선식품: 교환/반품가능일 2일
  // 일반상품 비신선식품: 교환/반품가능 7일
  const nonFresheFood_ReturnAndExchangeTerm = 7;
  const freshFood_ReturnAndExchangeTerm = 2;
  

  if (availableReturnCategory.indexOf(category) >= 0) {
    valid = diffDate <= freshFood_ReturnAndExchangeTerm;
  } else {
    valid = diffDate <= nonFresheFood_ReturnAndExchangeTerm;
  }
  
  return valid;
};

const availableReturnCategory = [general_itemType.GOODS];