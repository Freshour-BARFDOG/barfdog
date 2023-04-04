import React, {useState} from 'react';
import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import CustomInput from '../atoms/CustomInput';
import Image from 'next/image';
import {subscribePlanType} from '/store/TYPE/subscribePlanType';
import ItemLabel from '/src/components/atoms/ItemLabel';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import Spinner from '/src/components/atoms/Spinner';
import {postObjData} from '/src/pages/api/reqData';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import {useModalContext} from '/store/modal-context';
import {FullScreenLoading} from '../atoms/FullScreenLoading';
import {useSubscribePlanInfo} from "/util/hook/useSubscribePlanInfo";
import {roundedOneMealGram} from "/util/func/subscribe/roundedOneMealGram";

export const SubscribePlan = ({ subscribeInfo }) => {
  const subscribePlanInfo = useSubscribePlanInfo();
  const oneMealGramsPerRecipe = subscribeInfo.info.oneMealGramsPerRecipe;
  
  const planInfoList = [
    {
      id: subscribePlanType.FULL.NAME,
      label: "best", // best, new, none
      imageUrl: require('/public/img/subscribe/subscribe_full_plan.png'),
      title: subscribePlanType.FULL.KOR,
      titleDescHTML: (
        <p>
          하루에 <em className={s.accent}>두 끼</em>를 바프독으로 먹어요
        </p>
      ),
      numberOfPacksPerDay: subscribePlanType.FULL.numberOfPacksPerDay,
      totalNumberOfPacks: subscribePlanType.FULL.totalNumberOfPacks,
      weeklyPaymentCycle: subscribePlanType.FULL.weeklyPaymentCycle,
      discountPercent: subscribePlanInfo.planDiscountPercent[subscribePlanType.FULL.NAME],
      onePackGram: subscribeInfo?.info.oneMealRecommendGram,
      price: {
        perPack: subscribeInfo.price[subscribePlanType.FULL.NAME].perPack,
        originPrice: subscribeInfo.price[subscribePlanType.FULL.NAME].originPrice,
        salePrice: subscribeInfo.price[subscribePlanType.FULL.NAME].salePrice,
      },
    },
    {
      id: subscribePlanType.HALF.NAME,
      label: "none", // best, new, none
      imageUrl: require('/public/img/subscribe/subscribe_half_plan.png'),
      title: subscribePlanType.HALF.KOR,
      titleDescHTML: <p>하루에 <span>한 끼</span>를 바프독으로 먹어요</p>,
      numberOfPacksPerDay: subscribePlanType.HALF.numberOfPacksPerDay,
      totalNumberOfPacks: subscribePlanType.HALF.totalNumberOfPacks,
      weeklyPaymentCycle: subscribePlanType.HALF.weeklyPaymentCycle,
      discountPercent: subscribePlanInfo.planDiscountPercent[subscribePlanType.HALF.NAME],
      onePackGram: subscribeInfo?.info.oneMealRecommendGram,
      price: {
        perPack: subscribeInfo.price[subscribePlanType.HALF.NAME].perPack,
        originPrice: subscribeInfo.price[subscribePlanType.HALF.NAME].originPrice,
        salePrice: subscribeInfo.price[subscribePlanType.HALF.NAME].salePrice,
      },
    },
    {
      id: subscribePlanType.TOPPING.NAME,
      label: "new", // best, new, none
      imageUrl: require('/public/img/subscribe/subscribe_topping_plan.png'),
      title: subscribePlanType.TOPPING.KOR,
      titleDescHTML: <p>토핑용으로 바프독으로 섞어서 먹어요</p>,
      numberOfPacksPerDay: subscribePlanType.TOPPING.numberOfPacksPerDay,
      totalNumberOfPacks: subscribePlanType.TOPPING.totalNumberOfPacks,
      weeklyPaymentCycle: subscribePlanType.TOPPING.weeklyPaymentCycle,
      discountPercent: subscribePlanInfo.planDiscountPercent[subscribePlanType.TOPPING.NAME],
      onePackGram: subscribeInfo?.info.oneMealRecommendGram,
      price: {
        perPack: subscribeInfo.price[subscribePlanType.TOPPING.NAME].perPack,
        originPrice: subscribeInfo.price[subscribePlanType.TOPPING.NAME].originPrice,
        salePrice: subscribeInfo.price[subscribePlanType.TOPPING.NAME].salePrice,
      },
    },
  ];
  
  const mct = useModalContext();
  const currentPlanName = subscribeInfo.info.planName;
  const [selectedPlanName, setSelectedPlanName] = useState(currentPlanName);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);

  const onActiveConfirmModal = () => {
    const currentRecipeCount = subscribeInfo.recipe.idList.length;
    // ! validation : 처음과 동일한 플랜일 경우
    if (selectedPlanName === currentPlanName) {
      mct.alertShow('기존과 동일한 플랜입니다.');
    } else if( subscribePlanType[selectedPlanName].maxRecipeCount < currentRecipeCount){
      mct.alertShow("구독 중인 레시피 개수가 변경될 플랜의 최대 선택 가능한 레시피 개수보다 많습니다.");
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
    if(!body.nextPaymentPrice) return mct.alertShow( "결제금액 계산오류가 발생하였습니다.");
    

    try {
      setIsLoading(true);
      setSubmitted(true);
      const url = `/api/subscribes/${subscribeInfo.info.subscribeId}/planRecipes`;
      const res = await postObjData(url, body);
      console.log(res);
        if (res.isDone) {
          mct.alertShow('플랜 변경이 완료되었습니다.',onSuccessChangeSubscribeOrder);
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
  if(isLoading.reload || subscribePlanInfo.isLoading){
    return  <FullScreenLoading opacity={1} />
  }
  return (
    <>
      <div className={`${s.flex_box} ${s.subscribePlan}`}>
        {planInfoList.map((item, index) => (
          <CustomInput
            key={`subscribe-plan-input-${index}`}
            id={item.id}
            type="radio"
            name={'plan'}
            selectedRadio={selectedPlanName}
            setSelectedRadio={setSelectedPlanName}
            option={{ label: '플랜 선택' }}
            initialize={false}
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
                  <figure className={`${s.image} img-wrap`}>
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        objectFit="cover"
                        layout="fill"
                        alt="플랜 아이콘"
                      />
                    )}
                  </figure>
                </div>
                <h2>{item.title}</h2>
              </li>
              <li>
                <p className={s.desc}>{item.titleDescHTML}</p>
              </li>
              <li>
                <div className={s.grid_box}>
                  <div className={s.row_1}>
                    하루에<span>&nbsp;{item.numberOfPacksPerDay}팩</span>
                  </div>
                  <div className={s.row_2}>
                    <span>{item.weeklyPaymentCycle}주</span>&nbsp;정기배송
                  </div>
                  <div className={s.row_3}>
                    {oneMealGramsPerRecipe.map((oneMealGram, index) => <p key={`oneMealGram}-${index}`}><b>{transformLocalCurrency(roundedOneMealGram(oneMealGram))}</b>g&nbsp;(1팩기준)</p>) || "-"}
                  </div>
                  <div className={s.row_4}>
                    {item.totalNumberOfPacks}팩 x
                    <span>&nbsp;{transformLocalCurrency(item.price.perPack)}원</span>
                  </div>
                </div>
              </li>

              <li className={s.price}>
                <p className={s.text1}>
                  {item.discountPercent}%&nbsp;
                  <span>{transformLocalCurrency(item.price.originPrice)}원</span>
                </p>
                <p className={s.text2}>{transformLocalCurrency(item.price.salePrice)}원</p>
              </li>
            </ul>
          </CustomInput>
        ))}
      </div>
      <div className={s.recipe_btn_box}>
        <button type={'button'} className={s.btn} onClick={onActiveConfirmModal}>
          {isLoading ? <Spinner style={{ color: '#fff' }} /> : '변경 플랜 적용하기'}
        </button>
      </div>
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
