import {
  valid_isEmpty,
} from './validationPackage';

export const validate = (obj, fileObj) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'email':
        errors[key] = valid_isEmpty(val);
        break;
      case 'password':
        errors[key] = valid_isEmpty(val);
        break;
    }
  }
  
  
  // console.log('Valid Result (formValues) : ', errors);
  return errors;
};



