import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { CustomSelectWithCustomOptions } from '/src/components/survey/CustomSelectWithCustomOptions';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import { calcSubscribePrice } from '/util/hook/useSubscribeInfo';
import Spinner from '../atoms/Spinner';
import Modal_confirm from '../modal/Modal_confirm';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { postObjData } from '/src/pages/api/reqData';
import { useModalContext } from '/store/modal-context';
import { ToggleBoxContext } from '/src/components/atoms/ToggleBox';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';

export const SubscribeGram = ({ subscribeInfo }) => {
  const tbContext = useContext(ToggleBoxContext);

  // console.log(subscribeInfo);

  const planType = subscribeInfo.plan.name;
  const initForm = {
    dogId: 377, /////// ! TEST /// 현재 구독중인 반려견의 ID필요
    recipeInfo: {
      pricePerGramList: subscribeInfo.recipe.pricePerGram,
    },
    planInfo: {
      planType: planType,
      planName: subscribePlanType[planType].KOR,
    },
    nextAmount: 0,
    originGram: subscribeInfo.info.oneMealRecommendGram, // 기존 그람
    nextGram: subscribeInfo.info.oneMealRecommendGram, // 변경 적용
    originPricePerPack: subscribeInfo.price[planType].perPack,
    nextPricePerPack: subscribeInfo.price[planType].perPack,
    originPrice: subscribeInfo.price[planType].salePrice,
    nextSalePrice: subscribeInfo.price[planType].salePrice,
  };

  const mct = useModalContext();
  const [form, setForm] = useState(initForm);
  const [isLoading, setIsLoading] = useState(false);
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onInputChange = (value) => {
    const nextAmount = value;
    const nextGram = Number((form.originGram * (1 + nextAmount / 100)).toFixed(4)); // ! 1팩 당 무게: 최대 소수점 '4'자리
    const recipePricePerGramList = form.recipeInfo.pricePerGramList;
    const planType = form.planInfo.planType;
    const { perPack, originPrice, salePrice } = calcSubscribePrice(
      planType,
      recipePricePerGramList,
      nextGram,
    );

    setForm((prevState) => ({
      ...prevState,
      nextAmount,
      nextGram,
      nextPricePerPack: perPack,
      nextSalePrice: salePrice,
    }));
  };

  const onActiveConfirmModal = () => {
    if (form.originGram === form.nextGram) {
      mct.alertShow('기존과 동일한 무게입니다');
    } else {
      setActiveConfirmModal(true);
    }
  };

  const onSubmit = async (confirm) => {
    if (!confirm) {
      return setActiveConfirmModal(false);
    }
    if (submitted) return console.error('이미 제출된 양식입니다.');

    const body = {
      gram: form.nextGram,
      totalPrice: form.nextSalePrice,
    };

    console.log('body: ', body);

    try {
      setIsLoading(true);
      const url = `/api/subscribes/${subscribeInfo.info.subscribeId}/gram`;
      const res = await postObjData(url, body);
      console.log(res);
      // if (!res.isDone) { // ! TEST CODE //
        if (res.isDone) {  // ! PRODUCT CODE //
        setSubmitted(true);
        mct.alertShow('무게 변경 변경이 완료되었습니다.');
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
    mct.alertHide();
    window.location.reload();
  };

  return (
    <>
      {isLoading.reload && <FullScreenLoading />}
      <div className={s.content_inner_box}>
        <div className={s.flex_box}>
          <div className={s.content_left_box}>
            <div className={s.btn}>A유형</div>
          </div>
          <div className={s.content_right_box}>
            <div className={s.flex_box}>
              <div className={s.text1}>반려견이 성견이에요</div>
              <div className={s.text2}>반려견이 성견인데 몸무게 변화가 있으신가요?</div>
            </div>
            <div className={s.text3}>
              아래 무게를 변경한 뒤 적용 버튼 눌러 주세요.
              <br /> 제조 전 등록해주셔야 변경사항이 적용 됩니다.
            </div>

            <div className={s.grid_box}>
              <div className={s.grid_1}>
                <p className={s.top_text}>기존 무게(g)</p>
                <div className={s.bot_1}>{form.originGram}g</div>
              </div>
              <div className={s.selectBox}>
                <p className={s.top_text}>변경할 무게</p>
                <CustomSelectWithCustomOptions
                  id={'nextAmount'}
                  className={s.customSelect}
                  options={[
                    { label: '20%', value: 20 },
                    { label: '15%', value: 15 },
                    { label: '10%', value: 10 },
                    { label: '5%', value: 5 },
                    { label: '0%', value: 0 },
                    { label: '-5%', value: -5 },
                    { label: '-10%', value: -10 },
                    { label: '-15%', value: -15 },
                    { label: '-20%', value: -20 },
                  ]}
                  value={form.nextAmount === 0 ? '0' : form.nextAmount}
                  onChange={onInputChange}
                  unit={'%'}
                  placeholder={'mm'}
                />
              </div>
              <div className={s.grid_3}>
                <p className={s.top_text}>변경 후 무게(g)</p>
                <div className={s.bot_1}>{form.nextGram}g</div>
              </div>
              <div className={s.grid_4}>
                <p className={s.top_text}>기존 한 팩 가격</p>
                <div className={s.bot_1}>{transformLocalCurrency(form.originPricePerPack)}원</div>
              </div>
              <div className={s.grid_5}>
                <p className={s.top_text}>변경 후 한 팩 가격</p>
                <div className={s.bot_1}>
                  {transformLocalCurrency(form.nextPricePerPack)}원
                  <span>
                    {transformLocalCurrency(form.nextPricePerPack - form.originPricePerPack)}원
                  </span>
                </div>
              </div>
              <div className={s.grid_6}>
                <p className={s.top_text}>변경 후 결제 금액</p>
                <div className={s.bot_1}>
                  {transformLocalCurrency(form.nextSalePrice)}원
                  <span>{form.planInfo.planName}</span>
                </div>
              </div>
            </div>

            <div className={s.red_btn_box}>
              <button type={'button'} className={s.red_btn} onClick={onActiveConfirmModal}>
                {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '무게 변경 적용하기'}
              </button>
            </div>
          </div>
          {/* right_grid */}
        </div>

        <div className={`${s.flex_box} ${s.second}`}>
          <div className={s.content_left_box}>
            <div className={s.btn}>B유형</div>
          </div>
          <div className={s.content_right_box}>
            <div className={s.flex_box}>
              <div className={s.text1}>반려견이 성장 중이에요</div>
              {/* <div className={Styles.text2}>반려견이 성견인데 몸무게 변화가 있으신가요?</div> */}
            </div>
            <div className={s.text3}>맞춤 설문에서 반려견 체중을 수정해주세요.</div>

            <div className={s.red_btn_box2}>
              <Link href={`/mypage/dogs/${form.dogId}/updateSurvey`} passHref>
                <a className={s.red_btn2}>맞춤설문 재등록 바로가기</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {activeConfirmModal && (
        <Modal_confirm text={`무게 변경을 적용하시겠습니까?`} isConfirm={onSubmit} positionCenter />
      )}
      {tbContext.visible && (
        <Modal_global_alert
          onClick={submitted ? onSuccessChangeSubscribeOrder : mct.alertHide}
          background
        />
      )}
    </>
  );
};
