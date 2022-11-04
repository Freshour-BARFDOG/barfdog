import React, { useContext, useEffect, useState } from 'react';
import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import CustomInput from '../atoms/CustomInput';
import Image from 'next/image';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import ItemLabel from '/src/components/atoms/ItemLabel';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import Spinner from '/src/components/atoms/Spinner';
import { postObjData } from '/src/pages/api/reqData';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import { ToggleBoxContext } from '../atoms/ToggleBox';
import { FullScreenLoading } from '../atoms/FullScreenLoading';

export const SubscribePlan = ({ subscribeInfo }) => {
  // console.log(subscribeInfo )
  const planInfoList = [
    {
      id: subscribePlanType.FULL.NAME,
      name: subscribePlanType.FULL.KOR,
      imageUrl: require('/public/img/subscribe/subscribe_full_plan.png'),
      desc: (
        <>
          하루에 <em className={s.accent}>두 끼</em>를 바프독으로 섞어서 먹어요
        </>
      ),
      numberOfPacksPerDay: subscribePlanType.FULL.numberOfPacksPerDay,
      totalNumberOfPacks: subscribePlanType.FULL.totalNumberOfPacks,
      weeklyPaymentCycle: subscribePlanType.FULL.weeklyPaymentCycle,
      discountPercent: subscribePlanType.FULL.discountPercent,
      onePackGram: subscribeInfo?.info.oneMealRecommendGram,
      price: {
        perPack: subscribeInfo.price[subscribePlanType.FULL.NAME].perPack,
        originPrice: subscribeInfo.price[subscribePlanType.FULL.NAME].originPrice,
        salePrice: subscribeInfo.price[subscribePlanType.FULL.NAME].salePrice,
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
      desc: (
        <>
          하루에 <em className={s.accent}>한 끼</em>를 바프독으로 섞어서 먹어요
        </>
      ),
      numberOfPacksPerDay: subscribePlanType.HALF.numberOfPacksPerDay,
      totalNumberOfPacks: subscribePlanType.HALF.totalNumberOfPacks,
      weeklyPaymentCycle: subscribePlanType.HALF.weeklyPaymentCycle,
      discountPercent: subscribePlanType.HALF.discountPercent,
      onePackGram: subscribeInfo?.info.oneMealRecommendGram,
      price: {
        perPack: subscribeInfo.price[subscribePlanType.HALF.NAME].perPack,
        originPrice: subscribeInfo.price[subscribePlanType.HALF.NAME].originPrice,
        salePrice: subscribeInfo.price[subscribePlanType.HALF.NAME].salePrice,
      },
      option: {
        itemLabel: null,
      },
    },
    {
      id: subscribePlanType.TOPPING.NAME,
      name: subscribePlanType.TOPPING.KOR,
      imageUrl: require('/public/img/subscribe/subscribe_topping_plan.png'),
      desc: (
        <>
          <em className={s.accent}>토핑용</em>으로 바프독을 섞어서 먹어요
        </>
      ),
      numberOfPacksPerDay: subscribePlanType.TOPPING.numberOfPacksPerDay,
      totalNumberOfPacks: subscribePlanType.TOPPING.totalNumberOfPacks,
      weeklyPaymentCycle: subscribePlanType.TOPPING.weeklyPaymentCycle,
      discountPercent: subscribePlanType.TOPPING.discountPercent,
      onePackGram: subscribeInfo?.info.oneMealRecommendGram,
      price: {
        perPack: subscribeInfo.price[subscribePlanType.TOPPING.NAME].perPack,
        originPrice: subscribeInfo.price[subscribePlanType.TOPPING.NAME].originPrice,
        salePrice: subscribeInfo.price[subscribePlanType.TOPPING.NAME].salePrice,
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
  const mct = useModalContext();
  const initialMemberPlanName = subscribeInfo.info.planName;
  const [selectedPlanName, setSelectedPlanName] = useState(initialMemberPlanName);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);

  const onActiveConfirmModal = (e) => {
    // ! validation : 처음과 동일한 플랜일 경우
    if (selectedPlanName === initialMemberPlanName) {
      mct.alertShow('기존과 동일한 플랜입니다.');
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

    try {
      setIsLoading(true);
      const url = `/api/subscribes/${subscribeInfo.info.subscribeId}/plan`;
      const res = await postObjData(url, body);
      console.log(res);
      // if (!res.isDone) { // ! TEST CODE //
        if (res.isDone) {  // ! PRODUCT CODE //
        setSubmitted(true);
          mct.alertShow('플랜 변경이 완료되었습니다.',onSuccessChangeSubscribeOrder);
      } else {
          mct.alertShow(`데이터 전송 실패\n${res.error}`);
      }
      setActiveConfirmModal(false);
    } catch (err) {
      console.error('err: ', err);
    }
    setIsLoading(false);
  };



  const onSuccessChangeSubscribeOrder = () => {
    setIsLoading({ reload: true });
    window.location.reload();
  };
  return (
    <>
      {isLoading.reload && <FullScreenLoading />}
      <div className={`${s.flex_box} ${s.subscribePlan}`}>
        {planInfoList.map((info, index) => (
          <CustomInput
            key={`subscribe-plan-input-${index}`}
            id={info.id}
            type="radio"
            name={'plan'}
            selectedRadio={selectedPlanName}
            setSelectedRadio={setSelectedPlanName}
            option={{ label: '플랜 선택' }}
            initialize={false}
          >
            {info.option.itemLabel}
            <ul className={s.plan_box}>
              <li className={s.plan_grid_1}>
                <div className={s.img_box}>
                  <figure className={`${s.image} img-wrap`}>
                    {info.imageUrl && (
                      <Image
                        src={info.imageUrl}
                        objectFit="cover"
                        layout="fill"
                        alt="플랜 아이콘"
                      />
                    )}
                  </figure>
                </div>
                <h2>{info.name}</h2>
              </li>
              <li>
                <p className={s.desc}>{info.desc}</p>
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
                    <span>&nbsp;{transformLocalCurrency(info.price.perPack)}원</span>
                  </div>
                </div>
              </li>

              <li className={s.price}>
                <p className={s.text1}>
                  {info.discountPercent}%&nbsp;
                  <span>{transformLocalCurrency(info.price.originPrice)}원</span>
                </p>
                <p className={s.text2}>{transformLocalCurrency(info.price.salePrice)}원</p>
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
      {/*{tbContext.visible && (*/}
      {/*  <Modal_global_alert*/}
      {/*    message={modalMessage}*/}
      {/*    onClick={submitted ? onSuccessChangeSubscribeOrder : onHideModal}*/}
      {/*    background*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};
