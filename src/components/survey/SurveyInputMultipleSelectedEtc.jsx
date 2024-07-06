import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import Image from 'next/image';
import { dogCautionType } from '../../../store/TYPE/dogCautionType';

const SurveyInputMultipleSelectedEtc = ({
  formValueKey,
  setFormValues,
  title,
  idList,
  labelList,
  className,
  dataType = 'string',
  dogInfo,
  dogInfoIndex,
  etcKey,
}) => {
  // 최초 값
  // let initialSelectedRadio = `${formValueKey}-${formValues[formValueKey]}`;

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    // 이전 값
    const oldValue = dogInfo[formValueKey] || '';

    // 새로운 값
    let newValue = '';

    if (oldValue === 'YES' || oldValue === 'NONE') {
      newValue = checked && value;
    } else {
      if (checked) {
        // 체크된 경우, 이전 값에 포함되어 있지 않으면 추가합니다.
        newValue = oldValue ? `${oldValue},${value}` : value;
      } else {
        // 체크 해제된 경우, 이전 값에서 해당 값을 제거합니다.
        newValue = oldValue
          .split(',')
          .filter((val) => val !== value)
          .join(',');
      }
    }

    // 내용 업데이트
    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === dogInfoIndex) {
          return {
            ...item,
            [formValueKey]: newValue,
          };
        }
        return item;
      });

      return newFormValues;
    });
  };

  useEffect(() => {
    // 내용 업데이트
    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === dogInfoIndex) {
          if (item[formValueKey] === '') {
            return {
              ...item,
              [formValueKey]: 'NONE',
            };
          }
        }
        return item;
      });

      return newFormValues;
    });
  }, [dogInfo]);

  const handleEtcChange = (e, labelName) => {
    const { value } = e.target;

    // 내용 업데이트
    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === dogInfoIndex) {
          return {
            ...item,
            [etcKey]: value,
          };
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
                  dogInfo[formValueKey].includes(idList[index]) && s.checked
                }`}
              >
                <input
                  id={`${formValueKey}`}
                  type="checkbox"
                  className="hide"
                  checked={dogInfo[formValueKey].includes(idList[index])}
                  onChange={(e) => handleCheckboxChange(e)}
                  value={idList[index]}
                />
                {labelList[index]}
              </label>
              {idList[index] === 'ETC' &&
                dogInfo[formValueKey].includes('ETC') && (
                  <input
                    placeholder="선택지에 없는 경우 기재해주세요."
                    type="text"
                    onChange={(e) => handleEtcChange(e, idList[index])}
                    className={s.input_etc}
                  />
                )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SurveyInputMultipleSelectedEtc;
