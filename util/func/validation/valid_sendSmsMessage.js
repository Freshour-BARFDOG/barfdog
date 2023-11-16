import React from 'react';
import {valid_isEmpty, valid_phoneNumber} from "./validationPackage";

export const validate = (obj) => {
  let errors = {};
  
  const keys = Object.keys(obj);
  for (const key of keys) {
    const val = obj[key];
    
    switch (key) {
      case 'friendName':
        errors[key] = valid_isEmpty(val) && '친구이름을 입력해주세요.';
        break;
      case 'friendPhoneNumber':
        errors[key] = valid_phoneNumber(val);
        break;
    }
  }
  
  // console.log('Valid Result (formValues) : ', errors);
  return errors;
};


