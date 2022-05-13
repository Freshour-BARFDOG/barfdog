import React from 'react';
import Styles from './checkbox.module.scss';

export function Title (props) {
  return (
    <header className={Styles.title}>
      <h2>{props.name}</h2>
    </header>
  )
}

export function Btn (props) {  
  
  const test = props.style === 'white' ? 'white' : "red" ;
  
  return(
    <div className={Styles.btn_group}>
      <div className={`${Styles.btn} ${Styles[test]}`}>
        {props.name}
      </div>
    </div>
  )
}



export default function Checkbox({ id, label, callback, onClick }) {

  const onChangeHandler = (e) => {
    const input = e.currentTarget;
    if (typeof callback === "function") callback(input.checked);
  };

  const onClickHandler = (e) => {
    const isChecked = e.currentTarget.checked;
    onClick(isChecked);
  }


  return (
    <label htmlFor={id} className={Styles.chk_box}>
      <input
        type="checkbox"
        id={id}
        onChange={onChangeHandler}
        onClick={onClickHandler}
        // value={isChecked}
      />
      <span className={Styles.on} />
      <span className={Styles.label}>{label}</span>
    </label>
  );
}