import { valid_isEmpty, valid_URL } from './validationPackage';

export const validate = (obj) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'fontColor':
        errors[key] = valid_isEmpty(val);
        break;
      case 'backgroundColor':
        errors[key] = valid_isEmpty(val);
        break;
      case 'pcLinkUrl':
        errors[key] = valid_URL(val);
        break;
      case 'mobileLinkUrl':
        errors[key] = valid_URL(val);
        break;
    }
  }
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};
