import {
  valid_arrayErrorCount,
  valid_currency,
  valid_isEmpty,
  valid_isEmptyArray,
  valid_isEmptyCurrency, valid_isEmptyFile,
} from './validationPackage';

export const validate = (obj, fileObj) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'description':
        errors[key] = valid_isEmpty(val);
        break;
      case 'uiNameKorean':
        errors[key] = valid_isEmpty(val);
        break;
      case 'uiNameEnglish':
        errors[key] = valid_isEmpty(val);
        break;
      case 'pricePerGram':
        errors[key] = valid_isEmpty(val);
        break;
      case 'gramPerKcal':
        errors[key] = valid_isEmpty(val);
        break;
      case 'ingredients': // 재료는1개이상있어야 한다.
        errors[key] = valid_isEmpty(val) && '재료는 하나 이상 포함되어야 합니다.';
        break;
      case 'descriptionForSurvey':
        errors[key] = valid_isEmpty(val);
        break;
    }
  }
  
  // 객체파일이니깐 각각
  const fileKeys = Object.keys(fileObj);
  for (const key of fileKeys) {
    const objVal = fileObj[key];
    switch (key) {
      case 'surveyResult':
        errors[key] = valid_isEmptyFile( objVal , 'thumbnailUri'); // ! 주의: thumbnailUri (O) thumbnailUrl (X)
        break;
      case 'recipeThumb':
        errors[key] = valid_isEmptyFile( objVal, 'thumbnailUri' );  // ! 주의: thumbnailUri (O) thumbnailUrl (X)
        break;
    }
  }
  
  
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};



