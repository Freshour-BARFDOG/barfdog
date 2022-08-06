import React, { useEffect, useState } from 'react';
import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import CustomInput from '../atoms/CustomInput';
import Image from 'next/image';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import ItemLabel from '/src/components/atoms/ItemLabel';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { getData, getDataSSR } from '/src/pages/api/reqData';

export const SubscribePlan = ({ name = 'test' }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [info, setInfo] = useState({});

  useEffect(() => {
    async () => {
      const getRecipeInfoApiUrl = `/api/recipes`;
      const recipeInfoRes = await getData(getRecipeInfoApiUrl);
      const recipeIdList =
        recipeInfoRes?.data?._embedded?.recipeListResponseDtoList?.map((l) => l.id) || [];
      const recipeInfoList = [];
      for (const recipeId of recipeIdList) {
        const apiUrl = `/api/recipes/${recipeId}`;
        const res = await getData(apiUrl);
        // console.log(res)
        recipeInfoList.push(res.data);
        setInfo(recipeInfoList);
      }
    };
  }, []);

  const planInfoList = [
    {
      id: subscribePlanType.FULL.NAME,
      name: subscribePlanType.FULL.KOR,
      imageUrl: require('/public/img/subscribe/subscribe_full_plan.png'),
      desc: '하루에 두 끼를 바프독으로 섞어서 먹어요',
      onePackGram: 100,
      numberOfPacksPerDay: subscribePlanType.FULL.numberOfPacksPerDay,
      totalNumberOfPacks: subscribePlanType.FULL.totalNumberOfPacks,
      weeklyPaymentCycle: subscribePlanType.FULL.weeklyPaymentCycle,
      discountPercent: subscribePlanType.FULL.discountPercent,
      price: {
        onePack: 3800,
        origin: 144000,
        sale: 122000,
      },
      option: {
        itemLabel: (
          <ItemLabel
            label="BEST"
            style={{
              backgroundColor: 'var(--color-main)',
            }}
          />
        ),
      },
    },
    {
      id: subscribePlanType.HALF.NAME,
      name: subscribePlanType.HALF.KOR,
      imageUrl: require('/public/img/subscribe/subscribe_half_plan.png'),
      desc: '하루에 한 끼를 바프독으로 섞어서 먹어요',
      onePackGram: 100,
      numberOfPacksPerDay: subscribePlanType.HALF.numberOfPacksPerDay,
      totalNumberOfPacks: subscribePlanType.HALF.totalNumberOfPacks,
      weeklyPaymentCycle: subscribePlanType.HALF.weeklyPaymentCycle,
      discountPercent: subscribePlanType.HALF.discountPercent,
      price: {
        onePack: 3800,
        origin: 144000,
        sale: 122000,
      },
      option: {
        itemLabel: null,
      },
    },
    {
      id: subscribePlanType.TOPPING.NAME,
      name: subscribePlanType.TOPPING.KOR,
      imageUrl: require('/public/img/subscribe/subscribe_half_plan.png'),
      desc: '토핑용으로 바프독으로 섞어서 먹어요',
      onePackGram: 100,
      numberOfPacksPerDay: subscribePlanType.TOPPING.numberOfPacksPerDay,
      totalNumberOfPacks: subscribePlanType.TOPPING.totalNumberOfPacks,
      weeklyPaymentCycle: subscribePlanType.TOPPING.weeklyPaymentCycle,
      discountPercent: subscribePlanType.TOPPING.discountPercent,
      price: {
        onePack: 3800,
        origin: 144000,
        sale: 122000,
      },
      option: {
        itemLabel: (
          <ItemLabel
            label="NEW"
            style={{
              backgroundColor: '#FF8C16',
            }}
          />
        ),
      },
    },
  ];

  return (
    <>
      <div className={`${s.flex_box} ${s.subscribePlan}`}>
        {planInfoList.map((info) => (
          <CustomInput
            id={info.id}
            type="radio"
            name={'plan'}
            selectedRadio={selectedPlan}
            setSelectedRadio={setSelectedPlan}
            option={{ label: '플랜 선택' }}
          >
            {info.option.itemLabel}
            <ul className={s.plan_box}>
              <li className={s.plan_grid_1}>
                <div className={s.img_box}>
                  <figure className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={info.imageUrl}
                      objectFit="cover"
                      layout="fill"
                      alt="아이콘 이미지"
                    />
                  </figure>
                </div>
                <h2>{info.name}</h2>
              </li>
              <li>
                <p>
                  {info.desc}
                </p>
              </li>
              <li>
                <div className={s.grid_box}>
                  <div className={s.row_1}>
                    하루에<span>&nbsp;{info.numberOfPacksPerDay}팩</span>
                  </div>
                  <div className={s.row_2}>
                    <span>{info.weeklyPaymentCycle}주</span>&nbsp;정기배송
                  </div>
                  <div className={s.row_3}>
                    <span>{info.onePackGram}g</span>&nbsp;(1팩기준)
                  </div>
                  <div className={s.row_4}>
                    {info.totalNumberOfPacks}팩 x
                    <span>&nbsp;{transformLocalCurrency(info.price.onePack)}원</span>
                  </div>
                </div>
              </li>

              <li className={s.price}>
                <p className={s.text1}>
                  {info.discountPercent}%&nbsp;
                  <span>
                    {transformLocalCurrency(info.price.origin)}원
                  </span>
                </p>
                <p className={s.text2}>
                  {transformLocalCurrency(info.price.sale)}원
                </p>
              </li>
            </ul>
          </CustomInput>
        ))}
      </div>
      <div className={s.recipe_btn_box}>
        <button type={'button'} className={s.btn}>변경 플랜 적용하기</button>
      </div>
    </>
  );
};

