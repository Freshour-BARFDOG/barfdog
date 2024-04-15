import React, { useEffect, useState } from 'react';
import s from './surveyCustomRadio.module.scss';

const CustomRadioTrueOrFalse = ({
  title,
  labelList = [],
  value,
  setValue,
  returnBooleanValue,
  theme,
  className = '',
  components = [],
  onInputChangeHandler,
  dogInfo,
  dogInfoIndex,
}) => {
  const trueRadioId = `${title}${labelList[0]}`;
  const falseRadioId = `${title}${labelList[1]}`;
  let initialValue;
  if (value === null) {
    initialValue = '';
  } else if (value === true) {
    initialValue = trueRadioId;
  } else if (value === false) {
    initialValue = falseRadioId;
  }
  const [selectedRadio, setSelectedRadio] = useState(initialValue);

  // console.log(dogInfo);
  // console.log(dogInfo[title]);
  // console.log(title);

  useEffect(() => {
    // init value
    // // console.log(value)
    setSelectedRadio(initialValue);
  }, [initialValue]);

  // const onChangeHandler = (e) => {
  //   const { id } = e.currentTarget;
  //   setSelectedRadio(id);

  //   let booleanValue;
  //   if (id === trueRadioId) {
  //     booleanValue = true;
  //   } else if (id === falseRadioId) {
  //     booleanValue = false;
  //   }

  //   if (returnBooleanValue) {
  //     setValue(booleanValue);
  //   } else {
  //     setValue((prevState) => ({
  //       ...prevState,
  //       [title]: booleanValue,
  //     }));
  //   }
  // };

  return (
    <>
      <div
        className={`${s['inp-wrap']} ${s['radio']} ${theme ? s[theme] : ''} ${
          className ? className : ''
        }`}
      >
        <label
          // htmlFor={`${title}${labelList[0]}`}
          // className={`${selectedRadio === trueRadioId && s.checked}`}
          className={`${dogInfo[title] === true && s.checked}`}
        >
          {/* TRUE값 반환 */}
          <input
            id={`${title}`}
            // id={`${title}${labelList[1]}`}
            name={title}
            type="radio"
            // checked={selectedRadio === falseRadioId}
            checked={dogInfo[title] === true}
            onChange={(e) => onInputChangeHandler(e, dogInfoIndex)}
            value={true}
          />
          {components[0] || labelList[0]}
        </label>
        <label
          // htmlFor={`${title}${labelList[1]}`}
          className={`${dogInfo[title] === false && s.checked}`}
        >
          {/* FALSE RADIO */}
          <input
            id={`${title}`}
            // id={`${title}${labelList[1]}`}
            name={title}
            type="radio"
            // checked={selectedRadio === falseRadioId}
            checked={dogInfo[title] === false}
            onChange={(e) => onInputChangeHandler(e, dogInfoIndex)}
            value={false}
          />
          {components[1] || labelList[1]}
        </label>
      </div>
    </>
  );
};

export default CustomRadioTrueOrFalse;
