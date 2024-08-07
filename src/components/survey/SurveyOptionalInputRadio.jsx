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
