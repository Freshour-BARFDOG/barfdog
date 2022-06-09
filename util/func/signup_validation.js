import axios from 'axios';
import checkCharactorSamenessAndContinuity from './checkCharactorSamenessAndContinuity';
import password from "../../src/pages/bf-admin/login/password";


export const valid_isEmpty = (value) => {
  const message = value ? '' : '항목이 비어있습니다.';
  return message;
};



export const valid_email = async (value) => {
  const email = value;
  let message;
  let isEmailDuplicated = false;
  const RegExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

  if(!email){
    return { message: '항목이 비어있습니다.'};
  } else if (!RegExp.test(email)) {
    return { message: '이메일 형식이 올바르지 않습니다.'};
  }


  const response = await valid_email_duplication(email);
  if( response.hasServerError) {
    message = '서버와 통신할 수 없습니다. \n관리자에게 문의하세요.';
    isEmailDuplicated = undefined;
  } else if (response.isDuplicated) {
    message = '이미 존재하는 회원입니다.';
    isEmailDuplicated = true;
  } else if (!response.isDuplicated) {
    message = '사용 가능한 아이디 입니다.';
    isEmailDuplicated = false;
  }
  
  return { message, isEmailDuplicated };
};



export const valid_email_duplication = async (value) => {

  // MEMO : 이메일 중복일 경우 -> BACKEND SERVER 409
  const result = { isDuplicated: undefined, hasServerError: false }
  const API_URL = '/api/email/duplication';
  await axios
    .get(API_URL, {
      params: {
        email :value,
      },
      headers: {
        'content-Type': 'application/json',
      }
    })
    .then((res) => {
      return result.isDuplicated = res.data && false;
    })
    .catch((err) => {
      console.error('_______중복 검사결과: ',err.request.status);
      if(err.request.status === 409 ){
        return result.isDuplicated = true;
      } else {
        return result.hasServerError = true;
      }
    });
  return result;
};






export const valid_password = (value) => {

  let error;
  let message = [
    {label:'최소 7자리 이상', valid: false},
    {label:'영문/숫자/특수문자 조합', valid: false},
    {label:'3개 이상 동일하거나 연속성있는 문자 사용불가', valid: false}
  ];

  const pw = value;
  const pattern_num = /[0-9]/;
  const pattern_en = /[a-zA-Z]/;
  const pattern_spChar = /[~!@#$%^&*()<>+-]/;

  if(!value){
    error = true;
  }



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
  const pattren_continuity = Object.keys(continuityObj).length ? false : true;
  if(!pattren_continuity){
    error = '연속성 초과';
  }

  message[0].valid = pattern_minLength;
  message[1].valid = pettern_mixedChar;
  message[2].valid = pattren_continuity;

  return {error, message};
};


export const valid_confirmPassword = (pw, pw2) => {
  let error ;
  let isMatched = false;
  if(!pw) return;
  error = pw !== pw2 ? "비밀번호가 일치하지 않습니다." : '';
  isMatched = pw === pw2 && '비밀번호가 일치합니다.';
  return {error, isMatched};
}


export const valid_phoneNumber = (value) => {
  let error ;
  const phone = value;
  const RegExp = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
  error = RegExp.test(phone) ? "" : '휴대폰번호를 확인해주세요.'
  console.log(RegExp.test(phone))
  return error;
}





// ------------------  VALIDATE ------------------ //
export const validate = async (obj) => {
  let errors = {};
  
  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'email':
        errors[key] = valid_isEmpty(val) || (await valid_email(val)).message;
        break;
      case 'password':
        errors[key] = valid_password(val).error;
        break;
      case 'confirmPassword':
        const pw1 = obj['password'];
        const pw2 = val;
        errors[key] = valid_isEmpty(val) || valid_confirmPassword(pw1, pw2)?.error;
        errors['passwordMatch'] = valid_confirmPassword(pw1, pw2)?.isMatched;
        break;
      case 'phoneNumber':
        errors[key] = valid_isEmpty(val) || valid_phoneNumber(val);
        break;
      case 'address':
        errors[key] = valid_isEmpty(val);
        break;
      case 'birthday':
        errors[key] = valid_isEmpty(val);
        break;
      default:
        break;
    }

  };


  console.log('Validation Result: ', errors);
  return errors;
};






