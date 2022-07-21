import React from 'react';
import s from './couponSettingInput.module.scss';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_extraIntegerNumberZeo from '/util/func/filter_extraIntegerNumberZeo';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';

const GradeCouponSettingInput = ({
  label,
  id,
  innerId,
  index,
  formValues,
  setFormValues,
  formErrors,
}) => {
  // console.log(formValues);
  // console.log(formErrors[index])

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const value = input.value;
    const id = Number(input.dataset.id);
    const innerId = input.dataset.innerId;
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

    filteredValue = filter_extraIntegerNumberZeo(filteredValue);

    setFormValues((items) => {
      const nextState = items.map((itemObj) => {
        let tempObj = {};
        if (itemObj.id === id) {
          tempObj = {
            ...itemObj,
            [innerId]: filteredValue,
          };
        } else {
          tempObj = itemObj;
        }
        return tempObj;
      });
      console.log(nextState);

      return nextState;
    });
  };

  return (
    <div className={`cont_divider`}>
      <div className={`${s['input_row']} input_row`}>
        <div className="title_section fixedHeight">
          <label className="title" htmlFor={`${id}`}>
            {label}
          </label>
        </div>
        <div className={`${s.inp_section} inp_section`}>
          <div className={`${s.inp_box} inp_box`}>
            <input
              data-id={id}
              data-inner-id={innerId[0]}
              type="text"
              data-align={'right'}
              data-input-type={'number, currency'}
              id={`${id}`}
              value={formValues ? formValues[index][innerId[0]] : ''}
              onChange={onInputChangeHandler}
            />
            <em className="unit">원 할인</em>
            {formErrors && formErrors[index] && formErrors[index][innerId[0]] && (
              <ErrorMessage>{formErrors[index][innerId[0]]}</ErrorMessage>
            )}
          </div>
          <div className={`${s.inp_box} inp_box`}>
            <input
              data-id={id}
              data-inner-id={innerId[1]}
              type="text"
              data-align={'right'}
              data-input-type={'number, currency'}
              value={formValues[index][innerId[1]] || ''}
              onChange={onInputChangeHandler}
            />
            <em className="unit">원 이상 결제 시</em>
            {formErrors && formErrors[index] && formErrors[index][innerId[1]] && (
              <ErrorMessage>{formErrors[index] && formErrors[index][innerId[1]]}</ErrorMessage>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeCouponSettingInput;
