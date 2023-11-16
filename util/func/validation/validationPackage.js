import axios from 'axios';
import checkCharactorSamenessAndContinuity from '../checkCharactorSamenessAndContinuity';
import transformClearLocalCurrency from '../transformClearLocalCurrency';
import convertFileSizeToMegabyte from '../convertFileSizeToMegabyte';
import { discountUnitType } from '../../../store/TYPE/discountUnitType';
import transformDate, { transformToday } from '../transformDate';
import deleteHypenOnDate from '../deleteHypenOnDate';
import {isArray} from "util";

export const valid_hasFormErrors = (errorObj, type = 'array') => {
  let isPassed = true;
  if (type === 'array' && Array.isArray(errorObj)) {
    const errorArray = errorObj;
    errorArray.map((innerObj) => {
      const result = valid_hasFormErrors(innerObj);
      // ! result중에 false가 하나라도 있으면 error로 취급
      if(!result) return isPassed = false;

    });
  } else {
    for (const key in errorObj) {
      const error = errorObj[key];
      if (error) {
        isPassed = false;
        break;
      }
    }
  }

  return isPassed;
};







export const valid_isEmpty = (value, option={detail:false, message:'필수 항목입니다.'}) => {
  let error = '';
  if(option.detail){
    error = value === null ? '항목이 비었습니다.' : ''
  } else if(typeof value === 'string' && !value.replace(/\s*/g, '').length){
    error = option.message || '항목이 비어있습니다.'
  } else if (!value){
    error = option.message || '항목이 비어있습니다.'
  }
  return error;
};


export const valid_isNumberEmpty = (value) => {
  let error;
  if(Number(value) === 0){
    error = '항목은 0보다 커야합니다.'
  } else if(!value){
    error = '항목이 비어있습니다.'
  }
  return error;
};




export const valid_isEmptyArray = (arr) =>{
  let error;
  if(Array.isArray(arr)){
    error = arr.length ? '' : '항목이 비어있습니다.';
    if(arr.length > 0 && !arr[0]){
      error = '배열의 항목이 비어있습니다;'
    }
  } else if(typeof arr !== 'object'){
    alert('데이터 처리 중 에러가 발생했습니다. 개발사에게 문의하세요.')
    return console.error('ERROR: Parameter type must be array');
  }


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
    // console.log(val)
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
  // const RegExp_before = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
  const RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ // ! 0926 validation update ver.
  // // console.log('RegExp_before: ',RegExp_before.test(email))
  // // console.log('RexExp: ',RexExp_advanced.test(email))
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
      // // console.log('계정 중복검사: ',res.data && '사용가능한 계정입니다.')

    })
    .catch((err) => {
      if(err.request.status === 409 ){
        error = '이미 존재하는 계정입니다.'
      } else {
        error = '서버와 통신할 수 없습니다. \n관리자에게 문의하세요.';
      }
    });
  // // console.log('err:', error, '& msg:', message)
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

  if(!value){
    error = '항목이 비었습니다.';
    return {error , message}
  };



  // PART 1
  const passwordMinLength = 7;
  const pattern_minLength = pw?.length >= passwordMinLength;
  !pattern_minLength && (error = '최소 글자 수 미충족');



  // PART 2
  let mixedCharCount = 0;
  pattern_num.test(pw) && mixedCharCount++;
  pattern_en.test(pw) && mixedCharCount++;
  pattern_spChar.test(pw) && mixedCharCount++;
  const pettern_mixedChar = mixedCharCount >= 3;
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
  const regExp = /(http|https):\/\/((\w+)[.])+(asia|biz|cc|cn|com|de|eu|in|info|jobs|jp|kr|mobi|mx|name|net|nz|org|travel|tv|tw|uk|us|app)(\/(\w*))*$/i;

  const result = regExp.test(url);

  if(!url){
    error = ''; // 필수항목아니므로 비어있어도 됨
  } else if (!result) {
    error = '링크 형식이 올바르지 않습니다.';
  }

  return error;
}



export const valid_link = (value) => {
  let errorsMessage;

  const regexURL = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
    "gi"
  ); // fragment locator

  const valid = regexURL.test(value);

  if (value && !valid) {
    errorsMessage = "유효하지 않은 링크입니다.";
  } else {
    errorsMessage = "";
  }

  return errorsMessage;
};



