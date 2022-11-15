import React from 'react';
import s from './couponSettingInput.module.scss';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_extraIntegerNumberZero from '/util/func/filter_extraIntegerNumberZero';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';

const AutoPublishedCouponSettingInput = ({
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
    eventHandler(input, value);
    
  };
  
  const eventHandler = (input, value) => {
    const id = Number(input.dataset.id);
    const innerId = input.dataset.innerId;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;
    filteredValue = filter_emptyValue(value);
    filteredValue = filter_onlyNumber(filteredValue);
    filteredValue = transformClearLocalCurrency(filteredValue) > '100' ? '100' : filteredValue;
    filteredValue = filter_extraIntegerNumberZero(filteredValue);
    // ! 소수점 적용을 위해, Number변환은 해당 component에서 진행하지 않음
    
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
      return nextState;
    });
  }
  
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
              id={`${id}`}
              type="text"
              data-align={'right'}
              data-input-type={'number, percent'}
              value={formValues.filter(item=>item.id === id)[0][innerId[0]] || '0'}
              onChange={onInputChangeHandler}
            />
            <em className="unit">%</em>
            {formErrors.filter(item=>item.id === id)[0] && formErrors.filter(item=>item.id === id)[0][innerId[0]] && <ErrorMessage>{formErrors.filter(item=>item.id === id)[0][innerId[0]]}</ErrorMessage>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoPublishedCouponSettingInput;
