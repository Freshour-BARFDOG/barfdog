import {
  valid_confirmPassword,
  valid_email,
  valid_isEmpty,
  valid_password,
  valid_phoneNumber,
} from './validationPackage';

export const validate = async (obj, formErrors, option={mode:'normal'}) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'email':
        
        errors[key] = valid_isEmpty(val) || valid_email(val) || formErrors.isEmailDuplicated === null ? '이메일 중복확인을 하지 않았습니다.' : '';
        break;
      case 'password':
        if(option.mode === 'normal'){
          errors[key] = valid_password(val).error;
        }
        break;
      case 'confirmPassword':
        const pw1 = obj['password'];
        const pw2 = val;
        if(option.mode === 'normal'){
          errors[key] = valid_confirmPassword(pw1, pw2).error;
        }
        break;
      case 'phoneNumber':
        errors[key] = valid_isEmpty(val) || valid_phoneNumber(val);
        break;
      case 'address':
        const addrObj = val;
        for (const key in addrObj) {
          const val = addrObj[key];
          if(key === 'detailAddress' || key === 'street'){
            errors[key] = valid_isEmpty(val);
          }
        }
        break;
      // case 'address':
      //   const addrObj = val;
      //   const targetKey = Object.keys(addrObj)[0];
      //   const thisVal = addrObj[targetKey];
      //   errors[key] = valid_isEmpty(thisVal);
      //   break;
      case 'detailAddress':
        errors[key] = valid_isEmpty(val);
        break;
      case 'birthday':
        errors[key] = valid_isEmpty(val) || valid_minAge(val);
        break;
      default:
        break;
    }
  }

  errors.isEmailDuplicated = formErrors.isEmailDuplicated;
  errors.isValidPhoneNumber = formErrors.isValidPhoneNumber;

  console.log('Valid Result (formValues) : ', errors);
  return errors;
};


const valid_minAge = (birthDay, limitedAge=14)=>{
  let error = '';
  const birthYear = Number(birthDay.slice(0,4)); // YYYYMMDD
  const curYear = new Date().getFullYear();
  const koreanAgeUnit = +1;
  const age = curYear - birthYear + koreanAgeUnit;
  const minAge = limitedAge;
  if(!birthDay){
    error = '항목이 비어있습니다.'
  } else if(birthDay.replace(/-/gi,'').length !== 8){
    error=`생년월일 형식이 올바르지 않습니다.`
  } else if(age < minAge){
    error=`${minAge}세 미만입니다.`
  }
  
  return error;
  
}