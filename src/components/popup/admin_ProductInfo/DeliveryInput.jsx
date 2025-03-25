import React, { useEffect, useState } from 'react';
import s from '/styles/legacy/signup.module.scss';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_date from '/util/func/filter_date';
const DeliveryInput = ({
  type,
  required,
  id,
  formValue,
  setFormValues,
  setFormErrors,
  title,
  children,
  addedClassName,
  disabled,
  placeholder,
  errorMessage,
  filteredType,
  icon,
  inputref,
  addressStreet,
  ...props
}) => {
  const initialValue = formValue || '';
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (!value && inputref?.current) {
      inputref.current.focus();
    }
  }, [value]);

  // useEffect(()=>{
  //   if(type === 'date'){
  //     setValue('1990-02-28')
  //   }
  //
  //
  // },[])
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

    if (id === 'email') {
      // 이메일 변경 감지 추가 (230509)
      setFormErrors((prev) => ({
        ...prev,
        isEmailDuplicated: '이메일 중복확인이 필요합니다.',
      }));
    }
    setValue(filteredValue);
    if (setFormValues && typeof setFormValues === 'function') {
      filteredType === 'date' && (filteredValue = filter_date(filteredValue));

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
      // // console.log('className: ',list)
      if (!list) return;
      return (classNameList += ` ${s[list]} `);
    });
    return classNameList;
  };

  return (
    <>
      <div className={s['join__wrap']}>
        <div className={`${s['input-cont-wrap']} ${addedClassNameList()}`}>
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
              ref={inputref}
              autoComplete="off"
              {...props}
            />
            {icon && icon}
            {id === 'name' && (!value || value === '') && errorMessage}
            {id !== 'address' && id !== 'name' ? errorMessage : ''}
          </div>
          {children}
          {id === 'address' && !addressStreet ? errorMessage : ''}
        </div>
      </div>
    </>
  );
};

export default DeliveryInput;
