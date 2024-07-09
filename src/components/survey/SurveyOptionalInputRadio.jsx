import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import Image from 'next/image';
import { dogCautionType } from '../../../store/TYPE/dogCautionType';

const SurveyOptionalInputRadio = ({
  formValueKey,
  formValues,
  setFormValues,
  title,
  idList,
  labelList,
  className,
  desc,
  defaultStyle,
  dataType = 'string',
  dogInfo,
  dogInfoIndex,
  setActiveIndexList,
  setIsActiveNextBtn,
}) => {
  // 최초 값
  // let initialSelectedRadio = `${formValueKey}-${formValues[formValueKey]}`;
  // let initialSelectedRadio = `${formValueKey}-${formValues[0].formValueKey}`;
  let initialSelectedRadio = `${formValueKey}-${formValues[0][formValueKey]}`;

  if (formValueKey === 'caution') {
    // 설문조사 수정하기 > 있어요항목 UI > checked표시를 위함
    const val = formValues[formValueKey];
    if (val !== dogCautionType.NONE) {
      initialSelectedRadio = `${formValueKey}-`;
    }
  }

  const [selectedRadio, setSelectedRadio] = useState(initialSelectedRadio); // * component 내부 value
  // console.log('selectedRadio>>>>', selectedRadio);
  // console.log(formValues);
  // console.log('formValues[0].gender>>>>', formValues[0].gender);
  // console.log('initialSelectedRadio', initialSelectedRadio);

  //![임의 주석 START]
  // useEffect(() => {
  //   // '기타' input의 입력값(value)와 연계한 UI의 변화
  //   // => input value에 SurveyInputRadio의 idList 중의 id를 입력했을 경우, 해당 id에 checked 표기하기 위함.
  //   // ex. 기타 특이사항 (질병) 등이 있어요 => 기타란에 'NONE'입력했을 경우 => '없어요 SurveyInputRadio'가 선택된다.
  //   idList.forEach((id) => {
  //     // console.log('id>>>>>', id);
  //     // console.log('formValues[0][formValueKey]', formValues[0][formValueKey]);
  //     if (formValues[0][formValueKey] === id) {
  //       // // console.log('formValues[formValueKey]',formValues[formValueKey],'& id:', id)
  //       setSelectedRadio(`${formValueKey}-${id}`); // 목적지고
  //     }
  //   });
  // }, [formValues]);
  // }, [formValues[0][formValueKey]]);
  //![임의 주석 END]

  // const onChangeHandler = (e, index) => {
  //   const { id } = e.currentTarget;
  //   setSelectedRadio(id);
  //   if (id.indexOf(formValueKey) < 0)
  //     return console.error('formValueKey를 입력해주세요.');
  //   const separator = '-';
  //   let val = id.split(separator)[1];

  //   if (dataType === 'number') {
  //     val = Number(val);
  //   }

  //   setFormValues((prevState) => ({
  //     ...prevState,
  //     [formValueKey]: val,
  //   }));
  // };

  // const clickTrueHandler = () => {
  //   setActiveIndexList((prevIndexList) => {
  //     if (!prevIndexList.includes(dogInfoIndex)) {
  //       return [...prevIndexList, dogInfoIndex]; // 기존 리스트에 없으면 추가
  //     }
  //     return prevIndexList;
  //   });
  // };

  // const clickFalseHandler = () => {
  //   setActiveIndexList((prevIndexList) =>
  //     prevIndexList.filter((index) => index !== dogInfoIndex),
  //   );
  // };

  const clickHandler = (e) => {
    const { value } = e.target;

    setIsActiveNextBtn(false);

    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === dogInfoIndex) {
          if (item[formValueKey] !== value && item[formValueKey] === 'ETC') {
            return {
              ...item,
              [formValueKey]: value,
              specificDogStatusEtc: '',
            };
          } else if (item[formValueKey] !== value) {
            // 다른 라벨 클릭 시, 바로 값 변경
            return {
              ...item,
              [formValueKey]: value,
            };
          } else if (item[formValueKey] === 'PREGNANT') {
            setIsActiveNextBtn(true);
            return {
              ...item,
              [formValueKey]: 'NONE',
              expectedPregnancyDay: '',
            };
          } else if (item[formValueKey] === 'LACTATING') {
            setIsActiveNextBtn(true);
            return {
              ...item,
              [formValueKey]: 'NONE',
            };
          } else if (item[formValueKey] === 'ETC') {
            setIsActiveNextBtn(true);
            return {
              ...item,
              [formValueKey]: 'NONE',
            };
          }
          // } else if (value === 'PREGNANT') {
          //   return {
          //     ...item,
          //     [formValueKey]: value,
          //   };
          // } else if (value === 'LACTATING') {
          //   return {
          //     ...item,
          //     [formValueKey]: value,
          //   };
          // } else {

          // }
        }
        return item;
      });

      return newFormValues;
    });
  };

  return (
    <>
      <ul className={`${className} ${s['inputRadio-wrap']}`}>
        {idList.map((id, index) => {
          return (
            <li key={`radio-${title}-${index}`}>
              <label
                key={`radio-${formValueKey}-${index}`}
                className={`${s.inputRadio} ${
                  (dogInfo[formValueKey] === idList[index] ||
                    dogInfo[formValueKey]?.startsWith(id)) &&
                  s.checked
                }`}
                // className={`${s.inputRadio} ${
                //   dogInfo[formValueKey] === idList[index] && s.checked
                // }`}
              >
                <input
                  id={`${formValueKey}`}
                  type="radio"
                  className="hide"
                  checked={
                    dogInfo[formValueKey] === idList[index] ||
                    dogInfo[formValueKey]?.startsWith(id)
                  }
                  // checked={dogInfo[formValueKey] === idList[index]}
                  value={idList[index]}
                  onClick={clickHandler}
                />
                {labelList[index]}
                {desc && desc.length && (
                  <span className={s.desc}>{desc[index]}</span>
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SurveyOptionalInputRadio;
