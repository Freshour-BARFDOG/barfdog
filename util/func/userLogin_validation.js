


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





export const validate = async (obj) => {
  let errors = {};
  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'email':
        errors[key] = valid_isEmpty(val) || valid_email(val);
        break;
      case 'password':
        errors[key] = valid_isEmpty(val);
        break;
      default:
        break;
    }
  };

  console.log('Valid Result (formValues) : ', errors);
  return errors;
};




