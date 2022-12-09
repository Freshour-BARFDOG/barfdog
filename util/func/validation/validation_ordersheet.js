import {
  valid_arrayErrorCount,
  valid_currency,
  valid_isEmpty,
  valid_isEmptyArray,
  valid_isEmptyCurrency, valid_phoneNumber,
} from './validationPackage';

export const validate = (obj) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'phone':
        errors[key] = valid_phoneNumber(val);
        break;
      case 'street':
        errors[key] = valid_isEmpty(val);
        break;
      case 'detailAddress':
        errors[key] = valid_isEmpty(val);
        break;
      case 'paymentMethod':
        errors[key] = valid_isEmpty(val);
        break;
      case 'agreePrivacy':
        errors[key] = valid_isEmpty(val);
        break;
      case 'paymentPrice':
        errors[key] = valid_paymentPrice(val);
        break;
    }
  }
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};


export const validateInBundleDelivery = (obj) => {
  let errors = {};
  
  const keys = Object.keys(obj);
  
  for (const key of keys) {
    const val = obj[key];
    
    switch (key) {
      case 'paymentMethod':
        errors[key] = valid_isEmpty(val);
        break;
      case 'agreePrivacy':
        errors[key] = valid_isEmpty(val);
        break;
      case 'paymentPrice':
        errors[key] = valid_paymentPrice(val);
        break;
    }
  }
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};


const valid_paymentPrice = (val) =>{
  let error='';
  //
  // * 결제금액 0원 가능 조건: "customer_uid" 필요
  // ! => 아임포트 에러메시지: "결제요청금액이 0원입니다. 빌링키발급을 위해 customer_uid가 지정될 때에만 0원이 허용됩니다. 요청 amount :0"
  // * TEST REPORT
  // * => 정기결제: 100원 불가
  // * => 일반결제: 불가 (customer Uid___ 존재하는지?)
  const minPaymentPrice = 100;
  if(typeof val !== 'number') {
    error = '결제금액의 타입은 Number를 사용해야 합니다.'
  } else if( val < minPaymentPrice ){
    error = `최소결제금액 ${minPaymentPrice}원보다 적을 수 없습니다.`
  }
  
  return error;
}