import {
  valid_isEmpty,valid_isEmptyArray
} from './validationPackage';

export const validate = (obj) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'title':
        errors[key] = valid_isEmpty(val);
        break;
      case 'thumbnailId':
        errors[key] = valid_isEmpty(val) ;
        break;
      case 'eventImageRequestDtoList':
        errors[key] = valid_isEmptyArray(val)
        break;
    }
  }
  // console.log('Valid Result (formValues) : ', errors);
  return errors;
};
