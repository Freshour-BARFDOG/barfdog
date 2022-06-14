import React, { useState } from 'react';
import s from '/src/pages/account/signup/signup.module.scss';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_date from "/util/func/filter_date";



const SingupInput = ({
  type,
  required,
  id,
  title,
  children,
  addedClassName,
  disabled,
  placeholder,
  setFormValues,
  errorMessage,
  filteredType,
  icon,
  ...props
}) => {
  const [value, setValue] = useState('');

  const onKeyboardHandler = (e) => {
    if (e.keyCode === 13) {
      // Enter Key입력방지
      e.preventDefault();
    }
  };

  const onChangeHandler = (e) => {
    const { id, value } = e.currentTarget;
    let filteredValue = filter_emptyValue(value);
    if (filteredType === 'number') {
      filteredValue = filter_onlyNumber(filteredValue);
    }
    // console.log('id:',id,' val:',filteredValue);
    setValue(filteredValue);
    if (setFormValues && typeof setFormValues === 'function') {
      filteredType === 'date' && (filteredValue =  filter_date(filteredValue));

      setFormValues((prevState) => {
        return {
          ...prevState,
          [id]: filteredValue,
        };
      });
    }
  };

  const addedClassNameList = () => {
    let classNameList = '';
    if (!addedClassName?.length) return;

    addedClassName?.forEach((list) => {
      // console.log('className: ',list)
      if (!list) return;
      return (classNameList += ` ${s[list]} `);
    });
    return classNameList;
  };

  return (
    <>
      <div className={s['join__wrap']}>
        <div className={s['input-title-wrap']}>
          <label htmlFor={id}>
            <span className={`${s['inp-title']} ${required && s['required']}`}>{title}</span>
          </label>
        </div>
        <div className={`${s['input-cont-wrap']} ${addedClassNameList()}`}>
          {/*<div className={`${s['input-cont-wrap']} ${s[addedClassName]}`}>*/}
          <div className={s['input-wrap']}>
            <input
              type={type}
              id={id}
              name={id}
              disabled={disabled}
              placeholder={placeholder}
              onChange={onChangeHandler}
              onKeyDown={onKeyboardHandler}
              value={value}
              {...props}
            />
            {icon && icon}
            {errorMessage}
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default SingupInput;

