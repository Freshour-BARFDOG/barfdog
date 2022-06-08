import React, {useState} from 'react';
import s from "./signup.module.scss";

const SingupInput = ({type, required, id, name, title, children, addedClassName, disabled, placeholder, setFormValues}) => {
  const [value, setValue] = useState('');
  const onChangeHandler = (e)=>{
    const {name, value} = e.currentTarget;
    if(setFormValues && typeof setFormValues === 'function'){
      setFormValues((prevState)=>{
        return {
          ...prevState,
          [name]: value
        }
      })
    }

  }

  return (<>
    <div className={s['join__wrap']}>
      <div className={s['input-title-wrap']}>
        <label htmlFor={id}>
          <span className={`${s['inp-title']} ${required && s['required']}`}>{title}</span>
        </label>
      </div>
      <div className={`${s['input-wrap']} ${s[addedClassName]}`}>
        <div className={s['inp-wrap']}>
          <input type={type} id={id} name={id} disabled={disabled} placeholder={placeholder} onChange={onChangeHandler}/>
        </div>
        {children}
      </div>
    </div>

  </>)
}


export default SingupInput;