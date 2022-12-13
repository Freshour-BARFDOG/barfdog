import transformDate, { transformToday } from '../transformDate';
import { getDiffDateNumber } from '../getDiffDate';
import { orderStatus } from '../../../store/TYPE/orderStatusTYPE';
import { general_itemType } from '../../../store/TYPE/itemType';

const Non_ReturnableAndExchangableItemCategory = [general_itemType.RAW, general_itemType.TOPPING]
/*Categories that cannot be returned or exchanged*/
const isReturnableOrExchangableItem = (category) => Non_ReturnableAndExchangableItemCategory.indexOf(category) < 0;

export const valid_ReturnableAndExchangableItem = (
  status,
  arrivalDate,
  category,
) => {
  let result = {
    valid: null,
    message: null,
  };

  /* # Step 1. 신선식품 포함여부 확인*/
  if (isReturnableOrExchangableItem(category)) {
    // result.valid = false;
    result.message = '신선식품이 포함된 주문은 교환/반품할 수 없습니다.';
    return result;
  }

  /* # Step 2. 배송상태 확인 */
  if (!arrivalDate || status !== orderStatus.DELIVERY_DONE) {
    // result.valid = false;
    result.message = '배송완료되지 않았습니다.';

    return result;
  }

  /* # Step 3. 반품/교환가능한 시점 계산 (기준: 배송완료 후 n일 이내) */
  
  const ReturnableOrExchangableTerm = 7; // 일반상품 비신선식품: 교환/반품가능 7일
  const NON_ReturnableOrExchangableTerm = 2; // 일반상품 신선식품: 교환/반품가능일 2일
  
  const delvieryDoneDate = transformDate(arrivalDate);
  const today = transformToday();
  const diffDate = getDiffDateNumber(today, delvieryDoneDate);

  if (isReturnableOrExchangableItem(category)) {
    result.valid = diffDate <= ReturnableOrExchangableTerm;
  } else {
    result.valid = diffDate <= NON_ReturnableOrExchangableTerm;
  }

  return result;
};