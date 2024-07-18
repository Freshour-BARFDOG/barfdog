import React, { useEffect, useMemo, useRef, useState } from 'react';
import SurveyPlanInput from './SurveyPlanInput';
import Image from 'next/image';
import s from './surveyStatistics.module.scss';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { calcOneMealGramsWithRecipeInfo } from '/util/func/subscribe/calcOneMealGramsWithRecipeInfo';
import { useSubscribePlanInfo } from '/util/hook/useSubscribePlanInfo';
import { calcSubscribeOneDayRecommendKcal } from '/util/func/subscribe/calcOneMealGramsWithRecipeInfo';
import {
  valid_hasFormErrors,
  valid_isTheSameArray,
} from '/util/func/validation/validationPackage';
import { CustomSelectWithCustomOptions } from '/src/components/survey/CustomSelectWithCustomOptions';
import ScrollContainer from '../../atoms/ScrollContainer';
import CustomSelect from '/src/components/admin/form/CustomSelect';

export default function SurveyResultPlan({
  surveyInfo,
  recipeInfo,
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
  const [pricePerPack, setPricePerPack] = useState('');

  // const initialSelectedOption = value || options[0].value;
  const [selectedOption, setSelectedOption] = useState('');
  const [isActive, setIsActive] = useState(false);
  const optionBoxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const names = form.recipeIdList
      .map((id) => {
        const recipe = recipeInfo.find((info) => info.id === id);
        return recipe ? recipe.name : null;
      })
      .filter((name) => name !== null);

    setRecipeNameList(names);
  }, [recipeInfo, form]);

  useEffect(() => {
    setInitialize(true);
    setForm((prevState) => ({
      ...prevState,
      recipeIdList: form.recipeIdList,
    }));
  }, [form.plan]);

  useEffect(() => {
    if (selectedPlan) {
      const { avgPrice, recipePrices } = calcPrice(selectedPlan);

      // console.log('avgPrice, recipePrices', avgPrice, recipePrices);

      setPricePerPack({
        avgPrice: avgPrice.perPack,
        recipePrices,
      });
    }

    setForm((prevState) => ({
      ...prevState,
      plan: selectedPlan,
    }));

    setInitialize(null); //! null : 플랜 선택된 상태는 유지, form값 초기화
  }, [selectedPlan]);

  const oneMealGramsWithRecipeInfosWithTags = useMemo(
    () =>
      // 초기화(initialize)되었을 경우, 기본 값이 나타나도록 함.
      // initialize === false &&

      calcOneMealGramsWithRecipeInfo({
        selectedRecipeIds: selectedRecipeIds,
        allRecipeInfos: recipeInfo.map((recipe) => ({
          id: recipe.id,
          kcalPerGram: recipe.gramPerKcal,
          name: recipe.name,
        })),
        oneDayRecommendKcal: surveyInfo.foodAnalysis.oneDayRecommendKcal,
      })?.map((recipeInfo, i) => (
        <div className={s.recipe_text} key={i}>
          <b>{transformLocalCurrency(recipeInfo.oneMealGram)}g</b>&nbsp;
          <br />
          <i className={s.tinyText}>{recipeInfo.recipeName}</i>
        </div>
      )),

    {}[(form, initialize)],
  ) || (
    <div className={s.recipe_text}>
      <b>0 g</b>
    </div>
  );

  //*** 한 끼당 가격 계산 */
  const oneMealGramsWithPriceInfosWithTags = useMemo(
    () =>
      pricePerPack &&
      recipeNameList.map((recipeName, i) => {
        const matchingRecipePrice = pricePerPack.recipePrices.find(
          (item) => item.recipeName === recipeName,
        );
        if (!matchingRecipePrice) {
          return (
            <div className={s.recipe_text} key={i}>
              <b>0 원</b>
            </div>
          );
        }

        return (
          <div className={s.recipe_text} key={i}>
            <b>{transformLocalCurrency(matchingRecipePrice.perPack) + '원'}</b>
          </div>
        );
      }),
    {}[(form, form.recipeIdList, initialize)],
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
      // price: {
      //   discount:
      //     subscribePlanInfo.planDiscountPercent[subscribePlanType.FULL.NAME],
      //   origin: transformLocalCurrency(
      //     calcPrice(subscribePlanType.FULL.NAME)?.originPrice,
      //   ),
      //   sale: transformLocalCurrency(
      //     calcPrice(subscribePlanType.FULL.NAME)?.salePrice,
      //   ),
      // },
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
        // row4: (
        //   <>
        //     {subscribePlanType.HALF.totalNumberOfPacks}팩 x
        //     <span>
        //       &nbsp;
        //       {transformLocalCurrency(
        //         calcPrice(subscribePlanType.HALF.NAME)?.perPack,
        //       ) + '원'}
        //     </span>
        //   </>
        // ),
      },
      // price: {
      //   discount:
      //     subscribePlanInfo.planDiscountPercent[subscribePlanType.HALF.NAME],
      //   origin: transformLocalCurrency(
      //     calcPrice(subscribePlanType.HALF.NAME)?.originPrice,
      //   ),
      //   sale: transformLocalCurrency(
      //     calcPrice(subscribePlanType.HALF.NAME)?.salePrice,
      //   ),
      // },
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
        // row4: (
        //   <>
        //     {/* {subscribePlanType.TOPPING.totalNumberOfPacks}팩 x */}
        //     <span>
        //       &nbsp;
        //       {transformLocalCurrency(
        //         calcPrice(subscribePlanType.TOPPING_FULL.NAME)?.perPack,
        //       ) + '원'}
        //     </span>
        //   </>
        // ),
      },
      // price: {
      //   discount:
      //     subscribePlanInfo.planDiscountPercent[
      //       subscribePlanType.TOPPING_FULL.NAME
      //     ],
      //   origin: transformLocalCurrency(
      //     calcPrice(subscribePlanType.TOPPING_FULL.NAME)?.originPrice,
      //   ),
      //   sale: transformLocalCurrency(
      //     calcPrice(subscribePlanType.TOPPING_FULL.NAME)?.salePrice,
      //   ),
      // },
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
        // row4: (
        //   <>
        //     {subscribePlanType.TOPPING_HALF.totalNumberOfPacks}팩 x
        //     <span>
        //       &nbsp;
        //       {transformLocalCurrency(
        //         calcPrice(subscribePlanType.TOPPING_HALF.NAME)?.perPack,
        //       ) + '원'}
        //     </span>
        //   </>
        // ),
      },
      // price: {
      //   discount:
      //     subscribePlanInfo.planDiscountPercent[
      //       subscribePlanType.TOPPING_HALF.NAME
      //     ],
      //   origin: transformLocalCurrency(
      //     calcPrice(subscribePlanType.TOPPING_HALF.NAME)?.originPrice,
      //   ),
      //   sale: transformLocalCurrency(
      //     calcPrice(subscribePlanType.TOPPING_HALF.NAME)?.salePrice,
      //   ),
      // },
    },
  ];

  const onInputChange = (value) => {
    const nextAmount = value;
    // const nextGrams = form.originGrams.map((originGram) =>
    //   Number(
    //     (originGram * (1 + nextAmount / 100)).toFixed(
    //       UnitOfDemicalPointOfOneMealGramInDatabase,
    //     ),
    //   ),
    // ); // ! 1팩 당 무게: 최대 소수점 '4'자리
    // const recipePricePerGrams = form.recipeInfo.pricePerGramList;
    // const planTypeName = form.planInfo.planType;
    // const { perPack, salePrice } = calcSubscribePrice({
    //   discountPercent: subscribeInfo.plan.discountPercent,
    //   oneMealGrams: nextGrams,
    //   planName: planTypeName,
    //   pricePerGrams: recipePricePerGrams,
    //   isOriginSubscriber,
    //   recipeNameList: subscribeInfo.recipe.nameList.map((recipe) => recipe),
    // });
    // // // console.log(perPack, salePrice);
    // setForm((prevState) => ({
    //   ...prevState,
    //   nextAmount,
    //   nextGrams,
    //   nextPricePerPack: perPack,
    //   nextSalePrice: salePrice,
    // }));
  };

  // const onActiveOptionBox = () => {
  //   setIsActive(!isActive);
  // };

  // const onOptionClick = (e) => {
  //   const option = e.currentTarget;
  //   let value = option.dataset.value;
  //   setSelectedOption(value);
  //   if (dataType === 'number') {
  //     value = Number(value);
  //   }
  //   if (setValues && typeof setValues === 'function') {
  //     setValues((prevState) => ({
  //       ...prevState,
  //       [id]: value,
  //     }));
  //   }

  //   if (onChange && typeof onChange === 'function') {
  //     onChange(value);
  //   }
  // };

  // const optionList = [
  //   { label: '-20%', value: -20 },
  //   { label: '-35%', value: -35 },
  //   { label: '-50%', value: -50 },
  // ];

  // const Options = ({ value, label }) => {
  //   return (
  //     <p
  //       data-value={value}
  //       className={`${s.option} ${selectedOption === value ? s.selected : ''}`}
  //       onClick={onOptionClick}
  //     >
  //       {label || value}
  //     </p>
  //   );
  // };

  // useEffect(() => {
  //   // HIDE Option
  //   const optionBox = optionBoxRef.current;
  //   const viewerInput = inputRef.current;
  //   if (window && typeof window !== 'undefined' && optionBox && viewerInput) {
  //     document.body.addEventListener('click', (e) => {
  //       let isBoxClicked = false;
  //       const clickedTarget = e.target;
  //       const clickedElemList = [
  //         clickedTarget,
  //         ...Array.from(clickedTarget.children),
  //       ];
  //       clickedElemList.forEach((target) => {
  //         const targetClassName = target.className;
  //         // const exceptClassNameList = [input, optionBox, ...Array.from(optionBox.children)].map(list=>list.className);
  //         const exceptClassNameList = [
  //           optionBox,
  //           ...Array.from(optionBox.children),
  //         ].map((list) => list.className);
  //         if (exceptClassNameList.indexOf(targetClassName) >= 0) {
  //           isBoxClicked = true;
  //           return;
  //         }
  //       });
  //       if (isBoxClicked || clickedTarget !== viewerInput) {
  //         setIsActive(false);
  //       }
  //     });
  //   }
  // }, [optionBoxRef.current]);

  // // console.log(Number(surveyInfo.foodAnalysis.oneDayRecommendKcal).toFixed(0));
  // console.log(
  //   transformLocalCurrency(
  //     calcSubscribeOneDayRecommendKcal(
  //       surveyInfo.foodAnalysis.oneDayRecommendKcal,
  //     ),
  //   ),
  // );

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
        {subsribePlanItems
          .filter((item) =>
            calcSubscribeOneDayRecommendKcal(
              surveyInfo.foodAnalysis.oneDayRecommendKcal,
            ) <= 125
              ? !item.title.includes('토핑')
              : item,
          )
          .map((item, index) => {
            return (
              <SurveyPlanInput
                key={`${item.id}-${index}`}
                id={item.id}
                type="radio"
                name={name}
                selectedRadio={selectedPlan}
                setSelectedRadio={setSelectedPlan}
                setForm={setForm}
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
            );
          })}
      </div>

      {/* 4-2) 끼니, 팩 */}
      <div className={s.pack_box}>
        {/* (1) 선택 레시피 */}
        {/* 하프플랜, 풀플랜 선택에 따라 보여지는 칸 수가 달라지도록 */}
        <div className={s.one_pack_row}>
          <div className={s.one_pack_text}>
            {selectedPlan === 'TOPPING_FULL' ||
            selectedPlan === 'TOPPING_HALF' ? (
              <>
                하루 2끼 기준 <br />
                1끼당 권장량:
              </>
            ) : (
              <>
                선택 레시피: <br />
                (1팩 기준){' '}
              </>
            )}
          </div>

          {recipeNameList.length === 0 ? (
            <p className={s.recipe_single_wrapper}>
              <div className={s.recipe_text}>0 g</div>
            </p>
          ) : recipeNameList.length === 1 ? (
            <p className={s.recipe_single_wrapper}>
              {oneMealGramsWithRecipeInfosWithTags}
            </p>
          ) : (
            <p className={s.recipe_double_wrapper}>
              {oneMealGramsWithRecipeInfosWithTags}
            </p>
          )}
        </div>

        {/* +++ 토핑 플랜 */}
        {(selectedPlan === 'TOPPING_FULL' ||
          selectedPlan === 'TOPPING_HALF') && (
          <>
            <div className={s.one_pack_row}>
              <div className={s.one_pack_text}>토핑 용량 조절:</div>
              <div className={s.selectBox}>
                <CustomSelect
                  id="toppingAmount"
                  options={[
                    { label: '선택', value: '' },
                    { label: '20%', value: 20 },
                    { label: '40%', value: 40 },
                    { label: '60%', value: 60 },
                    { label: '80%', value: 80 },
                  ]}
                  // value={formValues.itemType}
                  // setFormValues={setFormValues}
                />
                {/* <CustomSelectWithCustomOptions
                  placeholder={'원하는 용량을 조절해주세요'}
                  id={'gramAmount'}
                  className={s.customSelect}
                  options={[
                    { label: '20%', value: 20 },
                    { label: '40%', value: 40 },
                    { label: '60%', value: 60 },
                    { label: '80%', value: 80 },
                  ]}
                  // value={form.nextAmount === 0 ? '0' : form.nextAmount}
                  value={0}
                  unit={'%'}
                  onChange={onInputChange}
                  height={'120'}
                /> */}
                {/* <div
                  className={`${s['customSelectWithOptions']} ${s.customSelect}`}
                >
                  <input
                    type="text"
                    placeholder={'원하는 용량을 조절해주세요'}
                    id={'gramAmount'}
                    className={'customSelectInput'}
                    onClick={onActiveOptionBox}
                    ref={inputRef}
                    readOnly
                    value={selectedOption || ''}
                    onChange={onInputChange}
                  />
                  <em className={s.unit}>%</em>
                  <ScrollContainer
                    height={'200'}
                    scrollBarWidth={'0'}
                    className={`${s.scrollContainer} ${
                      isActive ? s.active : ''
                    }`}
                    ref={optionBoxRef}
                  >
                    {optionList.map((option, i) => (
                      <Options
                        key={`options-${i}`}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </ScrollContainer>
                </div> */}
              </div>
            </div>
            <div className={s.one_pack_row}>
              <div className={s.one_pack_text}>토핑용 1팩:</div>
              <div className={s.selectBox}>
                {' '}
                {recipeNameList.length === 0 ? (
                  <p className={s.recipe_single_wrapper}>
                    <div className={s.recipe_text}>0 g</div>
                  </p>
                ) : recipeNameList.length === 1 ? (
                  <p className={s.recipe_single_wrapper}>
                    {oneMealGramsWithRecipeInfosWithTags}
                  </p>
                ) : (
                  <p className={s.recipe_double_wrapper}>
                    {oneMealGramsWithRecipeInfosWithTags}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* (2) 한 끼당 */}
        <div className={s.one_pack_row}>
          <div className={s.one_pack_text}>한 끼당:</div>
          {recipeNameList.length === 0 ? (
            <p className={s.recipe_single_wrapper}>
              <div className={s.recipe_text}>0 원</div>
            </p>
          ) : recipeNameList.length === 1 ? (
            <p className={s.recipe_single_wrapper}>
              {oneMealGramsWithPriceInfosWithTags || (
                <div className={s.recipe_text}>
                  <b>0 원</b>
                </div>
              )}
            </p>
          ) : (
            <p className={s.recipe_double_wrapper}>
              {oneMealGramsWithPriceInfosWithTags || (
                <>
                  <div className={s.recipe_text}>
                    <b>0 원</b>
                  </div>
                  <div className={s.recipe_text}>
                    <b>0 원</b>
                  </div>
                </>
              )}
            </p>
          )}
        </div>

        {/* (3) 팩 수 */}
        <div className={s.one_pack_row}>
          <div className={s.one_pack_text}>팩수:</div>
          {recipeNameList.length < 2 ? (
            <div className={s.recipe_text_single}>
              <p>{recipeNameList.length === 1 ? '28' : '0'} 팩</p>
            </div>
          ) : (
            recipeNameList.map((recipeName, index) => {
              return (
                <div className={s.recipe_text_double} key={index}>
                  <p>14 팩</p>
                </div>
              );
            })
          )}
        </div>

        {/* (4) 최대 할인가 */}
        {/* - 결제페이지의 12개월 구독 혜택인 최대 '25%할인'가로 노출 */}
        {/* - 1회 배송 시 최대 할인가(25%)로 노출! */}
        <div className={s.one_pack_row}>
          <div className={s.one_pack_text}>최대 할인가:</div>
          <div className={s.recipe_text_single}>
            <p>0 원</p>
          </div>
        </div>
      </div>
    </div>
  );
}
