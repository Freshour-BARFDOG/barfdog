import {valid_isEmpty, valid_isEmptyCurrency, valid_isEmptyArray, valid_currency} from './validationPackage';

export const validate = (obj) => {
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

      case 'eventImageRequestDtoList':
        errors[key] = valid_isEmptyArray(val);
        break;
    }
  }
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};

