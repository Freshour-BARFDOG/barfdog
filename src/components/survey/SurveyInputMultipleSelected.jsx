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
  conditionRecipeMap,
  inedibleFoodRecipeMap,
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
    if (formValueKey === 'priorityConcerns') {
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

    //! 추천 레시피 id
    if (formValueKey === 'priorityConcerns') {
      const selectedConditions = newValue.split(',').filter(Boolean);
      let recommendRecipeIds = [];

      selectedConditions.forEach((condition) => {
        if (conditionRecipeMap[condition]) {
          recommendRecipeIds.push(...conditionRecipeMap[condition]);
        }
      });

      recommendRecipeIds = [...new Set(recommendRecipeIds)]; // 중복 제거

      // inedibleFood에 포함된 재료의 레시피 ID를 제외
      const inedibleFoods = dogInfo.inedibleFood.split(',').filter(Boolean);
      inedibleFoods.forEach((food) => {
        if (inedibleFoodRecipeMap[food]) {
          recommendRecipeIds = recommendRecipeIds.filter(
            (id) => !inedibleFoodRecipeMap[food].includes(id),
          );
        }
      });

      // recommendRecipeId의 최종 값
      const finalRecommendRecipeId = recommendRecipeIds.length
        ? recommendRecipeIds[0]
        : null;

      // 내용 업데이트
      setFormValues((prevFormValues) => {
        const newFormValues = prevFormValues.map((item, idx) => {
          setIsActiveNextBtn(true);
          if (idx === dogInfoIndex) {
            return {
              ...item,
              [formValueKey]: newValue,
              recommendRecipeId: finalRecommendRecipeId,
            };
          }
          return item;
        });

        return newFormValues;
      });
    } else {
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
    }
  };

  useEffect(() => {
    // 내용 업데이트
    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (
          idx === dogInfoIndex &&
          formValueKey !== 'currentMeal' &&
          formValueKey !== 'priorityConcerns'
        ) {
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
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SurveyInputMultipleSelected;
