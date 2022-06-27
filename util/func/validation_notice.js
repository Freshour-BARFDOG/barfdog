import React from 'react';
import {valid_isEmpty} from "./validationPackage";

export const validate = (obj) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'title':
        errors[key] = valid_isEmpty(val);
        break;
      case 'contents':
        errors[key] = valid_isEmpty(val);
        break;
    }
  }
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};

