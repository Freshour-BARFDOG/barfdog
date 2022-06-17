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
  dependency,
  backgroundColor,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // console.log("초기화 실행");
    setIsChecked(false);
    setSelectedRadio(false);
    if (setSelectedCheckbox && typeof setSelectedCheckbox === 'function') setSelectedCheckbox([]);
  }, [dependency, setSelectedRadio, setSelectedCheckbox, initialize]);

  const onCheckboxInputHandler = (e) => {
    setIsChecked(!isChecked);
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

  const CustomInputByType = () => {
    return (
      <>
        {type === 'radio' && <InputRadio />}
        {type === 'checkbox' && <InputCheckbox />}
        <span className={s.fake_checkbox}>
          {isChecked || selectedRadio === id ? '선택됨' : '플랜선택'}
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
        <CustomInputByType />
      </label>
    </>
  );
};

export default CustomInput;
