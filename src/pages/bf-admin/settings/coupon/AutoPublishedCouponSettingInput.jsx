import React from 'react';
import s from './couponSettingInput.module.scss';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_numberZeoFromTheIntegerPartOfTheDecimal from '/util/func/filter_numberZeoFromTheIntegerPartOfTheDecimal';
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import transformClearLocalCurrency from "/util/func/transformClearLocalCurrency";




const AutoPublishedCouponSettingInput = ({
  label,
  id,
  name,
  formValues,
  setFormValues,
  formErrors,
}) => {

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
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
        [id]: filteredValue
      },
    }));
  };
  return (
    <div className="cont_divider">
      <div className="input_row">
        <div className="title_section fixedHeight">
          <label className="title" htmlFor={`${id}`}>
            {label}
          </label>
        </div>
        <div className="inp_section">
          <div className={`inp_box`}>
            <input
              id={`${id}`}
              type="text"
              name={name}
              data-align={'right'}
              data-input-type={'number, percent'}
              value={formValues[name][id] || ''}
              onChange={onInputChangeHandler}
            />
            <em className="unit">%</em>
            {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoPublishedCouponSettingInput;
