import React, { useEffect, useState } from 'react';
import s from './singleItemDiscountOptions.module.scss';
import UnitBox from '/src/components/atoms/UnitBox';
import calculateSalePrice from '/util/func/calculateSalePrice';
import ErrorMessage from "/src/components/atoms/ErrorMessage";





export default function SingleItemDiscountOptions({id,  formValues, setFormValues, formErrors, onChange }) {


  const [salePriceInfo, setSalePriceInfo] = useState({});

  const unitSettings = [
    { label: '%', value: 'FLAT_RATE' },
    { label: '원', value: 'FIXED_RATE' },
  ]


  useEffect(() => {
    const result = calculateSalePrice(
      formValues.originalPrice,
      formValues.discountType,
      formValues.discountDegree,
    );

    const resultObj = {
      salePrice: result?.salePrice,
      saleAmount: result?.saleAmount
    }
    setSalePriceInfo(resultObj);
    setFormValues(prevState => ({
      ...prevState,
      [id]: resultObj.salePrice,
    }))
  }, [formValues.originalPrice, formValues.discountDegree]);


  useEffect(() => {
    setFormValues(prevState => ({
      ...prevState,
      discountDegree: 0, // 할인타입 변경했을 경우, 초기화
    }))
  }, [formValues.discountType]);


  return (
    <>
      <div className="inp_box">
        <input
          id={'discountDegree'}
          type="text"
          className={'text-align-right'}
          data-input-type={`currency, number, ${
            formValues.discountType === 'FLAT_RATE' && 'discountPercent'
          }`}
          value={formValues.discountDegree || '0'}
          onChange={onChange}
        />
        {formErrors.discountDegree && (
          <ErrorMessage>{formErrors.discountDegree}</ErrorMessage>
        )}
        <UnitBox
          name={'discountType'}
          setValue={setFormValues}
          unitList={unitSettings}
        />
        <div className="unit">할인</div>
      </div>
      <div className={s.calculator}>
        <span className={s.title}>할인적용가</span>
        <span className={s.discountPrice}>
          <b>{salePriceInfo?.salePrice}</b>
          <em className="unit">원</em>
        </span>
        <span className={s.discountAmount}>
          (할인가<em>{salePriceInfo?.saleAmount}</em>원)
        </span>
      </div>
      {formErrors.salePrice && (
        <ErrorMessage>{formErrors.salePrice}</ErrorMessage>
      )}
    </>
  );
}

