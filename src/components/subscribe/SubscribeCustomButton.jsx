import React, { useEffect, useState } from 'react';
import s from './subscribeCustomInput.module.scss';
import Icon_Checked from '/public/img/icon/icon_checked.svg';

export const SubscribeCustomButton = ({
  children,
  id,
  name,
  form,
  setForm,
  planType,
  selectedRecipes,
  backgroundColor,
  setSelectedRecipes,
  maxSelection = 2,
  isRecommend,
  lable,
  info,
  ...props
}) => {
  const isSelected = selectedRecipes.includes(id);
console.log(selectedRecipes, 'selectedRecipes');

  useEffect(() => {
    if (info.recommendRecipeName) {
      const recommendRecipeId = info.recipeInfoList.find(
        (rc) => rc.name === info.recommendRecipeName
      )?.id;

      if (recommendRecipeId && !selectedRecipes.includes(recommendRecipeId)) {
        // 추천 레시피가 선택되지 않았을 때만 초기 선택
        const newSelected = [...selectedRecipes, recommendRecipeId];
        setSelectedRecipes(newSelected);
        setForm((prev) => ({
          ...prev,
          [name]: newSelected,
        }));
      }
    }
  }, []);


  useEffect(() => {
    setSelectedRecipes(form.recipeIdList);
  }, [form.recipeIdList, setSelectedRecipes]);
  
  const handleSelect = () => {
    if (planType === 'FULL') {
      if (isSelected) {
        const newSelected = selectedRecipes.filter((recipeId) => recipeId !== id);
          setSelectedRecipes(newSelected);
          setForm((prev) => ({
            ...prev,
            [name]: newSelected,
          }));
      } else if (selectedRecipes.length < maxSelection) {
        const newSelected = [...selectedRecipes, id];
          setSelectedRecipes(newSelected);
          setForm((prev) => ({
            ...prev,
            [name]: newSelected,
          }));
      } else {
        alert('풀플랜은 최대 2개 레시피만 선택 가능합니다.');
      }
    } else {
      if (!isSelected) {
          setSelectedRecipes([id]);
          setForm((prev) => ({
            ...prev,
            [name]: [id],
          }));
      }
    }
  };


  return (
    <button
      className={`${s.custom_input_wrapper} ${isSelected ? s.checked : ''}`}
      onClick={handleSelect}
      style={{ backgroundColor: backgroundColor }}
      {...props}
    >
      <div className={s.custom_input_cont}>{children}</div>
      <span className={s.fake_checkbox}>
        {isSelected ? '선택됨' : '레시피 선택'}
        {isSelected && (
          <i className={s.icon_checked}>
            <Icon_Checked />
          </i>
        )}
      </span>
    </button>

  );
};