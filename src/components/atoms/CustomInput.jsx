import React, { useState, useEffect } from 'react';
import Icon_Checked from '/public/img/icon/icon_checked.svg';
import s from './customInput.module.scss';

const CustomInput = ({
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
  option={label:'플랜 선택'},
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    if(initialize){
      setIsChecked(false);
      setSelectedRadio(false);
      if (setSelectedCheckbox && typeof setSelectedCheckbox === 'function') setSelectedCheckbox([]);
    }
  }, [type, setSelectedRadio, setSelectedCheckbox, initialize]);

  const onCheckboxInputHandler = (e) => {
    setIsChecked(!isChecked);// checkbox 활성화
    if (setSelectedCheckbox && typeof setSelectedCheckbox === 'function') {
      const { id } = e.currentTarget;
      const curState = { label: id, value: !isChecked };

      setSelectedCheckbox((prevState) => {
        return {
          ...prevState,
          [curState.label]: curState.value,
        };
      });
    }
  };

  const onRadioInputHandler = (e) => {
    const { id } = e.currentTarget;
    setSelectedRadio(id);
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
        disabled={disabled}
        onChange={onCheckboxInputHandler}
        name={name}
      />
    );
  };

  const Input = () => {
    return (
      <>
        {type === 'radio' && <InputRadio />}
        {type === 'checkbox' && <InputCheckbox />}
        <span className={s.fake_checkbox}>
          {(isChecked || selectedRadio === id )? '선택됨' : option.label}
          <i className={s.icon_checked}>
            <Icon_Checked />
          </i>
        </span>
      </>
    );
  };

  return (
    <>
      <label
        htmlFor={id}
        data-id={id}
        className={`${s.custom_input_wrapper} ${isChecked && s.checked} ${
          selectedRadio === id && s.checked
        }`}
        style={{backgroundColor:backgroundColor}}
        {...props}
      >
        <div className={s.custom_input_cont}>{children}</div>
        <Input />
      </label>
    </>
  );
};

export default CustomInput;
