import s from '../../pages/order/ordersheet/ordersheet.module.scss';
import React, { useState } from 'react';
import filter_emptyValue from '../../../util/func/filter_emptyValue';
import filter_onlyNumber from '../../../util/func/filter_onlyNumber';
import ErrorMessage from '../atoms/ErrorMessage';
import transformLocalCurrency from '../../../util/func/transformLocalCurrency';
import transformClearLocalCurrency from "../../../util/func/transformClearLocalCurrency";

export const OrdersheetReward = ({ id, info, form, setForm, formErrors, setFormErrors }) => {
  
  const availableMaxReward = info.reward;
  
  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;
    if (filteredType) {
      filteredValue = filter_emptyValue(value);
      if (filteredType.indexOf('number') >= 0) {
        filteredValue = filter_onlyNumber(filteredValue);
      }
    }
    if (filteredType && filteredType.indexOf('currency') >= 0) {
      filteredValue = transformLocalCurrency(filteredValue);
    }
    
    // - validation 적립금 금액이, 사용가능한 금액보다 클 경우 초기화
    if(transformClearLocalCurrency(filteredValue) > availableMaxReward){
      filteredValue = 0;
      setFormErrors(prevState=>({
        ...prevState,
        [id] : '사용가능한 포인트를 초과하였습니다.'
        })
      )
    }else{
      setFormErrors(prevState=>({
          ...prevState,
          [id] : ''
        })
      )
    }
    
    setForm((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onClickDisCountReward = () => {
    setForm((prevState) => ({
      ...prevState,
      [id]: transformLocalCurrency(availableMaxReward),
    }));
  };
  

  // console.log('FORM: ', form);
  return (
    <>
      <section className={s.reserves}>
        <div className={s.title}>적립금</div>

        <div className={s.flex_box}>
          <p>적립금사용</p>
          <div className={s.input_box}>
            <div className={s['input-wrap']}>
              <input
                id={'discountReward'}
                type={'text'}
                className={'text-align-right'}
                data-input-type={'currency, number'}
                value={form.discountReward || '0'}
                onChange={onInputChangeHandler}
              />
              {formErrors.discountReward && <ErrorMessage>{formErrors.discountReward}</ErrorMessage>}
            </div>
            <button type={'button'} className={s.btn_box} onClick={onClickDisCountReward}>
              모두 사용
            </button>
            <span className={s.point}>
              사용 가능 포인트 {transformLocalCurrency(info.reward)+' P'}
            </span>
          </div>
         
          
          
        </div>
      </section>

      <section className={s.line}>
        <hr />
      </section>
    </>
  );
};
