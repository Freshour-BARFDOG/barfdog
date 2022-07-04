import axios from 'axios';
import checkCharactorSamenessAndContinuity from '../checkCharactorSamenessAndContinuity';
import transformClearLocalCurrency from '../transformClearLocalCurrency';
import convertFileSizeToMegabyte from '../convertFileSizeToMegabyte';

export const valid_hasFormErrors = (errorObj) => {
  let isPassed = true;
  for (const key in errorObj) {
    const val = errorObj[key];
    if (val) {
      isPassed = false;
      break;
    }
  }
  return isPassed;
};







export const valid_isEmpty = (value) => {
  const error = value ? '' : '항목이 비어있습니다.';
  return error;
};



export const valid_isEmptyArray = (arr) =>{
  let error;
  if(typeof arr !== 'object'){
    alert('데이터 처리 중 에러가 발생했습니다. 개발사에게 문의하세요.')
    return console.error('ERROR: Parameter type must be array');
  }
  error = arr.length ? '' : '항목이 비어있습니다.';
  return error;
}


export const valid_isEmptyFile = (obj, substituteKey ) => {
  let error = '';

  if(!Object.keys(obj).length){
    error = '항목이 비었습니다.'
  }

  for (const key in obj) {
    const val = obj[key];

    if(key === substituteKey && val){
      return error = '';
    } else if(key === 'file' && !val){
      error = '항목이 비었습니다.';
    }
  }

  return error;
}



export const valid_isEmptyCurrency = (value) => {
  const stringValue = typeof value === 'number' ? String(value) : value;
  const currency = transformClearLocalCurrency(stringValue);
  const error = currency !== 0 ? '' : '항목이 비어있습니다.';
  return error;
};




export const valid_isEmptyObject = (obj) => {
  let error;
  for ( const key in obj ) {
    const val = obj[key];
    console.log(val)
    if(!val){
      error = `빈 항목이 있습니다.`;
      break
    }
  }
  return error;
}





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





export const valid_URL = (value)=>{
  let error='';

  const url = value;
  const regExp = /(http|https):\/\/((\w+)[.])+(asia|biz|cc|cn|com|de|eu|in|info|jobs|jp|kr|mobi|mx|name|net|nz|org|travel|tv|tw|uk|us)(\/(\w*))*$/i;

  const result = regExp.test(url);

  if(!url){
    error = ''; // 필수항목아니므로 비어있어도 됨
  } else if (!result) {
    error = '링크 형식이 올바르지 않습니다.';
  }

  return error;
}




export const valid_currency = (value)=>{
  let error ='';
  const stringValue = typeof value === 'number' ? String(value) : value;
  const currency = transformClearLocalCurrency(stringValue);
  if ( currency < 0 ) {
    error = '가격은 0보다 작을 수 없습니다.'
  }
  return error;
}




export const valid_arrayErrorCount = (arr) => {
  let errorCount = 0;
  if (arr.length) {
    arr.map((optionObj) => {
      const errorObj = valid_singleItemOptionObj(optionObj);
      const isPassed = valid_hasFormErrors(errorObj);
      !isPassed && errorCount++;
    });
  }
  return errorCount;
};
const valid_singleItemOptionObj = (optionObj) => {
  let error = {};

  for (const key in optionObj) {
    const val = optionObj[key];
    switch (key) {
      case 'name':
        error[key] = valid_isEmpty(val);
        break;
      case 'price':
        error[key] = ''; // 옵션가격은 추가 검증할 내역 없음
        break;
      case 'remaining':
        error[key] = valid_isEmptyCurrency(val);
        break;
    }
  }
  // console.log('singleOptions Error:', error)
  return error;
};


export const valid_fileSize = (file, maxFileSize) => {
  let error = file.size > maxFileSize;
  if (error) {
    error = `- 최대 파일크기: ${convertFileSizeToMegabyte(
      maxFileSize,
    )}MB 이상의 파일이 포함돼있습니다.\n- 초과된 파일명: ${
      file.name
    } \n- 초과된 파일크기: ${convertFileSizeToMegabyte(file.size)}MB`;
    alert(error);
  }
  return error;
};