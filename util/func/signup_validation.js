import axios from 'axios';
import checkCharactorSamenessAndContinuity from './checkCharactorSamenessAndContinuity';


export const valid_isEmpty = (value) => {
  const message = value ? '' : '항목이 비어있습니다.';
  return message;
};



export const valid_email = (value) => {
  let error='';

  const email = value;
  const RegExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

  if(!email ){
    error = '항목이 비었습니다.'
  } else if (!RegExp.test(email)) {
    error = '이메일 형식이 올바르지 않습니다.'
  }

  return error;
};



export const valid_email_duplication = async (value) => {
  let error;
  let message;

  await axios
    .get('/api/email/duplication', {
      params: {
        email :value,
      },
      headers: {
        'content-Type': 'application/json',
      }
    })
    .then((res) => {
      error = '';
      message = res.data && '사용가능한 계정입니다.';
      // console.log('계정 중복검사: ',res.data && '사용가능한 계정입니다.')

    })
    .catch((err) => {
      if(err.request.status === 409 ){
        console.log('계정 중복검사')
        error = '이미 존재하는 계정입니다.'
      } else {
        error = '서버와 통신할 수 없습니다. \n관리자에게 문의하세요.';
      }
    });
  // console.log('err:', error, '& msg:', message)
  return {error, message};
};






export const valid_password = (value) => {

  let error = '';
  let message = [
    {label:'최소 7자리 이상', valid: false},
    {label:'영문/숫자/특수문자 조합', valid: false},
    {label:'3회 이상 동일하거나 연속성이 없는 문자', valid: false}
  ];

  const pw = value;
  const pattern_num = /[0-9]/;
  const pattern_en = /[a-zA-Z]/;
  const pattern_spChar = /[~!@#$%^&*()<>+-]/;

  if(!value) error = '항목이 비었습니다.';



  // PART 1
  const passwordMinLength = 7;
  const pattern_minLength = pw.length >= passwordMinLength;
  !pattern_minLength && (error = '최소 글자 수 미충족');



  // PART 2
  let mixedCharCount = 0;
  pattern_num.test(pw) && mixedCharCount++;
  pattern_en.test(pw) && mixedCharCount++;
  pattern_spChar.test(pw) && mixedCharCount++;
  const pettern_mixedChar = mixedCharCount >= 2;
  !pettern_mixedChar && (error = '문자 조합 미중축');


  // PART 3
  const continuityObj = checkCharactorSamenessAndContinuity(pw);
  const pattren_continuity = !Object.keys(continuityObj).length;
  !pattren_continuity && (error = '연속성 초과');

  message[0].valid = pattern_minLength;
  message[1].valid = pettern_mixedChar;
  message[2].valid = pattren_continuity;

  return {error, message};
};





export const valid_confirmPassword = (pw, pw2) => {
  let error;
  let message = {
    label: '',
    valid: pw === pw2
  }

  if(!pw) {
    message.valid = false;
  }

  if(!pw2){
    error = '항목이 비어있습니다.'
  } else if (pw !== pw2) {
    error = "비밀번호가 일치하지 않습니다.";
    message.label = "비밀번호가 일치하지 않습니다.";
  } else if(pw === pw2) {
    error = "";
    message.label = "비밀번호가 일치합니다.";
  }

  return {error, message};
}


export const valid_phoneNumber = (value) => {
  let error ;
  const phone = value;
  const RegExp = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
  error = RegExp.test(phone) ? "" : '휴대폰번호를 확인해주세요.'
  return error;
}





export  const valid_authNumber = (num1, num2)=>{
  const error = num1 !== num2 && '인증번호를 확인해주세요.'
  const isMatched = num1 === num2 && '인증되었습니다.'
  return {error, isMatched}
}






export const valid_policyCheckbox = (obj, standardObjList = [])=>{
  let errors = {};
  const requiredKeyList = [];
  standardObjList.forEach((list)=> (list.required && requiredKeyList.push(list.label)));

  for (const key in obj) {
    const isRequired = requiredKeyList.indexOf(key) >= 0;
    if(isRequired){
      const checked = obj[key];
      errors[key] = !checked ? '필수 항목입니다.' : '';
    }
  }
  return errors;
}





export const validate = async (obj, formErrors) => {
  let errors = {};


  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];


    switch (key) {
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'email':
        errors[key] = valid_isEmpty(val) || valid_email(val);
        break;
      case 'password':
        errors[key] = valid_password(val).error;
        break;
      case 'confirmPassword':
        const pw1 = obj['password'];
        const pw2 = val;
        errors[key] = valid_confirmPassword(pw1, pw2).error;
        break;
      case 'phoneNumber':
        errors[key] = valid_isEmpty(val) || valid_phoneNumber(val);
        break;
      case 'address':
        const addrObj = val;
        const targetKey = Object.keys(addrObj)[0];
        const thisVal = addrObj[targetKey];
        errors[key] = valid_isEmpty(thisVal);
        break;
      case 'detailAddress':
        errors[key] = valid_isEmpty(val);
        break;
      case 'birthday':
        errors[key] = valid_isEmpty(val);
        break;
      default:
        break;
    }
  };

  errors.isEmailDuplicated = formErrors.isEmailDuplicated;
  errors.isValidPhoneNumber=formErrors.isValidPhoneNumber;

  console.log('Valid Result (formValues) : ', errors);
  return errors;
};






