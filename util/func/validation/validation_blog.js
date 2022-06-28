import React from 'react';
import {valid_isEmpty, valid_isEmptyArray, valid_isEmptyFile,} from "./validationPackage";

export const validate = (obj, fileObj) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'category':
        errors[key] = valid_isEmpty(val);
        break;
      case 'title':
        errors[key] = valid_isEmpty(val);
        break;
      case 'blogThumbnailId':
        errors[key] = valid_isEmpty(val);
        break;
      case 'contents':
        errors[key] = valid_isEmpty(val);
        break;
        // - 블로그 이미지삽입 필수아님.
      // case 'blogImageIdList':
      //   errors[key] = valid_isEmptyArray(val)
      //   break;
    }
  }

  const thumbnailKey = 'thumbnailId'
  errors[thumbnailKey] = valid_isEmptyFile(fileObj, 'thumbnailUrl');
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};

