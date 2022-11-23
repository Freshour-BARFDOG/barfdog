import { valid_isEmpty, valid_maxLength, valid_minLength} from "./validationPackage";


export const validate = (obj, option) => {
  let errors = {};
  const keys = Object.keys(obj);
  
  for (const key of keys) {
    const val = obj[key];
    
    switch (key) {
      case 'title':
        errors[key] = valid_isEmpty(val);
        break;
      case 'contents':
        const maxLength = option[key].maxLength;
        errors[key] = valid_minLength(val, 10) || valid_maxLength(val, maxLength);
        break;
    }
  }
  
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};
