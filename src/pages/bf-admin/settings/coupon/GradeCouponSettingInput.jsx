import React from 'react';
import s from './couponSettingInput.module.scss';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_numberZeoFromTheIntegerPartOfTheDecimal from '/util/func/filter_numberZeoFromTheIntegerPartOfTheDecimal';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';


const GradeCouponSettingInput = ({ label, id, type, name, formValues, setFormValues, formErrors }) => {
  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const value = input.value;
    const grade = input.id.split('-')[0];
    const id = input.id.split('-')[1];
    const filteredType = input.dataset.inputType;
    let filteredValue = value;

    if (filteredType) {
      filteredValue = filter_emptyValue(value);
    }

    if (filteredType && filteredType.indexOf('number') >= 0) {
      filteredValue = filter_onlyNumber(filteredValue);
    }

    if (filteredType && filteredType.indexOf('currency') >= 0) {
      filteredValue = transformLocalCurrency(filteredValue);
    }

    if (filteredType && filteredType.indexOf('percent') >= 0) {
      filteredValue = transformClearLocalCurrency(filteredValue) > '100' ? '100' : filteredValue;
      // - MEMO 100 : string이어야함.
    }

    filteredValue = filter_numberZeoFromTheIntegerPartOfTheDecimal(filteredValue);

    setFormValues((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        [grade]: {
          ...prevState[name][grade],
          [id]: filteredValue
        },
      },
    }));
  };
  return (
    <div className={`cont_divider ${s.cont_divider}`}>
      <div className="input_row">
        <div className="title_section fixedHeight">
          <label className="title" htmlFor={`${id}-${type[0]}`}>
            {label}
          </label>
        </div>
        <div className="inp_section">
          <div className={`inp_box`}>
            <input
              id={`${id}-${type[0]}`}
              type="text"
              name={name}
              data-align={'right'}
              data-input-type={'number, currency'}
              value={formValues[name][id][type[0]] || ''}
              onChange={onInputChangeHandler}
            />
            <em className="unit">원 할인</em>
            {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
            <input
              id={`${id}-${type[1]}`}
              type="text"
              name={name}
              data-align={'right'}
              data-input-type={'number, currency'}
              value={formValues[name][id][type[1]] || ''}
              onChange={onInputChangeHandler}
            />
            <em className="unit">원 결제 시</em>
            {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeCouponSettingInput;
