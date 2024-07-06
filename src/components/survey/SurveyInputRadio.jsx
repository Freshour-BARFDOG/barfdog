import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import Image from 'next/image';
import { dogCautionType } from '../../../store/TYPE/dogCautionType';

const SurveyInputRadio = ({
  formValueKey,
  formValues,
  setFormValues,
  onInputChangeHandler,
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

  return (
    <>
      <ul className={`${className} ${s['inputRadio-wrap']}`}>
        {idList.map((id, index) => {
          return (
            <li key={`radio-${title}-${index}`}>
              {defaultStyle ? (
                <label>
                  <input
                    id={`${formValueKey}`}
                    type="radio"
                    className="hide"
                    checked={dogInfo[formValueKey] === idList[index]}
                    // id={`${formValueKey}-${id}`}
                    // checked={selectedRadio === `${formValueKey}-${id}`} // * important
                    onChange={(e) => onInputChangeHandler(e, dogInfoIndex)}
                    value={idList[index]}
                  />
                  {labelList[index]}
                  {desc && desc.length && (
                    <span className={s.desc}>{desc[index]}</span>
                  )}
                </label>
              ) : (
                <label
                  key={`radio-${formValueKey}-${index}`}
                  // htmlFor={`${formValueKey}-${id}`}
                  // className={`${s.inputRadio} ${
                  //   selectedRadio === formValueKey + '-' + id && s.checked
                  // }`}
                  className={`${s.inputRadio} ${
                    dogInfo[formValueKey] === idList[index] && s.checked
                  }`}
                >
                  <input
                    id={`${formValueKey}`}
                    type="radio"
                    className="hide"
                    checked={dogInfo[formValueKey] === idList[index]}
                    // id={`${formValueKey}-${id}`}
                    // checked={selectedRadio === `${formValueKey}-${id}`} // * important
                    onChange={(e) =>
                      onInputChangeHandler(e, dogInfoIndex, formValueKey)
                    }
                    value={idList[index]}
                    // onClick={
                    //   formValueKey === 'supplement' &&
                    //   idList[index] === '' &&
                    //   clickTrueHandler
                    // }
                  />
                  {formValueKey === 'dogStatus' && (
                    <Image
                      src={`/img/survey/${idList[index]}${
                        dogInfo[formValueKey] === idList[index] ? '_ACTIVE' : ''
                      }.png`}
                      alt="idList[index]"
                      width={100}
                      height={100}
                    />
                  )}
                  {formValueKey === 'activityLevel' && (
                    <Image
                      src={`/img/survey/${idList[index]}${
                        dogInfo[formValueKey] === idList[index] ? '_ACTIVE' : ''
                      }.png`}
                      alt="idList[index]"
                      width={100}
                      height={100}
                    />
                  )}
                  {labelList[index]}
                  {desc && desc.length && (
                    <span className={s.desc}>{desc[index]}</span>
                  )}
                </label>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SurveyInputRadio;
