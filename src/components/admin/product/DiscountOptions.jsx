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

// id: 일반 할인의 경우 'salePrice', 제휴사 할인의 경우 제휴사 id
const DiscountOptions = ({
  id,
  targetKey = 'general',
  formValues,
  setFormValues,
  formErrors,
  originalPrice = 0,
  discountDegreeName,
  discountTypeName,
  salePriceName,
}) => {
  const baseOriginalPrice = targetKey === 'general' ? formValues.originalPrice : originalPrice;

  // discountType 에 따라 할인율 가공 적용
  const filteredDiscountDegree = useMemo(() => {
    const degree = transformClearLocalCurrency(formValues[discountDegreeName]) || 0;
    return formValues?.[discountTypeName] === discountUnitType.FIXED_RATE && degree > 100 ? 100 : degree;
  }, [formValues?.[discountDegreeName], formValues?.[discountTypeName]]);

  // 가공 적용된 할인율로 계산된 최종 할인 계산 금액
  const salePriceInfo = useMemo(() => {
    return calculateSalePrice(baseOriginalPrice, formValues?.[discountTypeName], filteredDiscountDegree) || {
      salePrice: baseOriginalPrice,
      saleAmount: 0,
    }
  }, [baseOriginalPrice, formValues?.[discountTypeName], filteredDiscountDegree]);

  // FIX_RATE(%)으로 discountType 전환시 최대 금액 검증 및 적용(100%) 및
  // discountType, discountDegree 의 상태값이 바뀔 경우 이에 맞는 최종 할인 계산 금액 적용
  useEffect(() => {
    if (salePriceInfo.salePrice) {
      setFormValues({ ...formValues, [salePriceName]: salePriceInfo.salePrice, [discountDegreeName]: String(filteredDiscountDegree) })
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
          value={formValues[discountDegreeName]}
          onChange={(e) =>
            setFormValues({
              ...formValues,
              [discountDegreeName]:
                formValues?.[discountTypeName] === discountUnitType.FIXED_RATE && e.target.value > 100
                ? 100
                : e.target.value === '' ? 0 : e.target.value
            })
          }
        />
        {formErrors?.[discountDegreeName] && (
          <ErrorMessage>{formErrors?.[discountDegreeName]}</ErrorMessage>
        )}
        <UnitBox
          name={discountTypeName}
          setValue={(value) =>
            setFormValues({
              ...formValues,
              [discountTypeName]: value,
              [discountDegreeName]:
                formValues?.[discountTypeName] === discountUnitType.FIXED_RATE && Number(formValues?.[discountDegreeName]) > 100
                  ? 100
                  : formValues?.[discountDegreeName]
            })
          }
          unitList={unitSettings}
          value={formValues?.[discountTypeName] || unitSettings[0].value}
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

export default DiscountOptions;