export const valid_currency = (value, options ={mode:'',unit:''}, availableMaxDiscount)=>{
  let error ='';
  const stringValue = typeof value === 'number' ? String(value) : value;
  const currency = transformClearLocalCurrency(stringValue);
 const maxDiscountNum = transformClearLocalCurrency(availableMaxDiscount);
  if ( currency < 0 ) {
    error = '가격은 0보다 작을 수 없습니다.'
  }

  if (options.unit === discountUnitType.FIXED_RATE && currency <= 0){
    error = '할인률은 0 이하로 설정할 수 없습니다.'

  } else if (options.unit === discountUnitType.FIXED_RATE && currency >= 100){
    error = '할인률은 100 이상 설정할 수 없습니다.'
  } else if(options.mode==='strict' && currency <= 0) {
    error = '항목이 비어있습니다.'
  }


  if (maxDiscountNum < currency){
    error = '할인금액은 최대사용금액보다 높을 수 없습니다.'
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
  // // console.log('singleOptions Error:', error)
  return error;
};


export const valid_fileSize = (file, maxFileSize) => {
  let error = file?.size > maxFileSize;
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



export const valid_couponCode = (val) => {
  /*
  < 관리자 생성: 쿠폰코드 있을 경우 >
  - 유저: 쿠폰코드를 입력 후, 수령
  - 유저: 쿠폰코드 등록 단 1회만 가능 (어드민 중복발행과 관계 없음)
  - 어드민: 쿠폰 수정 불가 (수정이 필요할 경우, 쿠폰 삭제 후 재발행)
*/
  let error = '';

  // PART 1
  const maxLength = 15;
  const codeLength = val.length;

  // PART 2
  const pattern_num = /[0-9]/;
  const pattern_en = /[a-zA-Z]/;
  const pattern_ko = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  const pattern_spChar = /[\{\}\[\]\/?.,;:|\)*~`_!^+<>@\#$%&\\\=\(\'\"]/g;
  const availableSpecialChar = '하이픈(-)';
  let mixedCharCount = 0;
  pattern_num.test(val) && mixedCharCount++;
  pattern_en.test(val) && mixedCharCount++;
  const pettern_mixedChar = mixedCharCount >= 2;

  if (!val) {
    // 입력한 값이 없을 경우, 관리자 쿠폰으로 발행됨
    error = '쿠폰코드는 공란일 수 없습니다.';
  } else if (pattern_ko.test(val)) {
    error = '한글은 포함될 수 없습니다.';
  } else if (pattern_spChar.test(val)) {
    error = `${availableSpecialChar}외의 특수문자는 포함될 수 없습니다.`;
  // } else if (!pettern_mixedChar) {
  //   error = '영문 및 숫자가 포함되어야합니다.';
  } else if (codeLength > maxLength) {
    error = '코드 글자 수는 15자 이내입니다.';
  }

  return error;
};



export const valid_isTheSameArray = (beforeArr1, beforeArr2) => {
  if(!beforeArr1 || !beforeArr2 || (beforeArr1?.length === 0 && beforeArr2?.length === 0)){
    return false;
  }
  const arr1 = JSON.stringify( Array.from(beforeArr1).sort() );
  const arr2 = JSON.stringify( Array.from(beforeArr2).sort() );

  return arr1 === arr2;
}




export const valid_date = (d, type='future') => {
  let error = '';
  let expiredDate = '';
  const convertedDate = deleteHypenOnDate(d);
  const selectedDate = Number(convertedDate);
  const todayWithHypen = transformToday();
  const stringToday = deleteHypenOnDate(todayWithHypen);
  const today = Number(stringToday);
  expiredDate = selectedDate - today;
  if(d.split("-").length !== 3){
    const unit= d.split('-');
    if(unit[0].length===4 && unit[1].length===2 && unit[2].length===2){
      error = '날짜 형식에 맞지 않습니다.'
    }
  } else if(!d){
    error = '항목이 비었습니다.'
  }

  if(type === 'future' && selectedDate < today){
    error = '오늘보다 과거일 수 없습니다.';

  } else if(type === 'past' && selectedDate > today){
    error = '오늘보다 미래일 수 없습니다.';
  }


  return { error, expiredDate };
}


export const valid_minLength = (val, minLength)=>{
  let error = '';
  if(!minLength || typeof minLength !== 'number') {
    new Error('Required minLength of Number Type');
  }


  if(val.length < minLength){
    error = `최소 ${minLength} 글자 이상 작성해주세요.`;
  }

  return error;
}



export const valid_maxLength = (val, maxLength)=>{
  let error = '';
  if(!maxLength || typeof maxLength !== 'number') {
    new Error('Required maxLength of Number Type');
  }


  if(val.length > maxLength){
    error = '작성 가능한 최대 글자수를 초과했습니다.';
  }

  return error;
}




export const valid_dogBirthYearAndMonth = (val)=>{
  let error= '';
  const curDate = transformDate(transformToday(), null, {separator:null});
  const curYear = curDate.slice(0,4);
  const curMonth = curDate.slice(4,6);
  const limitedYearAndMonth = Number(`${curYear}${curMonth}`);
  if(!val){
    error = '항목이 비어있습니다.';
  } else if (val.length === 2){
    error = '년도 항목이 비어있습니다.';
  } else if (val.length === 4){
    error = '생월 항목이 비어있습니다.';
  } else if(val > limitedYearAndMonth){
    error = '항목은 현재보다 미래일 수 없습니다.';
  }
  return error;
}



export const valid_dogWeight = (val, limitIntCount = 2)=>{
  let error= '';
  if(!val || Number(val) === 0){
    error = '항목이 비어있습니다.'
  }

  const isOnlyIntValue = val.indexOf('.') < 0;
  if(isOnlyIntValue && val.length > limitIntCount){
    error = '항목의 정수값은 최대 2자리입니다.'
  }

  return error;
}
