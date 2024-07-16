import React, { useState, useEffect } from 'react';
import Icon_Checked from '/public/img/icon/icon_checked.svg';
import s from './surveyPlanInput.module.scss';

const SurveyPlanInput = ({
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
  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    if (initialize) {
      setIsChecked(false);
      setSelectedRadio(false);
      if (setSelectedCheckbox && typeof setSelectedCheckbox === 'function')
        setSelectedCheckbox([]);
    }
  }, [type, setSelectedRadio, setSelectedCheckbox, initialize]);

  const onRadioInputHandler = (e) => {
    const { id } = e.currentTarget;
    setSelectedRadio(id);
  };

  return (
    <>
      <label
        htmlFor={id}
        data-id={id}
        className={`${s.custom_input_wrapper} ${isChecked && s.checked} ${
          selectedRadio === id && s.checked
        }`}
        style={{ backgroundColor: backgroundColor }}
        {...props}
      >
        <div className={s.custom_input_cont}>{children}</div>
        <input
          id={id}
          type="radio"
          name={name}
          onChange={onRadioInputHandler}
          className={s.hidden_input}
          value={selectedRadio === id}
          checked={selectedRadio === id}
        />
      </label>
    </>
  );
};

export default SurveyPlanInput;
