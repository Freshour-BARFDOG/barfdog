import React from 'react';
import Styles from '../../../styles/atoms/checkbox.module.scss';

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

export default function Checkbox(props) {
  return (
      <label htmlFor='agree' className={Styles.chk_box}>
        <input type="checkbox" id='agree' />
        <span className={Styles.on} />
      </label>
  );
}