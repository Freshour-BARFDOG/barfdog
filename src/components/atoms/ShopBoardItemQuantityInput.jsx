import React, { useEffect, useState } from 'react';
import s from './itemQuantityInput.module.scss';
export const ShopBoardItemQuantityInput = ({
  id,
  value,
  setFormValues,
  maxQuantity,
  minQuantity,
  onChange,
  optionDataList,
  ...props
}) => {
  const [quantity, setQuantity] = useState(0);

  // 초기화해서 value 값으로 설정되게
  useEffect(() => {
    setQuantity(0);
  }, [value]);

  const onClickHandler = (e) => {
    const btn = e.currentTarget;
    const numType = btn.dataset.numType;
    let newValue = value;
    if (numType === 'negative' && value === 0) {
      newValue = 0;
      return;
    }
    if (
      typeof minQuantity === 'number' &&
      minQuantity > 0 &&
      numType === 'negative' &&
      value <= minQuantity
    ) {
      console.error('최소수량에 도달했습니다.');
      newValue = minQuantity;
      return;
    }
    if (
      typeof maxQuantity === 'number' &&
      numType === 'positive' &&
      value >= maxQuantity
    ) {
      console.error('제한수량을 초과했습니다.');
      newValue = maxQuantity;
      return;
    }
    newValue = numType === 'positive' ? value + 1 : value - 1;
    setQuantity(newValue);

    if (onChange && typeof onChange === 'function') {
      onChange(id, newValue);
    }

    if (setFormValues && typeof setFormValues === 'function') {
      setFormValues((prevState) => ({
        ...prevState,
        [id]: newValue,
      }));
    }
  };

  // console.log('value___', value);
  // console.log('quantity___', quantity);

  return (
    <div className={`${s['input-wrap']}`} {...props}>
      <button
        type={'button'}
        data-num-type={'negative'}
        onClick={onClickHandler}
      >
        <em className={s.unit}>-</em>
      </button>
      <input
        type="text"
        id="count"
        placeholder="0"
        readOnly
        disabled
        value={quantity || value}
      />
      <button
        type={'button'}
        data-num-type={'positive'}
        onClick={onClickHandler}
      >
        <em className={s.unit}>+</em>
      </button>
    </div>
  );
};
