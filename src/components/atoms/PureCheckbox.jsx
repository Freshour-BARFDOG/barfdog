import React from 'react';
import s from "./pureCheckbox.module.scss";

const PureCheckbox = ({id, children, className, onChange, ...props}) => {


  const onChangeHandler = (e) => {
    const isChecked = e.currentTarget.checked;
    if (typeof onChange === "function") onChange(isChecked);
  }

  return (
    <label htmlFor={id} className={`${s.checkbox} ${className || ''}`} {...props}>
      <input type="checkbox" id={id} onChange={onChangeHandler}/>
      <span className={s.fakeCheckBox}/>
      {children}
    </label>)
}

export default PureCheckbox;