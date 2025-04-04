import { valid_ReturnableAndExchangableItem } from './validation/valid_ReturnableAndExchangableItem';
import {orderStatus} from "/store/TYPE/orderStatusTYPE";
import transformDate, {transformToday} from "./transformDate";
import {getDiffDateNumber} from "./getDiffDate";


//
/* 교환반품가능조건
   1. 배송완료 / 배송완료 후, 7일 이내 (ex. 0101 ~ 0108)
   2. 카테고리 : 생식 제외
*/
export const filter_availableReturnAndExchangeItemList = (allItemList) =>{
  return allItemList.filter((item, i) => {
    ////// ! TEST TEST TEST TEST TEST 임시 추가 - 배송완료시점 TEST
    // CASE 1 // 일부만 교환가능 status
    // if ( i === 0 ) {
    //   item.deliveryDoneDate = '2022-08-02T09:56:10.014';
    // } else if ( i === 1 ) {
    //   item.deliveryDoneDate = '2022-08-08T09:56:10.014';
    // } else if ( i === 2 ) {
    //   item.deliveryDoneDate = '2022-08-10T09:56:10.014';
    // } else {
    //   item.deliveryDoneDate = new Date().toISOString();
    // }
    
    // CASE 2 // 모두 교환불가능 status
    // item.deliveryDoneDate = '2022-08-02T09:56:10.014';
    // item.category = TOPPING;
    
    // CASE 3 // 모두 교환가능 status
    // item.status = orderStatus.DELIVERY_DONE;
    // item.deliveryDoneDate = new Date().toISOString();
    ////// ! TEST TEST TEST TEST TEST 임시 추가 - 배송완료시점 TEST
    return valid_ReturnableAndExchangableItem(item.status, item.arrivalDate, item.category);
    
  });
}