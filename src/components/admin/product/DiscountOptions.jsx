import { useEffect, useMemo } from 'react';
import s from './discountOptions.module.scss';
import UnitBox from '/src/components/atoms/UnitBox';
import calculateSalePrice from '/util/func/calculateSalePrice';
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import transformClearLocalCurrency from "/util/func/transformClearLocalCurrency";
import { discountUnitType } from "/store/TYPE/discountUnitType";

const unitSettings = [
  { label: '%', value: discountUnitType.FIXED_RATE },
  { label: '원', value: discountUnitType.FLAT_RATE },
]

export default function DiscountOptions({
  id, // 일반 할인의 경우 'salePrice', 제휴사 할인의 경우 제휴사 코드
  targetKey = 'general', // 'general, alliance'
  formValues,
  setFormValues,
  formErrors,
  originalPrice = 0,
}) {
  const baseOriginalPrice = targetKey === 'general' ? formValues.originalPrice : originalPrice;

  const filteredDiscountDegree = useMemo(() => {
    const degree = transformClearLocalCurrency(formValues.discountDegree) || 0;
    return formValues.discountType === discountUnitType.FIXED_RATE && degree > 100 ? 100 : degree;
  }, [formValues.discountDegree, formValues.discountType]);

  const salePriceInfo = useMemo(() => {
    return calculateSalePrice(baseOriginalPrice, formValues.discountType, filteredDiscountDegree) || {
      salePrice: baseOriginalPrice,
      saleAmount: 0,
    }
  }, [baseOriginalPrice, formValues.discountType, filteredDiscountDegree]);

  useEffect(() => {
    if (filteredDiscountDegree === 100) {
        setFormValues({ ...formValues, discountDegree: filteredDiscountDegree })
    }
  }, [filteredDiscountDegree])

  useEffect(() => {
    if (salePriceInfo.salePrice) {
      setFormValues({ ...formValues, salePrice: salePriceInfo.salePrice })
    }
  }, [salePriceInfo.salePrice])

  return (
    <>
      <div className="inp_box">
        <input
          id={`${targetKey}-discountDegree-${id}`}
          type="text"
          pattern="\d*"
          inputMode="numeric"
          className='text-align-right'
          value={formValues.discountDegree}
          onChange={(e) => setFormValues({ ...formValues, discountDegree: e.target.value })}
        />
        {formErrors?.discountDegree && (
          <ErrorMessage>{formErrors?.discountDegree}</ErrorMessage>
        )}
        <UnitBox
          name='discountType'
          setValue={(value) => setFormValues({ ...formValues, discountType: value })}
          unitList={unitSettings}
          value={formValues.discountType || unitSettings[0].value}
          isDiscountAlliance
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

