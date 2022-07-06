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
        errors[key] = valid_isEmptyArray(val);
        break;
      case 'gradeList':
        errors[key] = valid_isEmptyArray(val);
        break;
      case 'birthYearFrom':
        errors[key] = valid_isEmpty(val);
        break;
      case 'birthYearTo':
        errors[key] = valid_isEmpty(val);
        break;
    }
  }
  
  console.log()


  console.log('Valid Result (formValues) : ', errors);
  return errors;
};


