import React, { useState } from 'react';
import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import CustomInput from '../atoms/CustomInput';
import Image from 'next/image';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import ItemLabel from '/src/components/atoms/ItemLabel';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import Spinner from '/src/components/atoms/Spinner';
import { postObjData } from '/src/pages/api/reqData';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import { useModalContext } from '/store/modal-context';
import { FullScreenLoading } from '../atoms/FullScreenLoading';
import { useSubscribePlanInfo } from '/util/hook/useSubscribePlanInfo';
import { roundedOneMealGram } from '/util/func/subscribe/roundedOneMealGram';
import SurveyPlanInput from '../survey/result/SurveyPlanInput';
import { calcSubscribeOneDayRecommendKcal } from '/util/func/subscribe/calcOneMealGramsWithRecipeInfo';

export const SubscribePlan = ({ subscribeInfo }) => {
  const subscribePlanInfo = useSubscribePlanInfo();
  const oneMealGramsPerRecipe = subscribeInfo.info.oneMealGramsPerRecipe;

  const mct = useModalContext();
  const currentPlanName = subscribeInfo.info.planName;
  const [selectedPlanName, setSelectedPlanName] = useState(currentPlanName);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);

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
            총 <span>{subscribePlanType.FULL.totalNumberOfPacks} 팩</span>
          </>
        ),
        row3: (
          <>
            {selectedPlanName === 'FULL' ? (
              <Image
                src={'/img/survey/full_plan_active.svg'}
                alt="half_plan_active"
                width={40}
                height={40}
              />
            ) : (
              <Image
                src={'/img/survey/full_plan.svg'}
                alt="half_plan"
                width={40}
                height={40}
              />
            )}
          </>
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
          </>
        ),
        row3: (
          <>
            {selectedPlanName === 'HALF' ? (
              <Image
                src={'/img/survey/half_plan_active.svg'}
                alt="half_plan_active"
                width={40}
                height={40}
              />
            ) : (
              <Image
                src={'/img/survey/half_plan.svg'}
                alt="half_plan"
                width={40}
                height={40}
              />
            )}
          </>
        ),
      },
    },
    {
      id: subscribePlanType.TOPPING_FULL.NAME,
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
      },
    },
    {
      id: subscribePlanType.TOPPING_HALF.NAME,
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
      },
    },
  ];

  const onActiveConfirmModal = () => {
    const currentRecipeCount = subscribeInfo.recipe.idList.length;
    // ! validation : 처음과 동일한 플랜일 경우
    if (selectedPlanName === currentPlanName) {
      mct.alertShow('기존과 동일한 플랜입니다.');
    } else if (
      subscribePlanType[selectedPlanName].maxRecipeCount < currentRecipeCount
    ) {
      mct.alertShow(
        '구독 중인 레시피 개수가 변경될 플랜의 최대 선택 가능한 레시피 개수보다 많습니다.',
      );
    } else {
      setActiveConfirmModal(true);
    }
  };

  const onChangePlan = async (confirm) => {
    if (submitted) return console.error('이미 제출된 양식입니다.');
    if (!confirm) {
      return setActiveConfirmModal(false);
    }

    const body = {
      plan: selectedPlanName,
      nextPaymentPrice: subscribeInfo.price[selectedPlanName].salePrice, // 선택된 플랜의 판매가격
      recipeIdList: subscribeInfo.recipe.idList,
    };

    // validation: Incorrect paymentPrice
    if (!body.nextPaymentPrice)
      return mct.alertShow('결제금액 계산오류가 발생하였습니다.');

    try {
      setIsLoading(true);
      setSubmitted(true);
      const url = `/api/subscribes/${subscribeInfo.info.subscribeId}/planRecipes`;
      const res = await postObjData(url, body);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow(
          '플랜 변경이 완료되었습니다.',
          onSuccessChangeSubscribeOrder,
        );
      } else {
        mct.alertShow(`데이터 전송 실패\n${res.error}`);
        setSubmitted(false);
      }
      setActiveConfirmModal(false);
    } catch (err) {
      console.error('err: ', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSuccessChangeSubscribeOrder = () => {
    setIsLoading({ reload: true });
    window.location.reload();
  };
  if (isLoading.reload || subscribePlanInfo.isLoading) {
    return <FullScreenLoading opacity={1} />;
  }

  console.log('subscribeInfo___', subscribeInfo);
  console.log('selectedPlanName___', selectedPlanName);

  return (
    <>
      <div className={s.plan_container}>
        <div className={s.plan_title}>
          <div className={s.plan_title_info}>
            풀플랜: 2주 마다 배송 / 하프플랜: 4주마다 배송
          </div>
        </div>
        {/* 4-1) 플랜 선택 */}
        <div className={s.plan_list}>
          {subsribePlanItems
            .filter((item) =>
              calcSubscribeOneDayRecommendKcal(
                subscribeInfo.info.oneDayRecommendKcal,
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
                  selectedRadio={selectedPlanName}
                  setSelectedRadio={setSelectedPlanName}
                  // setForm={setForm}
                  option={{ label: '플랜 선택' }}
                  // initialize={initialize}
                >
                  <ul className={s.plan_box}>
                    <li className={s.plan_grid_1}>
                      <h2>
                        {item.title}
                        {item.bodyDescHTML.row3}
                      </h2>
                    </li>
                    <li className={s.plan_grid_2}>
                      <div className={s.row_1}>{item.titleDescHTML}</div> /
                      <div className={s.row_1}>{item.bodyDescHTML.row1}</div> /
                      <div className={s.text1}>{item.bodyDescHTML.row2}</div>
                    </li>
                  </ul>
                </SurveyPlanInput>
              );
            })}
        </div>

        {/* 4-2) 끼니, 팩 */}
        {/* <div className={s.pack_box}> */}
        {/* (1) 선택 레시피 */}
        {/* 하프플랜, 풀플랜 선택에 따라 보여지는 칸 수가 달라지도록 */}
        {/* <div className={s.one_pack_row}>
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
          </div> */}

        {/* +++ 토핑 플랜 */}
        {/* {(selectedPlan === 'TOPPING_FULL' ||
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
                    value={toppingAmount}
                    setFormValues={setToppingAmount}
                  />
                </div>
              </div>
              <div className={s.one_pack_row}>
                <div className={s.one_pack_text}>토핑용 1팩:</div>
                <div className={s.selectBox}>
                  {recipeNameList.length === 0 ? (
                    <p className={s.recipe_single_wrapper}>
                      <div className={s.recipe_text}>0 g</div>
                    </p>
                  ) : recipeNameList.length === 1 ? (
                    <p className={s.recipe_single_wrapper}>
                      {oneMealGramsWithToppingAmountWithTags}
                    </p>
                  ) : (
                    <p className={s.recipe_double_wrapper}>
                      {oneMealGramsWithToppingAmountWithTags}
                    </p>
                  )}
                </div>
              </div>
            </>
          )} */}

        {/* (2) 한 끼당 */}
        {/* <div className={s.one_pack_row}>
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
          </div> */}

        {/* (3) 팩 수 */}
        {/* <div className={s.one_pack_row}>
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
          </div> */}
      </div>

      <div className={s.plan_select_price}>
        <div>변경 후 상품 금액</div>
        <div>
          {transformLocalCurrency(
            subscribeInfo.price[selectedPlanName].avgPrice.salePrice,
          )}
          원
        </div>
      </div>

      {/* <div className={s.recipe_btn_box}>
        <button
          type={'button'}
          className={s.btn}
          onClick={onActiveConfirmModal}
        >
          {isLoading ? (
            <Spinner style={{ color: '#fff' }} />
          ) : (
            '변경 플랜 적용하기'
          )}
        </button>
      </div> */}
      {activeConfirmModal && (
        <Modal_confirm
          text={`${subscribePlanType[selectedPlanName].KOR}으로 플랜을 변경하시겠습니까?`}
          isConfirm={onChangePlan}
          positionCenter
        />
      )}
    </>
  );
};
