import {
  valid_isEmpty,
  valid_isNumberEmpty,
} from './validationPackage';
import {valid_intervalBetweenDates} from "./valid_intervalBetweenDates";
import {valid_isDateLaterThanToday} from "./valid_isDateLaterThanToday";

export const validate = (obj) => {
  let errors = {};

  const keys = Object.keys(obj);

  const minSlackTime = 1000 * 60 * 10; // 10분

  for (const key of keys) {
    const val = obj[key];

    switch (key) {
      case 'type':
        errors[key] = valid_isEmpty(val);
        break;
      case 'name':
        errors[key] = valid_isEmpty(val);
        break;
      case 'startDate':
        errors[key] = valid_isEmpty(val) || valid_isDateLaterThanToday(val, "min", minSlackTime);
        break;
      case 'expiredDate':
        const from = obj["startDate"];
        const to = obj["expiredDate"];
        errors[key] =
            valid_isEmpty(val)
            || valid_isDateLaterThanToday(val, "min", minSlackTime)
            || valid_intervalBetweenDates(from, to, "hour", 1);
        break;
      case 'couponId':
        errors[key] = valid_isEmpty(val);
        break;
      case 'remaining':
        errors[key] = valid_isNumberEmpty(val);
        break;
      case 'status':
        errors[key] = valid_isEmpty(val);
        break;
    }
  }
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};
