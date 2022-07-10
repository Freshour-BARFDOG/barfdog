import React from 'react';
import {valid_date, valid_isEmpty, valid_isEmptyArray, valid_isNumberEmpty} from "./validationPackage";


export const validate = (obj) => {
  let errors = {};

  const keys = Object.keys(obj);
  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'expiredDate':
        errors[key] = valid_isEmpty(val) || valid_date(val).error;
        break;
      case 'couponId':
        errors[key] = valid_isNumberEmpty(val);
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
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};

