import React, { useEffect, useState } from 'react';
import s from './customRadio.module.scss';

const CustomRadioTrueOrFalse = ({ name, labelList = [], value, setValue, returnBooleanValue }) => {

  const trueRadioId = `${name}${labelList[0]}`;
  const falseRadioId = `${name}${labelList[1]}`;
  const initialValue = value === true ? trueRadioId : falseRadioId;
  const [selectedRadio, setSelectedRadio] = useState(initialValue);


  useEffect(() => {
    setSelectedRadio(initialValue);
  }, [initialValue]);

  const onChangeHandler = (e) => {
    const { id } = e.currentTarget;
    let booleanValue;
    if(id === trueRadioId){
      booleanValue = true;
    }   else if ( id === falseRadioId) {
      booleanValue = false;
    }
    setSelectedRadio(id);
    if(returnBooleanValue){
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
      <div className={`${s['inp-wrap']} ${s['radio']}`}>
        <label htmlFor={trueRadioId}> {/* TRUE값 반환 */}
          <input
            id={trueRadioId}
            name={name}
            type="radio"
            checked={selectedRadio === trueRadioId}
            onChange={onChangeHandler}
          />
          {labelList[0]}
        </label>
        <label htmlFor={falseRadioId}> {/* FALSE RADIO */}
          <input
            id={falseRadioId}
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