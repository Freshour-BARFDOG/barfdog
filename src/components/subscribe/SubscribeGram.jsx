import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CustomSelectWithCustomOptions } from '/src/components/survey/CustomSelectWithCustomOptions';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import Spinner from '../atoms/Spinner';
import Modal_confirm from '../modal/Modal_confirm';
import { postObjData } from '/src/pages/api/reqData';
import { useModalContext } from '/store/modal-context';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import { calcSubscribePrice } from '/util/func/subscribe/calcSubscribePrices';
import { valid_isTheSameArray } from '/util/func/validation/validationPackage';
import { roundedOneMealGram } from '/util/func/subscribe/roundedOneMealGram';
import { UnitOfDemicalPointOfOneMealGramInDatabase } from '../../../util/func/subscribe/finalVar';
import { originSubscribeIdList } from '/util/func/subscribe/originSubscribeIdList';

export const SubscribeGram = ({ subscribeInfo }) => {
  const planType = subscribeInfo.plan.name;
  const initForm = {
    dogId: subscribeInfo.info.dogId,
    recipeInfo: {
      pricePerGramList: subscribeInfo.recipe.pricePerGram,
    },
    planInfo: {
      planType: planType,
      planName: subscribePlanType[planType].KOR,
    },
    nextAmount: 0,
    originGrams: subscribeInfo.info.oneMealGramsPerRecipe, // 기존 무게 list
    nextGrams: subscribeInfo.info.oneMealGramsPerRecipe, // 변경 적용
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
  const [isOriginSubscriber, setIsOriginSubscriber] = useState(false);

  // console.log(subscribeInfo);

  useEffect(() => {
    //! [추가] 기존 구독자인지 확인
    originSubscribeIdList.includes(subscribeInfo.info.subscribeId) &&
      setIsOriginSubscriber(true);
  }, []);

  // console.log(isOriginSubscriber, subscribeInfo.info.subscribeId);

  const onInputChange = (value) => {
    const nextAmount = value;
    const nextGrams = form.originGrams.map((originGram) =>
      Number(
        (originGram * (1 + nextAmount / 100)).toFixed(
          UnitOfDemicalPointOfOneMealGramInDatabase,
        ),
      ),
    ); // ! 1팩 당 무게: 최대 소수점 '4'자리
    const recipePricePerGrams = form.recipeInfo.pricePerGramList;
    const planTypeName = form.planInfo.planType;

    const { perPack, salePrice } = calcSubscribePrice({
      discountPercent: subscribeInfo.plan.discountPercent,
      oneMealGrams: nextGrams,
      planName: planTypeName,
      pricePerGrams: recipePricePerGrams,
      isOriginSubscriber,
      recipeNameList: subscribeInfo.recipe.nameList.map((recipe) => recipe),
    });

    // // console.log(perPack, salePrice);
    setForm((prevState) => ({
      ...prevState,
      nextAmount,
      nextGrams,
      nextPricePerPack: perPack,
      nextSalePrice: salePrice,
    }));
  };

  const onActiveConfirmModal = () => {
    if (valid_isTheSameArray(form.originGrams, form.nextGrams)) {
      mct.alertShow('기존과 동일한 무게입니다');
    } else {
      setActiveConfirmModal(true);
    }
  };

  const onSubmit = async (confirm) => {
    if (submitted) return console.error('이미 제출된 양식입니다.');
    if (!confirm) {
      return setActiveConfirmModal(false);
    }

    const body = {
      stringGrams: form.nextGrams.join(', '), // 원래 Number 여야하지만,  Number[] 배열로 전달한다.
      totalPrice: form.nextSalePrice,
    };

    // validation: Incorrect paymentPrice
    if (!body.totalPrice)
      return mct.alertShow('결제금액 계산오류가 발생하였습니다.');

    try {
      setIsLoading(true);
      setSubmitted(true);
      const url = `/api/subscribes/${subscribeInfo.info.subscribeId}/gram`;
      const res = await postObjData(url, body);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow(
          '무게 변경 변경이 완료되었습니다.',
          onSuccessChangeSubscribeOrder,
        );
      } else {
        mct.alertShow(`데이터 전송 실패\n${res.error}`);
        setSubmitted(false);
      }
      setActiveConfirmModal(false);
    } catch (err) {
      alert(err);
      console.error(err.response);
    } finally {
      setIsLoading(false);
    }
  };

  const onSuccessChangeSubscribeOrder = () => {
    setIsLoading({ reload: true });
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
              <div className={s.text2}>
                반려견이 성견인데 몸무게 변화가 있으신가요?
              </div>
            </div>
            <div className={s.text3}>
              아래 무게를 변경한 뒤 적용 버튼 눌러 주세요.
              <br /> 제조 전 등록해주셔야 변경사항이 적용 됩니다.
            </div>

            <div className={s.grid_box}>
              <div className={s.grid_1}>
                <p className={s.top_text}>기존 무게(g)</p>
                <div className={s.bot_1}>
                  {form.originGrams.map((gram, i) => (
                    <em key={`originGram-${i}`}>
                      {transformLocalCurrency(roundedOneMealGram(gram))}g{' '}
                      {i < form.originGrams.length - 1 && ', '}
                    </em>
                  ))}
                </div>
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
                <div className={s.bot_1}>
                  {form.nextGrams.map((gram, i) => (
                    <em key={`nextGram-${i}`}>
                      {transformLocalCurrency(roundedOneMealGram(gram))}g{' '}
                      {i < form.originGrams.length - 1 && ', '}
                    </em>
                  ))}
                </div>
              </div>
              <div className={s.grid_4}>
                <p className={s.top_text}>기존 한 팩 가격</p>
                <div className={s.bot_1}>
                  {transformLocalCurrency(form.originPricePerPack)}원
                </div>
              </div>
              <div className={s.grid_5}>
                <p className={s.top_text}>변경 후 한 팩 가격</p>
                <div className={s.bot_1}>
                  {transformLocalCurrency(form.nextPricePerPack)}원
                  <span>
                    (팩당:{' '}
                    {form.nextPricePerPack - form.originPricePerPack > 0 && '+'}
                    {transformLocalCurrency(
                      form.nextPricePerPack - form.originPricePerPack,
                    )}
                    원)
                  </span>
                </div>
              </div>
              <div className={s.grid_6}>
                <p className={s.top_text}>변경 후 상품 금액</p>
                <div className={s.bot_1}>
                  {transformLocalCurrency(form.nextSalePrice)}원
                  <span>
                    (차액: {form.nextSalePrice - form.originPrice > 0 && '+'}
                    {transformLocalCurrency(
                      form.nextSalePrice - form.originPrice,
                    )}
                    원)
                  </span>
                </div>
              </div>
            </div>

            <div className={s.red_btn_box}>
              <button
                type={'button'}
                className={s.red_btn}
                onClick={onActiveConfirmModal}
              >
                {isLoading.submit ? (
                  <Spinner style={{ color: '#fff' }} />
                ) : (
                  '무게 변경 적용하기'
                )}
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
            <div className={s.text3}>
              맞춤 설문에서 반려견 체중을 수정해주세요.
            </div>

            <div className={s.red_btn_box2}>
              <Link href={`/mypage/dogs/${form.dogId}/updateSurvey`} passHref>
                <a className={s.red_btn2}>맞춤설문 재등록 바로가기</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {activeConfirmModal && (
        <Modal_confirm
          text={`무게 변경을 적용하시겠습니까?`}
          isConfirm={onSubmit}
          positionCenter
        />
      )}
    </>
  );
};
