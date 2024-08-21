import React, { useEffect, useState } from 'react';
import { SurveyRecipeInput } from './SurveyRecipeInput';
import Link from 'next/link';
import Image from 'next/image';
import s from '/src/components/survey/statistics/surveyStatistics.module.scss';
import popupWindow from '/util/func/popupWindow';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import {
  ItemRecommendlabel,
  ItemSoldOutLabel,
} from '/src/components/atoms/ItemLabel';
import {
  concernsRecipeMap,
  inedibleFoodRecipeMap,
} from '../../../../store/TYPE/recipeIdWithConcernsInedibleFood';

export default function SurveyResultRecipe({
  surveyInfo,
  recipeInfo,
  recipeDoubleInfo,
  recipeSingleInfo,
  form,
  setForm,
  pricePerPack,
  setPricePerPack,
  activeConcern,
  calcPrice,
}) {
  const [initialize, setInitialize] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState({}); // * 풀플랜: 최대 2가지 레시피 선택 가능 (Checkbox Input) // ex.{터키비프: true}
  const [inputType, setInputType] = useState(null);
  const [recommendRecipeId, setRecommendRecipeId] = useState(null);
  const [inedibleRecipeIds, setInedibleRecipeIds] = useState([]);

  //*** 추천 레시피 & 못먹는 음식 플래그 ***//
  useEffect(() => {
    // 1. 추천 레시피
    // const selectedConditions = surveyInfo.priorityConcerns
    //   .split(',')
    //   .filter(Boolean);
    // let recommendRecipeIds = [];

    // selectedConditions.forEach((condition) => {
    //   if (concernsRecipeMap[condition]) {
    //     recommendRecipeIds.push(...concernsRecipeMap[condition]);
    //   }
    // });

    // recommendRecipeIds = [...new Set(recommendRecipeIds)]; // 중복 제거

    // // inedibleFood에 포함된 재료의 레시피 ID를 제외
    // const inedibleFoods = surveyInfo.inedibleFood.split(',').filter(Boolean);
    // inedibleFoods.forEach((food) => {
    //   if (inedibleFoodRecipeMap[food]) {
    //     recommendRecipeIds = recommendRecipeIds.filter(
    //       (id) => !inedibleFoodRecipeMap[food].includes(id),
    //     );
    //   }
    // });

    let recommendRecipeIds = concernsRecipeMap[activeConcern] || [];

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
  }, [activeConcern]);

  useEffect(() => {
    if (!selectedCheckbox) return;
    let selectedCheckboxCount = 0;
    const keys = Object.keys(selectedCheckbox);
    const selectedIdList = [];
    keys.forEach((key) => {
      const selectedId = recipeInfo.filter(
        (rc, index) => rc.name === `${selectedCheckbox && key.split('-')[0]}`,
      )[0]?.id;
      const val = selectedCheckbox[key];
      val && selectedCheckboxCount++;
      val
        ? selectedIdList.push(selectedId)
        : selectedIdList?.filter((id) => id !== selectedId);
    });
    setForm((prevState) => ({
      ...prevState,
      recipeIdList: selectedIdList,
    }));
  }, [selectedCheckbox, recipeInfo, form.plan]); // 레시피 클릭할 때마다 바로 계산되게끔

  useEffect(() => {
    if (form.plan && form.recipeIdList.length > 0) {
      const { avgPrice, recipePrices } = calcPrice(form.plan);
      setPricePerPack({
        avgPrice: avgPrice?.perPack,
        recipePrices,
      });
    }
  }, [selectedCheckbox, recipeInfo, form.plan, form]);

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, { width: 1000, height: 716 });
  };

  // console.log('recommendRecipeId___', recommendRecipeId);
  // console.log('inedibleRecipeIds___', inedibleRecipeIds);

  return (
    <div className={s.recipe_container}>
      <div className={s.recipe_title}>
        {surveyInfo.myDogName}(을)를 위한 <span>레시피</span>를 선택해 주세요
        <div className={s.recipe_title_info}>
          <strong>최대 2가지</strong>까지 레시피 선택이 가능합니다
        </div>
      </div>

      {/* 3-1) 더블 */}
      <div className={s.recipe_box}>
        <h3>
          [ <b>더블미트</b>(복합 단백질) 레시피 ]
        </h3>

        <div className={s.recipe_list}>
          {recipeDoubleInfo.map((recipe, index) => (
            <>
              <SurveyRecipeInput
                id={`${recipe.name}-${recipe.id}`}
                type={inputType}
                name={name}
                initialize={initialize}
                disabled={!recipe.inStock}
                selectedCheckbox={selectedCheckbox}
                setSelectedCheckbox={setSelectedCheckbox}
                option={{ label: '레시피 선택' }}
              >
                {recommendRecipeId?.includes(recipe.id) && (
                  <ItemRecommendlabel
                    label="추천!"
                    style={{
                      backgroundColor: '#be1a21',
                    }}
                  />
                )}
                {inedibleRecipeIds?.includes(recipe.id) && (
                  <ItemRecommendlabel
                    label={`못먹는\n재료 포함`}
                    style={{
                      backgroundColor: '#000',
                      fontSize: '13px',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.2,
                    }}
                    inedibleFood={true}
                  />
                )}

                <Image
                  src={recipe.thumbnailUri2}
                  width={149 * 1.4}
                  height={149 * 1.4}
                  alt="레시피 상세 이미지"
                />
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
              </SurveyRecipeInput>
            </>
          ))}
        </div>
      </div>

      {/* 3-2) 싱글 */}
      <div className={s.recipe_box}>
        <h3>
          {' '}
          [ <b>싱글미트</b>(단일 단백질) 레시피 ]
        </h3>
        <div className={s.recipe_list}>
          {recipeSingleInfo.map((recipe, index) => (
            <>
              <SurveyRecipeInput
                id={`${recipe.name}-${recipe.id}`}
                type={inputType}
                name={name}
                initialize={initialize}
                disabled={!recipe.inStock}
                selectedCheckbox={selectedCheckbox}
                setSelectedCheckbox={setSelectedCheckbox}
                option={{ label: '레시피 선택' }}
              >
                {recommendRecipeId?.includes(recipe.id) && (
                  <ItemRecommendlabel
                    label="추천!"
                    style={{
                      backgroundColor: '#be1a21',
                    }}
                  />
                )}
                {inedibleRecipeIds?.includes(recipe.id) && (
                  <ItemRecommendlabel
                    label={`못먹는\n재료 포함`}
                    style={{
                      backgroundColor: '#000',
                      fontSize: '13px',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.2,
                    }}
                    inedibleFood={true}
                  />
                )}
                <Image
                  src={recipe.thumbnailUri2}
                  width={149 * 1.5}
                  height={149 * 1.5}
                  alt="레시피 상세 이미지"
                />
                <div>{recipe.uiNameKorean}</div>
                <div className={s.recipe_description}>
                  · 주재료: {recipe.ingredientList.join(', ')} <br />·{' '}
                  {recipe.name === 'Premium CHICKEN'
                    ? '자견~노견, 전 연령 추천'
                    : recipe.name === 'Premium TURKEY'
                    ? '성장기 자견에게 추천'
                    : recipe.name === 'Premium LAMB'
                    ? '활동량이 많다면 추천'
                    : recipe.name === 'Premium BEEF'
                    ? '자견~노견, 전 연령 추천'
                    : ''}
                  <br />·{' '}
                  {recipe.name === 'Premium CHICKEN'
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
              </SurveyRecipeInput>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
