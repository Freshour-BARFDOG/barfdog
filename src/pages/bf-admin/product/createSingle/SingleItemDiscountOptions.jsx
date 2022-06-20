import React, { useEffect, useState } from 'react';
import s from './singleItemDiscountOptions.module.scss';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import UnitBox from '/src/components/atoms/UnitBox';
import calculateSalePrice from '/util/func/calculateSalePrice';




function SingleItemDiscountOptions({ formValues, setFormValues, onChange }) {
  const [salePriceInfo, setSalePriceInfo] = useState({});
  useEffect(() => {
    const result = calculateSalePrice(
      formValues.originalPrice,
      formValues.discountType,
      formValues.discountDegree,
    );
    setSalePriceInfo(result);
  }, [formValues.originalPrice, formValues.discountDegree]);

  return (
    <div className="inp_section">
      <div className="inp_box">
        <CustomRadio
          setValue={setFormValues}
          name="setDiscount"
          idList={['discount-FALSE', 'discount-TRUE']}
          labelList={['N', 'Y']}
          initIndex={0}
        />
      </div>
      {!formValues.discount && (
        <>
          <div className="inp_box">
            <input
              id={'discountDegree'}
              name="discountDegree"
              type="text"
              className={'text-align-right'}
              data-input-type={`currency, number, ${
                formValues.discountType === 'FLAT_RATE' && 'discountPercent'
              }`}
              value={formValues.discountDegree}
              onChange={onChange}
            />
            {/*{formErrors.name && (*/}
            {/*  <ErrorMessage>{formErrors.name}</ErrorMessage>*/}
            {/*)}*/}
            <UnitBox
              name={'discountType'}
              setValue={setFormValues}
              unitList={[
                { label: '%', value: 'FLAT_RATE' },
                { label: '원', value: 'FIXED_RATE' },
              ]}
            />
            <div className="unit">할인</div>
          </div>
          <div className={s.calculator}>
            <span className={s.title}>할인가</span>
            <span className={s.discountPrice}>
              <b>{salePriceInfo?.salePrice}</b>
              <em className="unit">원</em>
            </span>
            <span className={s.discountAmount}>
              (할인된 금액<em>{salePriceInfo?.saleAmount}</em>원)
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default SingleItemDiscountOptions;