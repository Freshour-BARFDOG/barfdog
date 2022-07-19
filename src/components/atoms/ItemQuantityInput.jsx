import React, {useEffect, useState} from 'react';
import s from './itemQuantityInput.module.scss'
export const ItemQuantityInput = ({id, value, setFormValues, limitedQuantity, ...props}) => {
  
  const initialValue = value || 0
  const [quantity, setQuantity] = useState( initialValue );
  useEffect( () => {
    if(setFormValues && typeof setFormValues ==='function'){
      setFormValues(prevState => ({
        ...prevState,
        [id] : quantity
      }))
    }
    
  }, [quantity] );
  
  const onClickHandler = (e)=>{
    const btn = e.currentTarget;
    const numType = btn.dataset.numType;
    setQuantity(prevNum =>{
      if(numType === 'negative' &&  prevNum === 0) return 0;
      if(typeof limitedQuantity === 'number'&& numType === 'positive' && prevNum >= limitedQuantity){
        console.error('제한수량을 초과했습니다.');
        return prevNum;
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