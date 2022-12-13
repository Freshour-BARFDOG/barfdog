import React from 'react';
import { valid_ReturnableAndExchangableItem } from './valid_ReturnableAndExchangableItem';
import { createUniqArray } from '../create_uniq_array';

export const validation_ReturnableAndExchangeableOrders = (allItems) => {
  let result = {
    valid: null,
    message: [],
  };

  if (!Array.isArray(allItems)) {
    result.message[0] = '배열이 아닙니다.';
  } else if (allItems.length === 0) {
    result.message[0] = '유효성 검사 대상이 없습니다.';
  }

  const itemValidationList = [...allItems, ...allItems].map((item) =>
    valid_ReturnableAndExchangableItem(
      item.status,
      item.arrivalDate,
      item.category,
    ),
  );

  // 유효하지 않은 상품이 1개이상일 경우 false
  result.valid = !itemValidationList.filter((v) => v.valid === false).length;
  // 에러메시지 리스트: 모두 유효할 경우, 빈배열
  const errorMessage = itemValidationList
    .filter((v) => v.message)
    .map((v) => v.message);
  result.message = createUniqArray(errorMessage);

  console.log('Valid Result (formValues) : ', result);
  return result;
};