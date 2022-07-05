import React from 'react';
import {valid_isEmpty, valid_isEmptyArray, valid_isEmptyCurrency} from "./validationPackage";

export const validate = (obj) => {
  let errors = {};

  const keys = Object.keys(obj);
  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'amount':
        errors[key] = valid_isEmptyCurrency(val);
        break;
      case 'memberIdList':
        // 특정조건일 때 이게 발동해야 한다.
        errors[key] = valid_isEmptyArray(val);
        break;
      case 'gradeList':
        // 특정조건일 때 이게 발동해야 한다.
        errors[key] = valid_isEmptyArray(val);
        break;
      case 'birthYearFrom':
        // 특정조건일 때 이게 발동해야 한다.
        errors[key] = valid_isEmpty(val);
        break;
      case 'birthYearTo':
        // 특정조건일 때 이게 발동해야 한다.
        errors[key] = valid_isEmpty(val);
        break;
    }
  }
  
  console.log()


  console.log('Valid Result (formValues) : ', errors);
  return errors;
};


