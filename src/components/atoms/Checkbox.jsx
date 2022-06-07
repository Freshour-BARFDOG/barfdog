import React from 'react';
import s from './checkbox.module.scss';

export function Title (props) {
  return (
    <header className={s.title}>
      <h2>{props.name}</h2>
    </header>
  )
}

export function Btn (props) {  
  
  const test = props.style === 'white' ? 'white' : "red" ;
  
  return(
    <div className={s.btn_group}>
      <div className={`${s.btn} ${s[test]}`}>
        {props.name}
      </div>
    </div>
  )
}



export default function Checkbox({ id, label, callback, onClick , ...props}) {

  const onChangeHandler = (e) => {
    const input = e.currentTarget;
    if (typeof callback === "function") callback(input.checked);
  };

  const onClickHandler = (e) => {
    const isChecked = e.currentTarget.checked;
    onClick(isChecked);
  }


  return (
    <label htmlFor={id} className={s.chk_box} {...props}>
      <input
        type="checkbox"
        id={id}
        onChange={onChangeHandler}
        onClick={onClickHandler}
        // value={isChecked}
      />
      <span className={`${s.on} ${!label ? s.noLabel : ''}`} />
      <span className={s.label}>{label}</span>
    </label>
  );
}