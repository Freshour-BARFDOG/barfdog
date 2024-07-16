import React, { useEffect, useMemo, useState } from 'react';
import SurveyPlanInput from './SurveyPlanInput';
import Image from 'next/image';
import s from './surveyStatistics.module.scss';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { calcOneMealGramsWithRecipeInfo } from '/util/func/subscribe/calcOneMealGramsWithRecipeInfo';
import { useSubscribePlanInfo } from '/util/hook/useSubscribePlanInfo';
import ItemLabel from '/src/components/atoms/ItemLabel';

import {
  ItemRecommendlabel,
  ItemSoldOutLabel,
} from '/src/components/atoms/ItemLabel';

export default function SurveyResultPlan({
  surveyInfo,
  recipeInfo,
  recipeDoubleInfo,
  recipeSingleInfo,
  form,
  setForm,
  calcPrice,
}) {
  const subscribePlanInfo = useSubscribePlanInfo();
  const initialPlan = form.plan || null;
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [initialize, setInitialize] = useState(false);
  const selectedRecipeIds = form.recipeIdList;
  const [recipeNameList, setRecipeNameList] = useState([]);

  useEffect(() => {
    const names = form.recipeIdList
      .map((id) => {
        const recipe = recipeInfo.find((info) => info.id === id);
        return recipe ? recipe.name : null;
      })
      .filter((name) => name !== null);

    setRecipeNameList(names);
  }, [recipeInfo, form]);

  // useEffect(() => {
  //   setInitialize(true);
  //   setForm((prevState) => ({
  //     ...prevState,
  //     recipeIdList: [],
  //   }));
  // }, [form.plan]);

  useEffect(() => {
    setForm((prevState) => ({
      ...prevState,
      plan: selectedPlan,
    }));

    setInitialize(null); // null : 플랜 선택된 상태는 유지, form값 초기화
  }, [selectedPlan]);

  const oneMealGramsWithRecipeInfosWithTags = useMemo(
    () =>
      // 초기화(initialize)되었을 경우, 기본 값이 나타나도록 함.
      initialize === false &&
      calcOneMealGramsWithRecipeInfo({
        selectedRecipeIds: selectedRecipeIds,
        allRecipeInfos: recipeInfo.map((recipe) => ({
          id: recipe.id,
          kcalPerGram: recipe.kcalPerGram,
          name: recipe.name,
        })),
        oneDayRecommendKcal: surveyInfo.foodAnalysis.oneDayRecommendKcal,
      })?.map((recipeInfo, i) => (
        <span className={s.oneLine} key={`oneMealGram-info-${i}`}>
          <b>{transformLocalCurrency(recipeInfo.oneMealGram)}g</b>&nbsp;
          <i className={s.tinyText}>
            (1팩 기준)
            {selectedRecipeIds.length > 1 && ` (${recipeInfo.recipeName})`}
          </i>
        </span>
      )),
    [form, initialize],
  ) || (
    <span className={s.oneLine}>
      <b>0g</b>&nbsp;<i className={s.tinyText}>(1팩 기준)</i>
    </span>
  );

  const subsribePlanItems = [
    {
      id: subscribePlanType.FULL.NAME,
      label: 'best', // best, new, none
      imageSrc: require('public/img/subscribe/subscribe_full_plan.png'),
      title: '풀플랜',
      titleDescHTML: (
        <p>
          하루 <strong>2끼</strong>
        </p>
      ),
      bodyDescHTML: {
        row1: (
          <>
            <span>{subscribePlanType.FULL.weeklyPaymentCycle}주</span>
            &nbsp;간격 배송
          </>
        ),
        row2: (
          <>
            {/* 총<span>&nbsp;{subscribePlanType.FULL.numberOfPacksPerDay}팩</span> */}
            총 <span>{subscribePlanType.FULL.totalNumberOfPacks} 팩</span>
          </>
        ),
        // row3: <>{oneMealGramsWithRecipeInfosWithTags}</>,
        // row4: (
        //   <>
        //     {subscribePlanType.FULL.totalNumberOfPacks}팩 x
        //     <span>
        //       &nbsp;
        //       {transformLocalCurrency(
        //         calcPrice(subscribePlanType.FULL.NAME).perPack,
        //       ) + '원'}
        //     </span>
        //   </>
        // ),
      },
      price: {
        discount:
          subscribePlanInfo.planDiscountPercent[subscribePlanType.FULL.NAME],
        origin: transformLocalCurrency(
          calcPrice(subscribePlanType.FULL.NAME).originPrice,
        ),
        sale: transformLocalCurrency(
          calcPrice(subscribePlanType.FULL.NAME).salePrice,
        ),
      },
    },
    {
      id: subscribePlanType.HALF.NAME,
      label: 'none', // best, new, none
      imageSrc: require('public/img/subscribe/subscribe_half_plan.png'),
      title: '하프플랜',
      titleDescHTML: (
        <p>
          하루 <strong>1끼</strong>
        </p>
      ),
      bodyDescHTML: {
        row1: (
          <>
            <span>{subscribePlanType.HALF.weeklyPaymentCycle}주</span>
            &nbsp;간격 배송
          </>
        ),
        row2: (
          <>
            총 <span>{subscribePlanType.HALF.totalNumberOfPacks} 팩</span>
            {/* <span>&nbsp;{subscribePlanType.HALF.numberOfPacksPerDay}팩</span> */}
          </>
        ),
        row3: <>{oneMealGramsWithRecipeInfosWithTags}</>,
        row4: (
          <>
            {subscribePlanType.HALF.totalNumberOfPacks}팩 x
            <span>
              &nbsp;
              {transformLocalCurrency(
                calcPrice(subscribePlanType.HALF.NAME).perPack,
              ) + '원'}
            </span>
          </>
        ),
      },
      price: {
        discount:
          subscribePlanInfo.planDiscountPercent[subscribePlanType.HALF.NAME],
        origin: transformLocalCurrency(
          calcPrice(subscribePlanType.HALF.NAME).originPrice,
        ),
        sale: transformLocalCurrency(
          calcPrice(subscribePlanType.HALF.NAME).salePrice,
        ),
      },
    },
    {
      id: subscribePlanType.TOPPING_FULL.NAME,
      // label: 'new', // best, new, none
      imageSrc: require('public/img/subscribe/subscribe_half_plan.png'),
      title: '토핑 풀플랜',
      titleDescHTML: (
        <p>
          하루 <strong>2끼</strong>
        </p>
      ),
      bodyDescHTML: {
        row1: (
          <>
            <span>{subscribePlanType.TOPPING_FULL.weeklyPaymentCycle}주</span>
            &nbsp; 간격 배송
          </>
        ),
        row2: (
          <>
            총{' '}
            <span>{subscribePlanType.TOPPING_FULL.totalNumberOfPacks} 팩</span>
          </>
        ),
        row3: <>{oneMealGramsWithRecipeInfosWithTags}</>,
        row4: (
          <>
            {subscribePlanType.TOPPING.totalNumberOfPacks}팩 x
            <span>
              &nbsp;
              {transformLocalCurrency(
                calcPrice(subscribePlanType.TOPPING.NAME).perPack,
              ) + '원'}
            </span>
          </>
        ),
      },
      price: {
        discount:
          subscribePlanInfo.planDiscountPercent[subscribePlanType.TOPPING.NAME],
        origin: transformLocalCurrency(
          calcPrice(subscribePlanType.TOPPING.NAME).originPrice,
        ),
        sale: transformLocalCurrency(
          calcPrice(subscribePlanType.TOPPING.NAME).salePrice,
        ),
      },
    },
    {
      id: subscribePlanType.TOPPING_HALF.NAME,
      // label: 'new', // best, new, none
      imageSrc: require('public/img/subscribe/subscribe_half_plan.png'),
      title: '토핑 하프플랜',
      titleDescHTML: (
        <p>
          하루 <strong>1끼</strong>
        </p>
      ),
      bodyDescHTML: {
        row1: (
          <>
            <span>{subscribePlanType.TOPPING_HALF.weeklyPaymentCycle}주</span>
            &nbsp; 간격 배송
          </>
        ),
        row2: (
          <>
            총{' '}
            <span>{subscribePlanType.TOPPING_HALF.totalNumberOfPacks} 팩</span>
          </>
        ),
        row3: <>{oneMealGramsWithRecipeInfosWithTags}</>,
        row4: (
          <>
            {subscribePlanType.TOPPING.totalNumberOfPacks}팩 x
            <span>
              &nbsp;
              {transformLocalCurrency(
                calcPrice(subscribePlanType.TOPPING.NAME).perPack,
              ) + '원'}
            </span>
          </>
        ),
      },
      price: {
        discount:
          subscribePlanInfo.planDiscountPercent[subscribePlanType.TOPPING.NAME],
        origin: transformLocalCurrency(
          calcPrice(subscribePlanType.TOPPING.NAME).originPrice,
        ),
        sale: transformLocalCurrency(
          calcPrice(subscribePlanType.TOPPING.NAME).salePrice,
        ),
      },
    },
  ];

  console.log(selectedPlan);

  return (
    <div className={s.plan_container}>
      <div className={s.plan_title}>
        {surveyInfo.myDogName} (을)를 위한 <span>플랜</span>을 선택해 주세요
        <div className={s.plan_title_info}>
          풀플랜: 2주 마다 배송 / 하프플랜: 4주마다 배송
        </div>
      </div>
      {/* 4-1) 플랜 선택 */}
      <div className={s.plan_list}>
        {subsribePlanItems.map((item, index) => (
          <SurveyPlanInput
            key={`${item.id}-${index}`}
            id={item.id}
            type="radio"
            name={name}
            selectedRadio={selectedPlan}
            setSelectedRadio={setSelectedPlan}
            option={{ label: '플랜 선택' }}
            initialize={initialize}
          >
            {/* {item.label === 'best' && (
              <ItemLabel
                label="BEST"
                style={{
                  backgroundColor: 'var(--color-main)',
                }}
              />
            )}
            {item.label === 'new' && (
              <ItemLabel
                label="NEW"
                style={{
                  backgroundColor: '#FF8C16',
                }}
              />
            )} */}
            <ul className={s.plan_box}>
              <li className={s.plan_grid_1}>
                <h2>{item.title}</h2>
              </li>
              <li className={s.plan_grid_2}>
                <div className={s.row_1}>{item.titleDescHTML}</div>
                {/* <div className={s.grid_box}> */}
                <div className={s.row_1}>{item.bodyDescHTML.row1}</div>
                {/* <div className={s.row_2}>{item.bodyDescHTML.row2}</div> */}
                {/* <div className={s.row_3}>{item.bodyDescHTML.row3}</div> */}
                {/* <div className={s.row_4}>{item.bodyDescHTML.row4}</div> */}
                {/* </div> */}
                <div className={s.text1}>{item.bodyDescHTML.row2}</div>
              </li>
              {/* <li>
                <div className={s.text1}>
                  {item.price.discount}%&nbsp;
                  <span>{item.price.origin}원</span>
                </div>
                <div className={s.text2}>{item.price.sale}원</div>
              </li> */}
            </ul>
          </SurveyPlanInput>
        ))}
      </div>

      {/* 4-2) 끼니, 팩 */}
      <div className={s.pack_box}>
        {/* (1) 선택 레시피 */}
        {/* 하프플랜, 풀플랜 선택에 따라 보여지는 칸 수가 달라지도록 */}
        <div className={s.one_pack_row}>
          <div className={s.one_pack_text}>
            선택 레시피: <br />
            (1팩 기준)
          </div>

          {recipeNameList.length < 2 ? (
            <div className={s.recipe_text_single}>
              <p>000g</p> <p className={s.recipe_name}>{recipeNameList[0]}</p>
            </div>
          ) : (
            recipeNameList.map((recipeName, index) => {
              return (
                <div className={s.recipe_text_double} key={index}>
                  <p>000g</p> <p className={s.recipe_name}>{recipeName}</p>
                </div>
              );
            })
          )}
        </div>

        {/* (2) 한 끼당 */}
        <div className={s.one_pack_row}>
          <div className={s.one_pack_text}>한 끼당:</div>
          {recipeNameList.length < 2 ? (
            <div className={s.recipe_text_single}>
              <p>0,000원</p>
            </div>
          ) : (
            recipeNameList.map((recipeName, index) => {
              return (
                <div className={s.recipe_text_double} key={index}>
                  <p>0,000원</p>
                </div>
              );
            })
          )}
        </div>

        {/* (3) 팩 수 */}
        <div className={s.one_pack_row}>
          <div className={s.one_pack_text}>팩수:</div>
          {recipeNameList.length < 2 ? (
            <div className={s.recipe_text_single}>
              <p>{recipeNameList.length === 1 ? '28' : '0'}팩</p>
            </div>
          ) : (
            recipeNameList.map((recipeName, index) => {
              return (
                <div className={s.recipe_text_double} key={index}>
                  <p>14팩</p>
                </div>
              );
            })
          )}
        </div>

        {/* (4) 최대 할인가 */}
        {/* - 결제페이지의 12개월 구독 혜택인 최대 '25%할인'가로 노출 */}
        {/* - 1회 배송 시 최대 할인가(25%)로 노출! */}
        <div className={s.discount_price_row}>
          <div className={s.one_pack_text}>최대 할인가:</div>
          <div className={s.recipe_text_single}>
            <p>00,000원</p>
          </div>
        </div>
      </div>
    </div>
  );
}
