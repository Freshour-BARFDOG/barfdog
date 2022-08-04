import React, { useEffect, useState } from 'react';
import s from '../../pages/order/subscribeShop/index.module.scss';
import CustomInput from '../atoms/CustomInput';
import ItemLabel from '../atoms/ItemLabel';
import Image from 'next/image';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import transformLocalCurrency from '/util/func/transformLocalCurrency';

export const SubscribePlan = ({ name, info, form, setForm, calcPrice }) => {
  
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    setForm((prevState) => ({
      ...prevState,
      plan: selectedPlan,
    }));
    // 선택된 플랜을 의존성으로 넣어서 계산한다.
  }, [selectedPlan]);

  return (
    <section className={s.regular_delivery}>
      <div className={s.regular_delivery_title}>급여량에 따른 정기배송 수량을 선택해 주세요</div>
      <div className={s.flex_box} data-input-title={name}>
        <CustomInput
          id={subscribePlanType.FULL.NAME}
          type="radio"
          name={name}
          selectedRadio={selectedPlan}
          setSelectedRadio={setSelectedPlan}
        >
          <ItemLabel
            label="BEST"
            style={{
              backgroundColor: 'var(--color-main)',
            }}
          />
          <ul className={s.plan_box}>
            <li className={s.plan_grid_1}>

              <div className={s.img_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require('public/img/subscribe/subscribe_full_plan.png')}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>

              <h2>풀플랜</h2>
            </li>

            <li>
              <p>하루에 <span>두 끼</span>를 바프독으로 먹어요</p>
            </li>

            <li>
              <div className={s.grid_box}>
                <div className={s.row_1}>
                  하루에<span>&nbsp;{subscribePlanType.FULL.numberOfPacksPerDay}팩</span>
                </div>
                <div className={s.row_2}>
                  <span>{subscribePlanType.FULL.weeklyPaymentCycle}주</span>&nbsp;정기배송
                </div>
                <div className={s.row_3}>
                  <span>{info.foodAnalysis.oneMealRecommendGram}g</span>&nbsp;(1팩기준)
                </div>
                <div className={s.row_4}>
                  {subscribePlanType.FULL.totalNumberOfPacks}팩 x
                  <span>
                    &nbsp;{transformLocalCurrency(calcPrice().perPack) + '원'}
                  </span>
                </div>
              </div>
            </li>

            <li>
              {form.recipeIdList?.length > 0 && form.recipeIdList[0] && (
                <div className={s.text1}>
                  {subscribePlanType.FULL.discountPercent + '%'}&nbsp;
                  <span>
                    {transformLocalCurrency(
                      calcPrice(subscribePlanType.FULL.totalNumberOfPacks)
                        .originPrice,
                    )}
                    원
                  </span>
                </div>
              )}
              {form.recipeIdList?.length > 0 && form.recipeIdList[0] && (
                <div className={s.text2}>
                  {transformLocalCurrency(
                    calcPrice(
                      subscribePlanType.FULL.totalNumberOfPacks,
                      subscribePlanType.FULL.discountPercent,
                    ).salePrice,
                  )}
                  원
                </div>
              )}
            </li>

          </ul>
        </CustomInput>

        <CustomInput
          id={subscribePlanType.HALF.NAME}
          type="radio"
          name={name}
          selectedRadio={selectedPlan}
          setSelectedRadio={setSelectedPlan}
        >
          <ul className={s.plan_box}>
            <li className={s.plan_grid_1}>
              <div className={s.img_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require('public/img/subscribe/subscribe_half_plan.png')}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>

              <h2>하프플랜</h2>
            </li>

            <li>
              <p>하루에 <span>한 끼</span>를 바프독으로 먹어요</p>
            </li>

            <li>
              <div className={s.grid_box}>
                <div className={s.row_1}>
                  하루에<span>&nbsp;{subscribePlanType.HALF.numberOfPacksPerDay}팩</span>
                </div>
                <div className={s.row_2}>
                  <span>{subscribePlanType.HALF.weeklyPaymentCycle}주</span>&nbsp;정기배송
                </div>
                <div className={s.row_3}>
                  <span>{info.foodAnalysis.oneMealRecommendGram}g</span>&nbsp;(1팩기준)
                </div>
                <div className={s.row_4}>
                  {subscribePlanType.HALF.totalNumberOfPacks}팩 x
                  <span>
                    &nbsp;{transformLocalCurrency(calcPrice().perPack) + '원'}
                  </span>
                </div>
              </div>
            </li>

            <li>
              {form.recipeIdList?.length > 0 && form.recipeIdList[0] && (
                <div className={s.text1}>
                  {subscribePlanType.HALF.discountPercent + '%'}&nbsp;
                  <span>
                    {transformLocalCurrency(
                      calcPrice(subscribePlanType.HALF.totalNumberOfPacks)
                        .originPrice,
                    )}
                    원
                  </span>
                </div>
              )}
              {form.recipeIdList?.length > 0 && form.recipeIdList[0] && (
                <div className={s.text2}>
                  {transformLocalCurrency(
                    calcPrice(
                      subscribePlanType.HALF.totalNumberOfPacks,
                      subscribePlanType.HALF.discountPercent,
                    ).salePrice,
                  )}
                  원
                </div>
              )}
            </li>
            
          </ul>
        </CustomInput>

        <CustomInput
          id={subscribePlanType.TOPPING.NAME}
          type="radio"
          name={name}
          selectedRadio={selectedPlan}
          setSelectedRadio={setSelectedPlan}
        >
          <ItemLabel
            label="NEW"
            style={{
              backgroundColor: '#FF8C16',
            }}
          />

          <ul className={s.plan_box}>
            <li className={s.plan_grid_1}>
              <div className={s.img_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require('public/img/subscribe/subscribe_half_plan.png')}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>

              <h2>토핑플랜</h2>
            </li>

            <li>
              <p>토핑용으로 바프독으로 섞어서 먹어요</p>
            </li>

            <li>
              <div className={s.grid_box}>
                <div className={s.row_1}>
                  하루에<span>&nbsp;{subscribePlanType.HALF.numberOfPacksPerDay}팩</span>
                </div>
                <div className={s.row_2}>
                  <span>{subscribePlanType.HALF.weeklyPaymentCycle}주</span>&nbsp;정기배송
                </div>
                <div className={s.row_3}>
                  <span>{info.foodAnalysis.oneMealRecommendGram}g</span>&nbsp;(1팩기준)
                </div>
                <div className={s.row_4}>
                  {subscribePlanType.TOPPING.totalNumberOfPacks}팩 x
                  <span>
                    &nbsp;{transformLocalCurrency(calcPrice().perPack) + '원'}
                  </span>
                </div>
              </div>
            </li>

            <li>
              {form.recipeIdList?.length > 0 && form.recipeIdList[0] && (
                <div className={s.text1} style={{ opacity: `${!form.recipeIdList ? 0 : 1}` }}>
                  {subscribePlanType.TOPPING.discountPercent + '%'}&nbsp;
                  <span>
                    {transformLocalCurrency(
                      calcPrice(subscribePlanType.TOPPING.totalNumberOfPacks)
                        .originPrice,
                    )}
                    원
                  </span>
                </div>
              )}
              {form.recipeIdList?.length > 0 && form.recipeIdList[0] && (
                <div className={s.text2}>
                  {transformLocalCurrency(
                    calcPrice(
                      subscribePlanType.TOPPING.totalNumberOfPacks,
                      subscribePlanType.TOPPING.discountPercent,
                    ).salePrice,
                  )}
                  원
                </div>
              )}
            </li>

            
          </ul>
        </CustomInput>
      </div>
    </section>
  );
};
