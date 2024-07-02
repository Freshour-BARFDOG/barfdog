import {
  valid_arrayErrorCount,
  valid_currency,
  valid_isEmpty,
  valid_isEmptyArray,
  valid_isEmptyCurrency,
  valid_isNumberEmpty,
} from './validationPackage';

export const validate = (obj, selectedPriceOption) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'itemType':
        errors[key] = valid_isEmpty(val);
        break;
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'description':
        errors[key] = valid_isEmpty(val);
        break;
      case 'originalPrice':
        errors[key] = valid_isEmptyCurrency(val);
        break;
      case 'salePrice':
        errors[key] = valid_currency(val);
        break;
      case 'remaining':
        const inStock = obj['inStock'];
        errors[key] = (inStock && valid_isEmpty(val)) || ''; // 에러조건: (재고존재 && 재고수량 0개)
        break;
      case 'itemOptionSaveDtoList':
        const optionsArr = val;
        const errorCount = valid_arrayErrorCount(optionsArr);
        errors[key] =
          errorCount > 0
            ? `${errorCount}개의 옵션리스트 내에 적절하지 않은 항목이 있습니다.! `
            : '';
        break;
      case 'itemImageOrderDtoList': // 썸네일
        errors[key] = valid_isEmptyArray(val);
        break;
      case 'contents':
        errors[key] = valid_isEmpty(val);
        break;
      case 'packageType':
      case 'unit':
        if (
          selectedPriceOption === 'defaultPrice' ||
          selectedPriceOption === 'etcPrice'
        ) {
          errors[key] = valid_isEmpty(val);
        }
        break;
      case 'pricePerUnit':
      case 'itemCount':
        if (
          selectedPriceOption === 'defaultPrice' ||
          selectedPriceOption === 'etcPrice'
        ) {
          errors[key] = valid_isNumberEmpty(val);
        }
        break;
    }
  }
  // console.log('Valid Result (formValues) : ', errors);
  return errors;
};
