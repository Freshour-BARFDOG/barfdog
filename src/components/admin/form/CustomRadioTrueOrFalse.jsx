import React, { useEffect, useState } from 'react';
import s from './customRadio.module.scss';

const CustomRadioTrueOrFalse = ({
  name,
  labelList = [],
  value,
  setValue,
  returnBooleanValue,
  theme,
}) => {
  const trueRadioId = `${name}${labelList[0]}`;
  const falseRadioId = `${name}${labelList[1]}`;
  let initialValue;
  if(value === null){
    initialValue = '';
  } else if(value === true){
    initialValue = trueRadioId
  } else if(value === false) {
    initialValue =  falseRadioId;
  }
  const [selectedRadio, setSelectedRadio] = useState(initialValue);

  useEffect(() => {
    // init value
    // console.log(value)
    setSelectedRadio(initialValue);
  }, [initialValue]);

  const onChangeHandler = (e) => {
    const { id } = e.currentTarget;
    setSelectedRadio(id);

    let booleanValue;
    if (id === trueRadioId) {
      booleanValue = true;
    } else if (id === falseRadioId) {
      booleanValue = false;
    }

    if (returnBooleanValue) {
      setValue(booleanValue);
    } else {
      setValue((prevState) => ({
        ...prevState,
        [name]: booleanValue,
      }));
    }
  };

  return (
    <>
      <div className={`${s['inp-wrap']} ${s['radio']} ${theme ? s[theme] : ''}`}>
        <label
          htmlFor={`${name}${labelList[0]}`}
          className={`${selectedRadio === trueRadioId && s.checked}`}
        >
          {/* TRUE값 반환 */}
          <input
            id={`${name}${labelList[0]}`}
            name={name}
            type="radio"
            checked={selectedRadio === trueRadioId}
            onChange={onChangeHandler}
          />
          {labelList[0]}
        </label>
        <label
          htmlFor={`${name}${labelList[1]}`}
          className={`${selectedRadio === falseRadioId && s.checked}`}
        >
          {/* FALSE RADIO */}
          <input
            id={`${name}${labelList[1]}`}
            name={name}
            type="radio"
            checked={selectedRadio === falseRadioId}
            onChange={onChangeHandler}
          />
          {labelList[1]}
        </label>
      </div>
    </>
  );
};

export default CustomRadioTrueOrFalse;
