import React, {useEffect, useState} from 'react';
import s from './itemQuantityInput.module.scss'
export const ItemQuantityInput = ({id, value, setFormValues, maxQuantity, minQuantity, onChange, ...props}) => {
  
  let initialValue = value || 0; // 얘가 있다면=> value // 얘가 없다면
  if(typeof minQuantity === 'number' && minQuantity > 0 && value < minQuantity){
    // initialValue = minQuantity;
  }
  const [quantity, setQuantity] = useState( initialValue );
  useEffect( () => {
    if(setFormValues && typeof setFormValues ==='function'){
      setFormValues(prevState => ({
        ...prevState,
        [id] : quantity
      }))
    }
    if(onChange && typeof onChange ==='function'){
      onChange( id , quantity)
    }
  }, [quantity] );
  
  const onClickHandler = (e)=>{
    const btn = e.currentTarget;
    const numType = btn.dataset.numType;
    setQuantity(prevNum =>{
      if(numType === 'negative' &&  prevNum === 0) return 0;
      if( typeof minQuantity == 'number'  && minQuantity > 0 && numType === 'negative' &&  prevNum <= minQuantity) {
        console.error('최소수량에 도달했습니다.')
        return minQuantity;
      }
      if(typeof maxQuantity === 'number'&& numType === 'positive' && prevNum >= maxQuantity){
        console.error('제한수량을 초과했습니다.');
        return maxQuantity;
      }
      return numType === 'positive' ? ++prevNum : --prevNum;
    })
  }
  
  return (
    <div className={`${s['input-wrap']}`} {...props}>
      <button type={'button'} data-num-type={'negative'} onClick={onClickHandler}><em className={s.unit}>-</em></button>
      <input type="text" id="count" placeholder="0" readOnly disabled value={quantity}/>
      <button type={'button'} data-num-type={'positive'} onClick={onClickHandler}><em className={s.unit}>+</em></button>
    </div>
  );
};