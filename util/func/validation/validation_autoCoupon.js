import {valid_isEmpty, valid_isEmptyObject} from "./validationPackage";

export function validate(arr) {
  let errors = [];
  
  arr.forEach((itemObj)=>{
    const innerError = {}
    for (const key in itemObj) {
      const val = itemObj[key];
      if (key === 'id') {
        innerError[key] = val; // client에서 에러메시지 띄우기 위함
      } else {
        innerError[key] = valid_isEmptyInCustom(val);
        
      }
    }
    errors.push(innerError);
  })
  console.log('Valid Result (formValues) : ', errors);
  return errors;
}



export const valid_isEmptyInCustom = (value) => {
  let error='';
  
  if(typeof value !== 'number') value = Number(value);
  
  error = value < 0 ? '적절하지 않은 값입니다.' : '';
  
  return error;
};

