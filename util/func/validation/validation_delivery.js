import {
  valid_confirmPassword,
  valid_email,
  valid_isEmpty,
  valid_password,
  valid_phoneNumber,
} from './validationPackage';

export const validate = async (obj) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'deliveryName':
        errors[key] = valid_isEmpty(val);
        break;
      case 'recipientName':
        errors[key] = valid_isEmpty(val);
        break;
      case 'city':
        errors[key] = valid_isEmpty(val);
        break;
      case 'street':
        errors[key] = valid_isEmpty(val);
        break;
      case 'detailAddress':
        errors[key] = valid_isEmpty(val);
        break;
      case 'zipcode':
        errors[key] = valid_isEmpty(val);
        break;
      case 'phoneNumber':
        errors[key] = valid_isEmpty(val) || valid_phoneNumber(val);
        break;
    }
  }

  return errors;
};
