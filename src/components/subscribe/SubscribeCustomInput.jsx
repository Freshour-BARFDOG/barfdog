import React, { useState, useEffect } from 'react';
import Icon_Checked from '/public/img/icon/icon_checked.svg';
import s from './subscribeCustomInput.module.scss';

export const SubscribeCustomInput = ({
  children,
  id,
  type,
  name,
  selectedRadio,
  setSelectedRadio,
  selectedCheckbox,
  setSelectedCheckbox,
  disabled,
  initialize,
  backgroundColor,
  option = { label: '플랜 선택' },
  ...props
}) => {
  
  let initialChecked = setInitCheckboxValue(selectedCheckbox, id);
  const [isChecked, setIsChecked] = useState(initialChecked || false); //
  
  // useEffect(() => {
  //   // value 초기화
  //   if (initialize) {
  //     setIsChecked(false);
  //     setSelectedRadio(false);
  //     if (setSelectedCheckbox && typeof setSelectedCheckbox === 'function') setSelectedCheckbox(null);
  //   }
  // }, [type, initialize]);

  
  const onCheckboxInputHandler = (e, labelId) => {
    setIsChecked(!isChecked); // checkbox 활성화
    const { id } = e.currentTarget;
    const curState = { label: labelId || id, value: !isChecked };

    setSelectedCheckbox((prevState) => {
      return {
        ...prevState,
        [curState.label]: curState.value,
      };
    });
  };

  const onRadioInputHandler = (e, labelId) => {
    const { id } = e.currentTarget;
    setSelectedRadio(labelId || id);
  };

  const InputRadio = () => {
    return (
      <input
        id={id}
        type="radio"
        name={name}
        onChange={onRadioInputHandler}
        value={selectedRadio === id}
        checked={selectedRadio === id}
      />
    );
  };

  const InputCheckbox = () => {
    return (
      <input
        id={id}
        type="checkbox"
        value={isChecked}
        onChange={onCheckboxInputHandler}
        name={name}
      />
    );
  };

  const Input = () => {
    return (
      <>
        {/* {type === 'radio' && <InputRadio />} */}
        {type === 'radio' && <InputCheckbox />}
        {type === 'checkbox' && <InputCheckbox />}
        <span className={s.fake_checkbox}>
          {isChecked || selectedRadio === id ? '선택됨' : option.label}
          <i className={s.icon_checked}>
            <Icon_Checked />
          </i>
        </span>
      </>
    );
  };

  const onLabelClick = (e) => {
    // CUSTOM FUNCTION (block browser auto focus)
    // : swiper 내에서 input selected됐을 경우, selecgted Input에 auto focusing blocking하기 위함
    e.preventDefault();
    const disabled = e.currentTarget.dataset.disabled === 'true'; // ! String 으로 입력됨 true / false값
    if (disabled) return console.error('NOTICE: disabled Element');

    const id = e.currentTarget.dataset.id;
    if (type === 'checkbox') {
      onCheckboxInputHandler(e, id);
    } else {
      onRadioInputHandler(e, id);
    }
  };

  return (
    <label
      htmlFor={id}
      data-id={id}
      data-disabled={disabled}
      className={`${s.custom_input_wrapper} ${isChecked && s.checked} ${
        selectedRadio === id && s.checked
      }`}
      style={{ backgroundColor: backgroundColor }}
      {...props}
      onClick={onLabelClick}
    >
      <div className={s.custom_input_cont}>{children}</div>
      <Input />
    </label>
  );
};



const setInitCheckboxValue = (checkboxValueObj, checkboxId)=>{
  let checked;
  if(checkboxValueObj && typeof checkboxValueObj === 'object'){
    // 유저가 FULL PLAN & 2개 이상 recipe을 구독중인 경우의 initial value
    Object.entries(checkboxValueObj).forEach((arr)=>{
      const key = arr[0];
      const val = arr[1];
      // // console.log(key, val, checkboxId)
      if(key.indexOf(checkboxId) >= 0 && val === true ){
        return checked = true;
      }
    })
  }
  return checked;
}
