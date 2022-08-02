import {
  valid_confirmPassword,
  valid_email,
  valid_isEmpty,
  valid_password,
  valid_phoneNumber,
} from './validationPackage';

export const validate = (obj) => {
  let errors = {};

  const keys = Object.keys(obj);

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'email':
        errors[key] = valid_isEmpty(val).error;
        break;
      case 'password':
        errors[key] = valid_password(val).error;
        break;
      case 'passwordConfirm':
        const pw1 = obj['password'];
        const pw2 = val;
        errors[key] = valid_confirmPassword(pw1, pw2).error;
        break;
    }
  }

  console.log('Valid Result (formValues) : ', errors);
  return errors;
};
