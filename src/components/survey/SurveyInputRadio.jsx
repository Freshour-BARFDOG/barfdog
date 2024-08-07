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
