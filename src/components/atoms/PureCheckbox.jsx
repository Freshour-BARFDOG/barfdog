import React, {useRef} from 'react';
import s from "./pureCheckbox.module.scss";

const PureCheckbox = ({id, children, className, value,  setValue, eventHandler, errorMessage, onClick, theme, ...props}) => {
  const inputRef = useRef();

  const onChangeHandler = () => {
    const input = inputRef.current;
    const { id, checked } = input;
    // console.log('id:', id, ' checked:', checked);
    if (eventHandler && typeof eventHandler === "function") {
      eventHandler(checked);
    } else if (setValue && typeof setValue === "function"){
      setValue(prevState=> ({
        ...prevState,
        [id]: checked
      }))
    }
  }

  const onClickHandler = () => {
    const input = inputRef.current;
    const { id, checked } = input;
    // console.log('id:', id, ' checked:', checked);
    if (onClick && typeof onClick === "function") {
      onClick(id, checked);
    }
  }
  
  return (
    <>
      <div className={`${s['checkbox-wrap']} ${theme ? s[theme] : ''}`}>
        <label htmlFor={id} className={`${s.checkbox} ${className || ''}`} {...props} onClick={onClickHandler}>
          <input ref={inputRef} onChange={onChangeHandler} type="checkbox" id={id} checked={value}
          />
          <span className={s.fakeCheckBox} />
          {children}
        </label>
        {errorMessage}
      </div>

    </>
  );
}

export default PureCheckbox;