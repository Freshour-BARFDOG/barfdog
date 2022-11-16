import React from 'react';
import s from './couponSettingInput.module.scss';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_extraIntegerNumberZero from '/util/func/filter_extraIntegerNumberZero';
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

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const value = input.value;
    const id = Number(input.dataset.id);
    
    let filteredValue = filter_emptyValue(value);
    filteredValue = filter_onlyNumber(filteredValue);
    filteredValue = filter_extraIntegerNumberZero(filteredValue);
    filteredValue = Number(filteredValue);

    setFormValues((items) => {
      const nextItems = items.map((itemObj) => {
        if (itemObj.id === id) {
          const key = input.dataset.innerId;
          return {
            ...itemObj,
            [key]: filteredValue,
          };
        } else {
          return itemObj;
        }
      });
      return nextItems;
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
              value={transformLocalCurrency(formValues.filter(item=>item.id === id)[0][innerId[0]]) || ''}
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
              value={transformLocalCurrency(formValues.filter(item=>item.id === id)[0][innerId[1]]) || ''}
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
