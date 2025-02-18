import s from '../../pages/order/ordersheet/ordersheet.module.scss';
import React, {useEffect, useState} from 'react';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import ErrorMessage from '../atoms/ErrorMessage';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import {calcOrderSheetPrices} from "./calcOrderSheetPrices";
import {IAMPORT_MIN_PAYMENT_PRICE} from "/store/TYPE/order/priceType";

export const OrdersheetReward = ({ id, info, form, setForm, formErrors, setFormErrors, orderType='general', hasAllianceDiscount }) => {
  // 첫 정기구독 50% 할인 적용 검증
  const hasAllianceSubscribeDiscount = hasAllianceDiscount && info.newSubscribe;
  const calcResult = calcOrderSheetPrices(
    form,
    orderType,
    {deliveryFreeConditionPrice: info.freeCondition},
    orderType === 'general' ? hasAllianceDiscount : hasAllianceSubscribeDiscount
  );
  useEffect( () => {

    const usedReward = Number(form[id]);

    const availableMaxDiscount = calcResult?.availableMaxDiscount.reward;
    const overDiscount = calcResult?.overDiscount;
    const userTotalReward = info.reward;

    let error= "";
    if (form.paymentPrice !== 0) {
      if ( usedReward && userTotalReward === 0 ) {
        error = "사용가능한 적립금이 없습니다."
      } else if (overDiscount) {
        error = `최소 결제금액(${IAMPORT_MIN_PAYMENT_PRICE}원) 이상의 적립금 할인을 적용할 수 없습니다.`;
      } else if(usedReward > userTotalReward) {
        error ="보유 적립금을 초과하여 사용할 수 없습니다.";
      }
    }


    if ( error ) {
      alert( error );
      setForm((prevState) => ({
        ...prevState,
        [id]: 0,
      }));
    } else {
      error = "";
    }


    setFormErrors(prevState=>({
        ...prevState,
        [id] : error
      })
    );
    // // console.log("* rewardDiscount: ", form[id], "\n* availableMaxReward: ",availableMaxReward, "\nhasRewardValue: ", hasRewardValue) ;

  }, [form[id]] );

  const onChangeRewardHandler = (e) => {
    const { value } = e.currentTarget;
    let enteredReward = filter_emptyValue(value);
    enteredReward = filter_onlyNumber(enteredReward);

    setForm((prevState) => ({
      ...prevState,
      [id]: enteredReward,
    }));

  };

  const onClickDisCountReward = () => {
    const discountAmount = calcResult?.availableMaxDiscount.reward;
    const isReset = discountAmount === form.discountReward;
    setForm((prevState) => ({
      ...prevState,
      [id]: isReset ? 0 : discountAmount > 0 ? discountAmount : 0,
    }));
  };


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
                value={transformLocalCurrency(form.discountReward) || 0}
                onChange={onChangeRewardHandler}
              />
              {formErrors.discountReward && <ErrorMessage>{formErrors.discountReward}</ErrorMessage>}
            </div>
            <button type={'button'} className={s.btn_box} onClick={onClickDisCountReward}>
              모두 사용
            </button>
            <span className={s.point}>
              <p>보유 적립금</p> {transformLocalCurrency(info.reward)+' P'}
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
