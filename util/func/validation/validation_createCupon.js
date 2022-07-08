import {
  valid_couponCode,
  valid_currency,
  valid_isEmpty,
} from './validationPackage';

export const validate = (obj) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'description':
        errors[key] = valid_isEmpty(val);
        break;
      case 'code':
        errors[key] = valid_couponCode(val); //  ! 형식에 맞게 validation추가 해줘야한다.
        break;
      case 'discountDegree':
        const unit = obj['discountType'];
        const options = {
          unit: unit,
          mode: 'strict',
        };
        const availableMaxDiscount = obj['availableMaxDiscount']
        errors[key] = valid_currency(val, options, availableMaxDiscount);
        break;
      case 'availableMaxDiscount':
        errors[key] = valid_currency(val, { mode: 'strict' });
        break;
      case 'availableMinPrice':
        errors[key] = valid_currency(val, { mode: 'strict' });
        break;
      case 'amount':
        errors[key] = valid_isEmpty(val);
        break;
    }
  }
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};

