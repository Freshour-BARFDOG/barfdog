import React from 'react';
import {valid_isEmpty, valid_isEmptyFile, valid_URL} from "./validationPackage";

export const validate = (obj, fileObj) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'pcLinkUrl':
        errors[key] = valid_URL(val);
        break;
      case 'mobileLinkUrl':
        errors[key] = valid_URL(val);
        break;
    }
  }


  const fileKeys = Object.keys(fileObj);
  for (const key of fileKeys) {
    const val = fileObj[key];
    console.log(val)
    switch (key) {
      case 'pcFile':
        errors[key] = valid_isEmptyFile(val, 'url');
        break;
      case 'mobileFile':
        errors[key] = valid_isEmptyFile(val,'url');
        break;
    }
  }
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};



