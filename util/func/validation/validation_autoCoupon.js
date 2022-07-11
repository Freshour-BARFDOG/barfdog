import {valid_isEmpty, valid_isEmptyObject} from "./validationPackage";

export function validate(arr) {
  let errors = [];
  
  arr.forEach((itemObj)=>{
    const innerError = {}
    for (const key in itemObj) {
      const val = itemObj[key];
      innerError[key] = valid_isEmptyInCustom(val);
    }
    errors.push(innerError);
  })
  console.log('Valid Result (formValues) : ', errors);
  return errors;
}



export const valid_isEmptyInCustom = (value) => {
  const error = (value !== '0' && value !== 0 && value) ? '' : '항목이 비어있습니다.';
  return error;
};