//
// const calcSubscribePlanPaymentPrice = (totalNumberOfPacks, discountPercent) => {
//   // if (!form.recipeIdList[0]) {
//   //   return {
//   //     perPack: 0,
//   //     originPrice: 0,
//   //     salePrice: 0,
//   //   };
//   // }
//   //
//   // const selectedRecipes = info.recipeInfoList?.filter(
//   //   (rc) => form.recipeIdList.indexOf(rc.id) >= 0,
//   // );
//   // const result = selectedRecipes?.map((recipe) => {
//   //   const recipeGramConst = recipe.pricePerGram; // 1g 당 가격 상수 ( 어드민에서 입력한 값 )
//   //   const recipeGram = info?.foodAnalysis.oneMealRecommendGram; // 한끼(한팩) 무게g
//   //   const perPack = Number((recipeGramConst * recipeGram).toFixed(0));
//   //
//   //   return {
//   //     perPack: perPack, // 팩당가격상수 * 무게
//   //     originPrice: totalNumberOfPacks * perPack, // 할인 전 가격
//   //     salePrice: totalNumberOfPacks * perPack * (1 - discountPercent / 100), // 할인 후 가격 (판매가)
//   //   };
//   // });
//
//   // // 평균
//   // let perPack = result.map((r) => r.perPack).reduce((acc, cur) => acc + cur) / result.length;
//   // let originPrice =
//   //   result.map((r) => r.originPrice).reduce((acc, cur) => acc + cur) / result.length;
//   // let salePrice = result.map((r) => r.salePrice).reduce((acc, cur) => acc + cur) / result.length; // ! 1원 단위 절삭
//   // // console.log(result)
//   // const cutOffUnit = 10; // '10'원단위로 절사 (1원단위 버림)
//   // perPack = Math.floor(perPack / cutOffUnit) * cutOffUnit;
//   // originPrice = Math.floor(originPrice / cutOffUnit) * cutOffUnit;
//   // salePrice = Math.floor(salePrice / cutOffUnit) * cutOffUnit;
//   // return {
//   //   perPack,
//   //   originPrice,
//   //   salePrice,
//   // };
// };
