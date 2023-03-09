import React, {useEffect, useMemo, useState} from 'react';
import s from '/src/pages/order/subscribeShop/index.module.scss';
import CustomInput from '/src/components/atoms/CustomInput';
import ItemLabel from '/src/components/atoms/ItemLabel';
import Image from 'next/image';
import {subscribePlanType} from '/store/TYPE/subscribePlanType';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import {calcOneMealGramsWithRecipeInfo} from "/util/func/subscribe/calcOneMealGramsWithRecipeInfo";


export const SubscribeShopPlan = ({ name, info, form, setForm, calcPrice }) => {
  
  const initialPlan = form.plan || null
  const [selectedPlan, setSelectedPlan] = useState( initialPlan );
  const [initialize, setInitialize] = useState(false);
  const selectedRecipeIds = form.recipeIdList;
  const maxSelectedRecipeCount = 2;
  
  useEffect( () => {
    // 최대 선택가능한 레시피개수가 많아졌을 경우, 초기화 시킴.
    
    const seletedRecipeCount = form.recipeIdList.length;
    setInitialize( seletedRecipeCount > maxSelectedRecipeCount );
  
  }, [form.recipeIdList] );
  
  
  useEffect( () => {
    
    setForm( (prevState) => ({
      ...prevState,
      plan: selectedPlan,
    }) );
    
    setInitialize( null); // null : 플랜 선택된 상태는 유지, form값 초기화
    
  }, [selectedPlan] );
  
  
  
  const oneMealGramsWithRecipeInfosWithTags = useMemo( () =>
    // 초기화(initialize)되었을 경우, 기본 값이 나타나도록 함.
        initialize === false && calcOneMealGramsWithRecipeInfo( {
    selectedRecipeIds: selectedRecipeIds,
    allRecipeInfos: info.recipeInfoList.map( (recipe) => ({id: recipe.id, kcalPerGram: recipe.kcalPerGram, name: recipe.name}) ),
    oneDayRecommendKcal: info.foodAnalysis.oneDayRecommendKcal,
  })?.map(
    (recipeInfo, i) =>
      <span className={s.oneLine} key={`oneMealGram-info-${i}`}><b>{transformLocalCurrency(recipeInfo.oneMealGram)}g</b>&nbsp;<i className={s.tinyText}>(1팩 기준){selectedRecipeIds.length > 1 && ` (${recipeInfo.recipeName})`}</i></span> )
      , [form, initialize] )
    || <span className={s.oneLine}><b>0g</b>&nbsp;<i className={s.tinyText}>(1팩 기준)</i></span>;
  
  
  
  
  const subsribePlanItems = [
    {
      id: subscribePlanType.FULL.NAME,
      label: "best", // best, new, none
      imageSrc: require( "public/img/subscribe/subscribe_full_plan.png" ),
      title: "풀플랜",
      titleDescHTML: <p>하루에 <span>두 끼</span>를 바프독으로 먹어요</p>,
      bodyDescHTML: {
        row1:
          <>하루에<span>&nbsp;{subscribePlanType.FULL.numberOfPacksPerDay}팩</span></>,
        row2:
          <><span>{subscribePlanType.FULL.weeklyPaymentCycle}주</span>&nbsp;정기배송</>,
        row3:
          <>
            {oneMealGramsWithRecipeInfosWithTags}
          </>,
        row4:
          <>{subscribePlanType.FULL.totalNumberOfPacks}팩 x
            <span>&nbsp;{transformLocalCurrency( calcPrice( subscribePlanType.FULL.NAME ).perPack ) + '원'}</span></>
      },
      price: {
        discount: info.planDiscountPercent[subscribePlanType.FULL.NAME],
        origin: transformLocalCurrency(
          calcPrice( subscribePlanType.FULL.NAME )
            .originPrice,
        ),
        sale: transformLocalCurrency(
          calcPrice( subscribePlanType.FULL.NAME ).salePrice,
        )
      }
    },
    {
      id: subscribePlanType.HALF.NAME,
      label: "none", // best, new, none
      imageSrc: require( "public/img/subscribe/subscribe_half_plan.png" ),
      title: "하프플랜",
      titleDescHTML: <p>하루에 <span>한 끼</span>를 바프독으로 먹어요</p>,
      bodyDescHTML: {
        row1:
          <>하루에<span>&nbsp;{subscribePlanType.HALF.numberOfPacksPerDay}팩</span></>,
        row2:
          <><span>{subscribePlanType.HALF.weeklyPaymentCycle}주</span>&nbsp;정기배송</>,
        row3:
          <>{oneMealGramsWithRecipeInfosWithTags}</>,
        row4:
          <>{subscribePlanType.HALF.totalNumberOfPacks}팩 x
            <span>&nbsp;{transformLocalCurrency( calcPrice( subscribePlanType.HALF.NAME ).perPack ) + '원'}</span></>
      },
      price: {
        discount: info.planDiscountPercent[subscribePlanType.HALF.NAME],
        origin: transformLocalCurrency(
          calcPrice( subscribePlanType.HALF.NAME )
            .originPrice,
        ),
        sale: transformLocalCurrency(
          calcPrice( subscribePlanType.HALF.NAME ).salePrice,
        )
      }
    },
    {
      id: subscribePlanType.TOPPING.NAME,
      label: "new", // best, new, none
      imageSrc: require( "public/img/subscribe/subscribe_half_plan.png" ),
      title: "토핑플랜",
      titleDescHTML: <p>토핑용으로 바프독으로 섞어서 먹어요</p>,
      bodyDescHTML: {
        row1:
          <><span>{"토핑"}</span></>,
        row2:
          <><span>{subscribePlanType.TOPPING.weeklyPaymentCycle}주</span>&nbsp;정기배송</>,
        row3:
          <>{oneMealGramsWithRecipeInfosWithTags}</>,
        row4:
          <>{subscribePlanType.TOPPING.totalNumberOfPacks}팩 x
            <span>&nbsp;{transformLocalCurrency( calcPrice( subscribePlanType.TOPPING.NAME ).perPack ) + '원'}</span></>
      },
      price: {
        discount: info.planDiscountPercent[subscribePlanType.TOPPING.NAME],
        origin: transformLocalCurrency(
          calcPrice( subscribePlanType.TOPPING.NAME )
            .originPrice,
        ),
        sale: transformLocalCurrency(
          calcPrice( subscribePlanType.TOPPING.NAME ).salePrice,
        )
      }
    }
  ];
  
  
  return (
    <section className={s.regular_delivery}>
      <div className={s.regular_delivery_title}>
        <p>급여량에 따른 정기배송 수량을 선택해 주세요</p>
        <h3 className={s.desc}>레시피를 선택하시면 가격이 노출됩니다.</h3>
      </div>
      <div className={s.flex_box} data-input-title={name}>
        {subsribePlanItems.map( (item, index) => <CustomInput
          key={`${item.id}-${index}`}
          id={item.id}
          type="radio"
          name={name}
          selectedRadio={selectedPlan}
          setSelectedRadio={setSelectedPlan}
          option={{label: '플랜 선택'}}
          initialize={initialize}
        >
          {item.label === "best" && <ItemLabel
            label="BEST"
            style={{
              backgroundColor: 'var(--color-main)',
            }}
          />}
          {item.label === "new" && <ItemLabel
            label="NEW"
            style={{
              backgroundColor: '#FF8C16',
            }}
          />}
          <ul className={s.plan_box}>
            <li className={s.plan_grid_1}>
              <div className={s.img_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={item.imageSrc}
                    objectFit="cover"
                    layout="fill"
                    alt="플랜 아이콘"
                  />
                </div>
              </div>
              <h2>{item.title}</h2>
            </li>
            <li>
              {item.titleDescHTML}
            </li>
            <li>
              <div className={s.grid_box}>
                <div className={s.row_1}>
                  {item.bodyDescHTML.row1}
                </div>
                <div className={s.row_2}>
                  {item.bodyDescHTML.row2}
                </div>
                <div className={s.row_3}>
                  {item.bodyDescHTML.row3}
                </div>
                <div className={s.row_4}>
                  {item.bodyDescHTML.row4}
                </div>
              </div>
            </li>
            <li>
              <div className={s.text1}>
                {item.price.discount}%&nbsp;
                <span>{item.price.origin}원</span>
              </div>
              <div className={s.text2}>
                {item.price.sale}원
              </div>
            </li>
          </ul>
        </CustomInput> )}
      </div>
    </section>
  );
};
