import {valid_isEmpty} from "./validationPackage";
import {valid_email} from "./validationPackage";



export const validate = (obj) => {
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
      default:
        break;
    }
  }

  console.log('Valid Result (formValues) : ', errors);
  return errors;
};




