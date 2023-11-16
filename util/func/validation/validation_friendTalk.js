import {valid_isEmpty} from "./validationPackage";

export const validateExposedAllTarget = (obj) => {
  let errors = {};
  const keys = Object.keys(obj);
  for (const key of keys) {
    const val = obj[key];
    switch (key) {
      case 'templateNum':
        errors[key] = valid_isEmpty(val);
        break;
    }
  }
  // console.log('Valid Result (formValues) : ', errors);
  return errors;
};



export const validateExposedGroupTarget = (obj) => {
  let errors = {};
  const keys = Object.keys(obj);
  
  for (const key of keys) {
    const val = obj[key];
    
    switch (key) {
      case 'templateNum':
        errors[key] = valid_isEmpty(val);
        break;
      case 'gradeStart':
        errors[key] = valid_isEmpty(val) && '회원등급을 선택해주세요.';
        break;
      case 'gradeEnd':
        errors[key] = valid_isEmpty(val) && '회원등급을 선택해주세요.';
        break;
      case 'birthYearFrom':
        errors[key] = valid_isEmpty(val) && '연령을 선택해주세요';
        break;
      case 'birthYearTo':
        errors[key] = valid_isEmpty(val) && '연령을 선택해주세요';
        break;
    }
  }
  // console.log('Valid Result (formValues) : ', errors);
  return errors;
};
