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



export default function Checkbox({ id, label, callback, onClick ,labelStyle, checked,  ...props}) {


  const onChangeHandler = (e) => {
    const { checked, id } = e.currentTarget;
    if (callback && typeof callback === "function") callback(checked, id);
  };

  const onClickHandler = (e) => {
    const { checked, id } = e.currentTarget;
    if (onClick && typeof onClick === "function") onClick(checked, id);

  }


  return (
    <label htmlFor={id} className={s.chk_box} {...props}>
      <input
        type="checkbox"
        id={id}
        onChange={onChangeHandler}
        onClick={onClickHandler}
        checked={checked || false}
      />
      <i className={`${s.on} ${!label ? s.noLabel : ''}`} />
      <span className={s.label} style={labelStyle}>{label}</span>
    </label>
  );
}