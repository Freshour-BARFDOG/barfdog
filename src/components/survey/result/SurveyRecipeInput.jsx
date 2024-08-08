import React, { useState, useEffect } from 'react';
import Icon_Checked from '/public/img/icon/icon_checked.svg';
import s from './surveyRecipeInput.module.scss';
import Image from 'next/image';

export const SurveyRecipeInput = ({
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

  // console.log(selectedCheckbox, id);
  // console.log(isChecked);

  const onCheckboxInputHandler = (e, labelId) => {
    const selectedCount =
      Object.values(selectedCheckbox).filter(Boolean).length;
    if (!isChecked && selectedCount >= 2) {
      alert('최대 2개의 레시피만 선택 가능합니다.');
      return;
    }

    setIsChecked(!isChecked); // checkbox 활성화
    const { id } = e.currentTarget;
    const curState = { label: labelId || id, value: !isChecked };

    setSelectedCheckbox((prevState) => {
      const newState = {
        ...prevState,
        [curState.label]: curState.value,
      };

      if (!curState.value) {
        delete newState[curState.label];
      }

      return newState;
    });
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

  const onLabelClick = (e) => {
    // CUSTOM FUNCTION (block browser auto focus)
    // : swiper 내에서 input selected됐을 경우, selecgted Input에 auto focusing blocking하기 위함
    e.preventDefault();

    if (e.target.closest('a')) {
      return;
    }

    const disabled = e.currentTarget.dataset.disabled === 'true'; // ! String 으로 입력됨 true / false값
    if (disabled) return console.error('NOTICE: disabled Element');

    const id = e.currentTarget.dataset.id;
    onCheckboxInputHandler(e, id);
  };

  return (
    <label
      htmlFor={id}
      data-id={id}
      data-disabled={disabled}
      className={`${s.custom_input_wrapper} ${isChecked && s.checked} ${
        selectedCheckbox[id] && s.checked
      }`}
      style={{ backgroundColor: backgroundColor }}
      {...props}
      onClick={onLabelClick}
    >
      {selectedCheckbox[id] && (
        <div className={s.icon_check_wrap}>
          <Image
            src="/img/icon/main-check.svg"
            alt="store"
            width={100}
            height={100}
            className={s.check_icon}
          />
        </div>
      )}

      <div className={s.custom_input_cont}>{children}</div>
      <div
        className={`${s.img_wrap} ${
          selectedCheckbox[id] && s.checked ? s.clicked : ''
        }`}
      ></div>
      {/* <Input /> */}
    </label>
  );
};

const setInitCheckboxValue = (checkboxValueObj, checkboxId) => {
  let checked;
  if (checkboxValueObj && typeof checkboxValueObj === 'object') {
    // 유저가 FULL PLAN & 2개 이상 recipe을 구독중인 경우의 initial value
    Object.entries(checkboxValueObj).forEach((arr) => {
      const key = arr[0];
      const val = arr[1];
      // // console.log(key, val, checkboxId)
      if (key.indexOf(checkboxId) >= 0 && val === true) {
        return (checked = true);
      }
    });
  }
  return checked;
};
