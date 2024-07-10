import React, { useEffect, useState } from 'react';
import s from './surveyCustomRadio.module.scss';

const SurveyCustomRadioTrueOrFalse = ({
  title,
  labelList = [],
  value,
  setFormValues,
  returnBooleanValue,
  theme,
  className = '',
  components = [],
  onInputChangeHandler,
  dogInfo,
  dogInfoIndex,
  setActiveIndexList,
  setIsActiveNextBtn,
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

  const clickTrueHandler = (e) => {
    if (
      title === 'supplement' ||
      title === 'inedibleFood' ||
      title === 'caution'
    ) {
      setIsActiveNextBtn(false);
      // 내용 업데이트
      setFormValues((prevFormValues) => {
        const newFormValues = prevFormValues.map((item, idx) => {
          if (idx === dogInfoIndex) {
            return {
              ...item,
              [title]: 'YES',
            };
          }
          return item;
        });

        return newFormValues;
      });
    }

    setActiveIndexList &&
      setActiveIndexList((prevIndexList) => {
        if (!prevIndexList.includes(dogInfoIndex)) {
          return [...prevIndexList, dogInfoIndex]; // 기존 리스트에 없으면 추가
        }
        return prevIndexList;
      });
  };

  const clickFalseHandler = (e) => {
    if (
      title === 'supplement' ||
      title === 'inedibleFood' ||
      title === 'caution'
    ) {
      // 내용 업데이트
      setFormValues((prevFormValues) => {
        const newFormValues = prevFormValues.map((item, idx) => {
          if (idx === dogInfoIndex) {
            return {
              ...item,
              [title]: 'NONE',
            };
          }
          return item;
        });

        return newFormValues;
      });
    }

    setActiveIndexList &&
      setActiveIndexList((prevIndexList) =>
        prevIndexList.filter((index) => index !== dogInfoIndex),
      );
  };

  return (
    <>
      <div
        className={`${s['inp-wrap']} ${s['radio']} ${theme ? s[theme] : ''} ${
          className ? className : ''
        }`}
      >
        <label
          className={
            title === 'supplement' ||
            title === 'inedibleFood' ||
            title === 'caution'
              ? dogInfo[title] !== 'NONE' && s.checked
              : `${dogInfo[title] === true && s.checked}`
          }
        >
          {/* TRUE값 반환 */}
          <input
            id={`${title}`}
            name={title}
            type="radio"
            checked={
              title === 'supplement' ||
              title === 'inedibleFood' ||
              title === 'caution'
                ? dogInfo[title] !== 'NONE'
                : dogInfo[title] === true
            }
            onChange={(e) => onInputChangeHandler(e, dogInfoIndex)}
            value={
              title === 'supplement' ||
              title === 'inedibleFood' ||
              title === 'caution'
                ? 'YES'
                : true
            }
            onClick={clickTrueHandler}
          />
          {components[0] || labelList[0]}
        </label>
        <label
          className={
            title === 'supplement' ||
            title === 'inedibleFood' ||
            title === 'caution'
              ? dogInfo[title] === 'NONE' && s.checked
              : `${dogInfo[title] === false && s.checked}`
          }
        >
          {/* FALSE RADIO */}
          <input
            id={`${title}`}
            // id={`${title}${labelList[1]}`}
            name={title}
            type="radio"
            checked={
              title === 'supplement' ||
              title === 'inedibleFood' ||
              title === 'caution'
                ? dogInfo[title] === 'NONE'
                : dogInfo[title] === false
            }
            onChange={(e) => onInputChangeHandler(e, dogInfoIndex)}
            value={
              title === 'supplement' ||
              title === 'inedibleFood' ||
              title === 'caution'
                ? 'NONE'
                : false
            }
            onClick={clickFalseHandler}
          />
          {components[1] || labelList[1]}
        </label>
      </div>
    </>
  );
};

export default SurveyCustomRadioTrueOrFalse;
