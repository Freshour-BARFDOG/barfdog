import {
  valid_email,
  valid_isEmpty,
  valid_password,
  valid_phoneNumber,
} from './validationPackage';

export const validate = (obj, formErrors) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'email':
        errors[key] = valid_isEmpty(val) || valid_email(val);
        break;
      case 'password':
        errors[key] = valid_isEmpty(val);
        break;
      case 'phoneNumber':
        errors[key] = valid_isEmpty(val) || valid_phoneNumber(val);
        break;
      case 'address':
        const addrObj = val;
        for (const key in addrObj) {
          const val = addrObj[key];
          if(key === 'detailAddress' || key === 'street'){
            errors[key] = valid_isEmpty(val);
          }
        }
        break;
      case 'birthday':
        errors[key] = valid_isEmpty(val);
        break;
      default:
        break;
    }
  }
  errors.isValidPhoneNumber = formErrors.isValidPhoneNumber;

  // console.log('Valid Result (formValues) : ', errors);
  return errors;
};
