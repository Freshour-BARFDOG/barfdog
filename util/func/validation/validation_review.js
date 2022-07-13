import { valid_date, valid_isEmpty, valid_maxLength } from './validationPackage';

// 어드민이냐, 일반유저냐의 타입에 따라서,
// 발리데이션 항목을 별도로 관리한다.

// 어드민 타입일 경우
// 상품 카테고리
//
export const validate = (obj, option) => {
  let errors = {};
  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'type':
        errors[key] = valid_isEmpty(val);
        break;
      case 'id':
        errors[key] = valid_isEmpty(val);
        break;
      case 'writtenDate':
        errors[key] = valid_isEmpty(val) || valid_date(val, 'past').error;
        break;
      case 'username':
        errors[key] = valid_isEmpty(val);
        break;
      case 'star':
        errors[key] = valid_isEmpty(val);
        break;
      case 'contents':
        const maxLength = option[key];
        errors[key] = valid_isEmpty(val) || valid_maxLength(val, maxLength);
        break;
    }
  }

  console.log('Valid Result (formValues) : ', errors);
  return errors;
};
