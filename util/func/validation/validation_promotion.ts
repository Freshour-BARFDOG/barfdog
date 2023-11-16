import {valid_isEmpty, valid_isNumberEmpty,} from './validationPackage';
import {valid_intervalBetweenDates} from "./valid_intervalBetweenDates";
import {valid_isDateLaterThanToday} from "./valid_isDateLaterThanToday";
import {valid_quantityForLimitedQuantity} from "@util/func/validation/valid_quantityForLimitedQuantity";
import errorMessage from "@src/components/atoms/ErrorMessage";

type Method = "update" | "create";

export const validate = (obj, method: Method, originData = {
  limitedAmount: null,
  beforeStartDate: null,
  beforeExpiredDate: null
}) => {
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
        // console.log(isTheSameDateTime(val, originData.beforeStartDate));
        if (method === "update" && isTheSameDateTime(val, originData.beforeStartDate)) {
          errors[key] = "";
        }
        break;
      case 'expiredDate':
        const from = obj["startDate"];
        const to = obj["expiredDate"];
        errors[key] =
            valid_isEmpty(val)
            || valid_isDateLaterThanToday(val, "min", minSlackTime)
            || valid_intervalBetweenDates(from, to, "hour", 1);
        if (method === "update" && isTheSameDateTime(val, originData.beforeExpiredDate)) {
          errors[key] = "";
        }
        break;
      case 'couponId':
        errors[key] = valid_isEmpty(val);
        break;
      case 'quantity':
        errors[key] =
            valid_isNumberEmpty(val)
            || (method === "update" && valid_quantityForLimitedQuantity(val, originData.limitedAmount));
        break;
      case 'status':
        errors[key] = valid_isEmpty(val);
        break;
    }
  }
  // console.log('Valid Result (formValues) : ', errors);
  return errors;
};


const isTheSameDateTime = (dt1: string, dt2: string): boolean => dt1 === dt2;
