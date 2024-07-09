import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import Image from 'next/image';
import { dogCautionType } from '../../../store/TYPE/dogCautionType';

const SurveyInputMultipleSelected = ({
  formValueKey,
  setFormValues,
  onInputChangeHandler,
  title,
  idList,
  labelList,
  className,
  dataType = 'string',
  dogInfo,
  dogInfoIndex,
  setIsActiveNextBtn,
}) => {
  // 최초 값
  // let initialSelectedRadio = `${formValueKey}-${formValues[formValueKey]}`;

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    // 이전 값
    const oldValue = dogInfo[formValueKey] || '';

    // 새로운 값
    let newValue = '';

    // 고민되는 부분 - 우선순위 3가지만
    if (formValueKey === 'recommendRecipeId') {
      const selectedItems = oldValue ? oldValue.split(',') : [];
      // 이미 선택된 항목이 3개일 때 새로운 항목 추가를 막기
      if (checked && selectedItems.length >= 3) {
        alert('최대 3개의 항목만 선택할 수 있습니다.');
        return;
      }
    }

    if (oldValue === 'YES' || oldValue === 'NONE') {
      newValue = checked && value;
    } else {
      if (checked) {
        // 체크된 경우, 이전 값에 포함되어 있지 않으면 추가
        newValue = oldValue ? `${oldValue},${value}` : value;
      } else {
        // 체크 해제된 경우, 이전 값에서 해당 값을 제거
        newValue = oldValue
          .split(',')
          .filter((val) => val !== value)
          .join(',');
      }
    }

    // 내용 업데이트
    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        setIsActiveNextBtn(true);
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

  // const handleBrandChange = (e, labelName) => {
  //   const { value } = e.target;

  //   // 내용 업데이트
  //   setFormValues((prevFormValues) => {
  //     const newFormValues = prevFormValues.map((item, idx) => {
  //       if (idx === dogInfoIndex) {
  //         let dataArray = item[formValueKey].split(',');
  //         let updatedArray = dataArray;
  //         let labelIndex = dataArray.indexOf(labelName);

  //         if (labelIndex !== -1) {
  //           // 라벨명 그대로 존재한다면 (ex. 유산균)
  //           updatedArray[labelIndex] = labelName + ':' + value;
  //         } else {
  //           updatedArray = dataArray.map((item) => {
  //             let [label, labelValue] = item.split(':');
  //             if (label === labelName) {
  //               // 라벨명 존재하지만 ':' 포함된 경우 (ex. 유산균:이전브랜드)
  //               if (value === '') {
  //                 // 빈 문자열인 경우, ':' 제거
  //                 return labelName;
  //               } else {
  //                 // ':'와 함께 값을 추가
  //                 return `${labelName}:${value}`;
  //               }
  //             } else {
  //               // 조건에 맞지 않는 경우, 원래의 item 반환
  //               return item;
  //             }
  //           });
  //         }

  //         let resultArray = updatedArray.join(',');

  //         return {
  //           ...item,
  //           [formValueKey]: resultArray,
  //         };
  //       }
  //       return item;
  //     });

  //     return newFormValues;
  //   });
  // };

  return (
    <>
      <ul className={`${className} ${s['inputRadio-wrap']}`}>
        {idList.map((id, index) => {
          return (
            <li key={`radio-${title}-${index}`}>
              <label
                key={`radio-${formValueKey}-${index}`}
                className={`${s.inputRadio} ${
                  dogInfo[formValueKey]?.includes(idList[index]) && s.checked
                }`}
              >
                <input
                  id={`${formValueKey}`}
                  type="checkbox"
                  className="hide"
                  checked={dogInfo[formValueKey]?.includes(idList[index])}
                  onChange={(e) => handleCheckboxChange(e)}
                  value={idList[index]}
                />
                {labelList[index]}
              </label>

              {/* <input
                placeholder="(선택) 브랜드와 제품명을 기재해주세요"
                type="text"
                onChange={(e) => handleBrandChange(e, idList[index])}
                className={s.input_supplement_brand}
                disabled={!dogInfo[formValueKey].includes(idList[index])}
              /> */}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SurveyInputMultipleSelected;
