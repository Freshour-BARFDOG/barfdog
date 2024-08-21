import React, { useEffect, useState } from 'react';
import s from './surveyStatistics.module.scss';
import {
  concernsRecipeMap,
  inedibleFoodRecipeMap,
} from '../../../../store/TYPE/recipeIdWithConcernsInedibleFood';
import Link from 'next/link';
import popupWindow from '/util/func/popupWindow';
import Image from 'next/image';
import { recommendRecipeDescriptionList } from './recommendRecipeDescription';

export default function RecommendRecipe({ surveyInfo, recipeInfo }) {
  const [recommendRecipeId, setRecommendRecipeId] = useState(null);
  const [inedibleRecipeIds, setInedibleRecipeIds] = useState([]);
  const [recommendRecipeInfo, setRecommendRecipeInfo] = useState(recipeInfo);
  const [isShowResult, setIsShowResult] = useState(true);

  //*** 추천 레시피 & 못먹는 음식 플래그 ***//
  useEffect(() => {
    // 1. 추천 레시피
    const selectedConditions = surveyInfo.priorityConcerns
      .split(',')
      .filter(Boolean);
    let recommendRecipeIds = [];

    selectedConditions.forEach((condition) => {
      if (concernsRecipeMap[condition]) {
        recommendRecipeIds.push(...concernsRecipeMap[condition]);
      }
    });

    recommendRecipeIds = [...new Set(recommendRecipeIds)]; // 중복 제거

    // inedibleFood에 포함된 재료의 레시피 ID를 제외
    const inedibleFoods = surveyInfo.inedibleFood.split(',').filter(Boolean);
    inedibleFoods.forEach((food) => {
      if (inedibleFoodRecipeMap[food]) {
        recommendRecipeIds = recommendRecipeIds.filter(
          (id) => !inedibleFoodRecipeMap[food].includes(id),
        );
      }
    });

    // recommendRecipeId의 최종 값
    const finalRecommendRecipeId = recommendRecipeIds.length
      ? recommendRecipeIds
      : null;
    setRecommendRecipeId(finalRecommendRecipeId);

    // 2. 못먹는 음식
    if (surveyInfo.inedibleFood) {
      const inedibleFoodList = surveyInfo.inedibleFood
        .split(',')
        .map((food) => food.trim());

      const recipeIds = inedibleFoodList.flatMap(
        (food) => inedibleFoodRecipeMap[food] || [],
      );

      const uniqueRecipeIds = [...new Set(recipeIds)];

      setInedibleRecipeIds(uniqueRecipeIds);
    }
  }, []);

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, { width: 1000, height: 716 });
  };

  //* '더보기' 클릭
  const moreClickHandler = () => {
    setIsShowResult(!isShowResult);
  };

  // console.log(recipeInfo);
  // console.log('recommendRecipeId___', recommendRecipeId);
  // console.log('inedibleRecipeIds___', inedibleRecipeIds);

  return (
    <section className={s.recommend_recipe}>
      <div className={s.title_wrapper}>
        <span className={s.under_text}>
          {surveyInfo.priorityConcerns.split(',')[0]}
        </span>
        이 필요한
        <br />
        <span className={s.under_text}>{surveyInfo.myDogName}</span> (이)에게
        추천하는 레시피
      </div>

      <div className={s.recipe_list}>
        {recipeInfo
          .filter((recipe) => recommendRecipeId?.includes(recipe.id))
          .map((recipe, index) => (
            <div key={index} className={s.recipe_wrapper}>
              <Image
                src={recipe.thumbnailUri2}
                width={149 * 1.4}
                height={149 * 1.4}
                alt="레시피 상세 이미지"
              />
              <div className={s.right_box}>
                <div>{recipe.uiNameKorean}</div>
                <div className={s.recipe_description}>
                  · 주재료: {recipe.ingredientList.join(', ')} <br />·{' '}
                  {recipe.name === 'STARTER PREMIUM +'
                    ? '첫 생식에 추천'
                    : recipe.name === 'TURKEY&BEEF +'
                    ? '성장기 자견에게 추천'
                    : recipe.name === 'DUCK&LAMB +'
                    ? '기력회복이 필요하다면 추천'
                    : recipe.name === 'LAMB&BEEF +'
                    ? '푸석푸석한 모질이라면 추천'
                    : recipe.name === 'Premium CHICKEN'
                    ? '자견~노견, 전 연령 추천'
                    : recipe.name === 'Premium TURKEY'
                    ? '성장기 자견에게 추천'
                    : recipe.name === 'Premium LAMB'
                    ? '활동량이 많다면 추천'
                    : recipe.name === 'Premium BEEF'
                    ? '자견~노견, 전 연령 추천'
                    : ''}
                  <br />·{' '}
                  {recipe.name === 'STARTER PREMIUM +'
                    ? '부드러워 소화에 적은 부담'
                    : recipe.name === 'TURKEY&BEEF +'
                    ? '영양 보충 & 면역력 강화'
                    : recipe.name === 'DUCK&LAMB +'
                    ? '관절 강화 & 근력 회복'
                    : recipe.name === 'LAMB&BEEF +'
                    ? '윤기나는 피부와 모질'
                    : recipe.name === 'Premium CHICKEN'
                    ? '관절 강화 & 소화 흡수율 높음'
                    : recipe.name === 'Premium TURKEY'
                    ? '영양 보충 & 면역력 강화'
                    : recipe.name === 'Premium LAMB'
                    ? '피로회복 & 피모관리'
                    : recipe.name === 'Premium BEEF'
                    ? '체중관리 & 빈혈회복'
                    : ''}
                </div>
                <button>
                  <Link href="/recipes" passHref>
                    <a
                      target={'_blank'}
                      rel={'noreferrer'}
                      onClick={onPopupHandler}
                    >
                      자세히 알아보기
                    </a>
                  </Link>
                </button>
              </div>
            </div>
          ))}
      </div>

      <div
        className={`${s.description_wrapper} ${isShowResult ? s.active : ''}
      `}
      >
        {
          recommendRecipeDescriptionList[
            surveyInfo.priorityConcerns.split(',')[0]
          ]
        }
        <button className={s.more_info_show_btn} onClick={moreClickHandler}>
          {isShowResult ? '접기' : '더보기'}
        </button>
      </div>
    </section>
  );
}
