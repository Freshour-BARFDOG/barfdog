import {valid_isEmpty} from "./validationPackage";

export function validate(obj) {
  let errors = {};
  const keys = Object.keys(obj);
  for (const key of keys) {
    const val = obj[key];
    switch (key) {
      default:
        errors[key] = valid_isEmptyInCustom(val);
    }
  }
  
  // console.log('Valid Result (formValues) : ', errors);
  return errors;
}




export const valid_isEmptyInCustom = (value) => {
  const error = (value === 0 || value) ? '' : '항목이 비어있습니다.';
  return error;
};

