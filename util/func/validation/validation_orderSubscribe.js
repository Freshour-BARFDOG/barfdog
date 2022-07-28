import React from 'react';
import {valid_isEmpty, valid_isEmptyArray} from "./validationPackage";


export const validate = (obj) => {
  let errors = {};
  
  const keys = Object.keys(obj);
  for (const key of keys) {
    const val = obj[key];
    switch (key) {
      case 'plan':
        errors[key] = valid_isEmpty(val);
        break;
      case 'recipeIdList':
        errors[key] = valid_isEmptyArray(val);
        break;
      case 'nextPaymentPrice':
        errors[key] = valid_isEmpty(val);
        break;
    }
  }
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};

