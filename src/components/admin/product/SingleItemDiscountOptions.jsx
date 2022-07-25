import React, { useEffect, useState } from 'react';
import s from './singleItemDiscountOptions.module.scss';
import UnitBox from '/src/components/atoms/UnitBox';
import calculateSalePrice from '/util/func/calculateSalePrice';
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import transformClearLocalCurrency from "/util/func/transformClearLocalCurrency";
import {discountUnitType} from "/store/TYPE/discountUnitType";




const unitSettings = [
  { label: '%', value: discountUnitType.FIXED_RATE },
  { label: '원', value: discountUnitType.FLAT_RATE },
]


export default function SingleItemDiscountOptions({id,  formValues, setFormValues, formErrors, onChange }) {


  
  const initialValue = {
    salePrice : formValues?.salePrice || formValues?.originalPrice || 0,
    saleAmount: 0
  }
  const [salePriceInfo, setSalePriceInfo] = useState(initialValue);



  // console.log(formValues)

  useEffect(() => {
    // discountType 이 퍼센트면 dgree를 100으로 반환해서 계산한다.
    let filteredDiscountDegree = formValues.discountDegree ;
    if(formValues.discountType === discountUnitType.FIXED_RATE &&transformClearLocalCurrency(formValues.discountDegree)  > 100){
      filteredDiscountDegree = 100;
    }
    // console.log(filteredDiscountDegree)
    const result = calculateSalePrice(
      formValues.originalPrice,
      formValues.discountType,
      filteredDiscountDegree,
    );

    const resultObj = {
      salePrice: !result ? formValues.originalPrice : result.salePrice, // 할인적용이 안됐을 경우, 원금이랑 동일하게 처리한다.
      saleAmount: result?.saleAmount
    }
    setSalePriceInfo(resultObj);
    setFormValues(prevState => ({
      ...prevState,
      [id]: resultObj.salePrice,
    }))
  }, [formValues.originalPrice, formValues.discountDegree, formValues.discountType]);



  return (
    <>
      <div className="inp_box">
        <input
          id={'discountDegree'}
          type="text"
          className={'text-align-right'}
          data-input-type={`currency, number, ${
            formValues.discountType === discountUnitType.FIXED_RATE && 'discountPercent'
          }`}
          value={formValues.discountDegree || 0}
          onChange={onChange}
        />
        {formErrors?.discountDegree && (
          <ErrorMessage>{formErrors?.discountDegree}</ErrorMessage>
        )}
        <UnitBox
          name={'discountType'}
          setValue={setFormValues}
          unitList={unitSettings}
          value={formValues.discountType}
        />
        <div className="unit">할인</div>
      </div>
      <div className={s.calculator}>
        <span className={s.title}>최종가격</span>
        <span className={s.discountPrice}>
          <b>{salePriceInfo?.salePrice}</b>
          <em className="unit">원</em>
        </span>
        <span className={s.discountAmount}>
          (할인<em>{salePriceInfo?.saleAmount}</em>원)
        </span>
      </div>
      {formErrors?.salePrice && (
        <ErrorMessage>{formErrors?.salePrice}</ErrorMessage>
      )}
    </>
  );
}

