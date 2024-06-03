import React, { useContext, useEffect, useRef, useState } from 'react';
import s from './subscribeRecipe.module.scss';
import 'swiper/css';
import Link from 'next/link';
import Image from 'next/image';
import { getData, postObjData } from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import checkStringUnderConsonant from '/util/func/checkStringUnderConsonant';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { SubscribeCustomInput } from './SubscribeCustomInput';
import { ItemRecommendlabel, ItemSoldOutLabel } from '../atoms/ItemLabel';
import popupWindow from '/util/func/popupWindow';
import { useModalContext } from '/store/modal-context';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import { valid_isTheSameArray } from '/util/func/validation/validationPackage';
import { ToggleBoxContext } from '../atoms/ToggleBox';
import { FullScreenLoading } from '../atoms/FullScreenLoading';
import { useSubscribeRecipeInfo } from '/util/hook/useSubscribeRecipeInfo';
import { calcSubscribePrice } from '/util/func/subscribe/calcSubscribePrices';
import { calcOneMealGramsWithRecipeInfo } from '/util/func/subscribe/calcOneMealGramsWithRecipeInfo';
import ArrowLeft_s from '@public/img/icon/swiper-arrow-small-l.svg';
import ArrowRight_s from '@public/img/icon/swiper-arrow-small-r.svg';

const swiperSettings = {
  className: `${s.swiper_recipes} ${s.inMypage}`,
  slidesPerView: 'auto',
  spaceBetween: 20,
  loop: false, // ! Important : loop사용 시, checkbox복수 선택 불가함 (loop에 사용되는 dummy slider로 인함)
  autoplay: false,
  modules: [Navigation],
  breakpoints: {
    300: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    651: {
      //601 이상일 경우
      slidesPerView: 2, //레이아웃 2열
      spaceBetween: 20,
    },
    1001: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1201: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
};

export const SubscribeRecipe = ({ subscribeInfo }) => {
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  const mct = useModalContext();
  const tbContext = useContext(ToggleBoxContext);
  const initialInputType =
    subscribeInfo.info.planName === subscribePlanType.FULL.NAME
      ? 'checkbox'
      : 'radio';
  const curIngredient = subscribeInfo.recipe.ingredients;
  const recipeInfo = useSubscribeRecipeInfo();
  const [initialize, setInitialize] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allRecipeInfoList, setAllRecipeInfoList] = useState([]);
  const [selectedCheckbox, setSelectedCheckbox] = useState([]); // * 풀플랜: 최대 2가지 레시피 선택 가능 (Checkbox Input)
  const [selectedRadio, setSelectedRadio] = useState();
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedIdList, setSelectedIdList] = useState([]);

  // // console.log(selectedRadio)
  // // console.log(selectedCheckbox)
  // // console.log(subscribeInfo);
  // // console.log(tbContext)

  async function getRecommendRecipe(dogId) {
    if (!dogId) return console.error('Required User Dog Id');
    let result;
    const url = `/api/dogs/${dogId}/surveyReportResult`;
    const res = await getData(url);
    if (res.data) {
      const data = await res.data;
      result = {
        recommendRecipeId: data.recommendRecipeId,
        recommendRecipeName: data.recommendRecipeName,
      };
    }
    return result;
  }

  useEffect(() => {
    // INIT RECIPE VALUE
    if (allRecipeInfoList.length) return; // Block code Execution after recipeInfo Initialization.

    const recipeIdList = subscribeInfo.recipe.allRecipeIdList;
    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: true,
      }));
      try {
        // 여기서 추천레시피
        const recipeInfoList = [];
        for (const recipeId of recipeIdList) {
          const apiUrl = `/api/recipes/${recipeId}`;
          const res = await getData(apiUrl);
          // console.log('res.data>>>', res.data);
          const allRecipeData = res.data;
          const dogId = subscribeInfo.info.dogId;
          const recommendRecipeInfo =
            dogId && (await getRecommendRecipe(dogId));
          allRecipeData.isRecommendRecipe =
            allRecipeData.id === recommendRecipeInfo.recommendRecipeId;
          recipeInfoList.push(allRecipeData);
        }
        setAllRecipeInfoList(recipeInfoList);
        // console.log('recipeInfoList>>>', recipeInfoList);
        const initialValueList = recipeInfoList
          .filter((info) => subscribeInfo.recipe.idList.indexOf(info.id) >= 0)
          .map((info) => `${info.name}-${info.id}`);
        const initRadioVal = initialValueList[0];
        let initCheckboxObjVal = {};
        for (const val of initialValueList) {
          initCheckboxObjVal[val] = true;
        }
        initialInputType === 'radio'
          ? setSelectedRadio(initRadioVal)
          : setSelectedCheckbox(initCheckboxObjVal);
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, []);

  useEffect(() => {
    if (!selectedCheckbox || typeof selectedCheckbox !== 'object') return;
    let selectedCheckboxCount = 0;
    const keys = Object.keys(selectedCheckbox);
    const seletedIdList = [];
    keys.forEach((key) => {
      const selectedId = allRecipeInfoList.filter(
        (rc, index) => rc.name === `${selectedCheckbox && key.split('-')[0]}`,
      )[0]?.id;
      const val = selectedCheckbox[key];
      val && selectedCheckboxCount++;
      val
        ? seletedIdList.push(selectedId)
        : seletedIdList?.filter((id) => id !== selectedId);
    });
    const maxSelectedCheckboxCount = 2;
    if (selectedCheckboxCount > maxSelectedCheckboxCount) {
      mct.alertShow('풀플랜은 최대 2개 레시피를 선택할 수 있습니다.');
      setInitialize(true);
      setSelectedIdList([]);
    } else {
      setInitialize(false);
      setSelectedIdList(seletedIdList);
    }
  }, [selectedCheckbox]);

  useEffect(() => {
    if (!selectedRadio) return;
    const selectedIdList = [];
    const selectedId = allRecipeInfoList.filter(
      (rc, index) => rc.name === selectedRadio.toString().split('-')[0],
    )[0]?.id;
    selectedIdList.push(selectedId);
    setSelectedIdList(selectedIdList);
  }, [selectedRadio]);

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, { width: 1000, height: 716 });
  };

  console.log('subscribeInfo.recipe.idList', subscribeInfo.recipe.idList);
  console.log('subscribeInfo.recipe', subscribeInfo.recipe);

  const onActiveConfirmModal = () => {
    // // console.log(selectedIdList)

    const isTheSameArray = valid_isTheSameArray(
      selectedIdList,
      subscribeInfo.recipe.idList,
    );
    if (subscribeInfo.recipe.soldOut) {
      mct.alertShow('품절된 레시피가 존재합니다.');
    } else if (isTheSameArray) {
      mct.alertShow('기존과 동일한 레시피입니다.');
    } else {
      setActiveConfirmModal(true);
    }
  };

  const calcSalePriceAfterChangingRecipe = ({ plan: plan }) => {
    const currentRecipeInfos = recipeInfo.data.filter(
      (recipe) => selectedIdList.indexOf(recipe.id) >= 0,
    );
    const result = calcSubscribePrice({
      discountPercent: subscribeInfo.plan.discountPercent,
      oneMealGrams: calcOneMealGramsWithRecipeInfo({
        selectedRecipeIds: selectedIdList,
        allRecipeInfos: currentRecipeInfos,
        oneDayRecommendKcal: subscribeInfo.info.oneDayRecommendKcal,
      }).map((recipe) => recipe.oneMealGram),
      planName: plan,
      pricePerGrams: currentRecipeInfos.map((recipe) => recipe.pricePerGram),
    });

    return result.salePrice;
  };

  const onChangeRecipe = async (confirm) => {
    if (submitted) return console.error('이미 제출된 양식입니다.');
    if (!confirm) {
      return setActiveConfirmModal(false);
    }

    const curPlan = subscribeInfo.info.planName;
    const nextPaymentPrice = calcSalePriceAfterChangingRecipe({
      plan: curPlan,
    });
    // validation: Incorrect paymentPrice
    if (!nextPaymentPrice)
      return mct.alertShow('결제금액 계산오류가 발생하였습니다.');

    const body = {
      plan: curPlan,
      nextPaymentPrice: nextPaymentPrice, // 선택된 플랜의 판매가격
      recipeIdList: selectedIdList,
    };

    try {
      setIsLoading(true);
      setSubmitted(true);
      const url = `/api/subscribes/${subscribeInfo.info.subscribeId}/planRecipes`;
      const res = await postObjData(url, body);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow(
          '레시피 변경이 완료되었습니다.',
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

  const onHideModal = () => {
    mct.alertHide('');
  };

  const onSuccessChangeSubscribeOrder = () => {
    setIsLoading({ reload: true });
    onHideModal();
    window.location.reload();
  };

  return (
    <>
      {isLoading.reload && <FullScreenLoading />}
      {isLoading.fetching ? (
        <Spinner />
      ) : (
        <section className={s.recipe}>
          <h2 className={s.notice_row_1}>
            구매하실 레시피 한가지를 선택해 주세요
          </h2>
          <p className={s.notice_row_2}>
            <em>풀플랜</em>만 두 개의 레시피를 동시 선택할 수 있습니다.
          </p>
          {curIngredient && (
            <div className={s.notice_row_3}>
              <div className={s.color_box}>
                <div className={s.color_box_row_1}>
                  <div className={s.picture_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require('public/img/mypage/subscribe/alert_circle.png')}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                  </div>
                  <span>&nbsp;잠깐!</span>
                </div>
                <div className={s.color_box_row_2}>
                  {/*{true && (*/}
                  {/*  <>*/}
                  {/*    <em>{'TEST, TEST2'}</em>에 못먹는 음식으로 체크해 주셨네요!&nbsp;*/}
                  {/*  </>*/}
                  {/*)}*/}
                  <br />
                  <em>
                    {subscribeInfo.recipe.nameList.join(', ')}
                  </em> 레시피에는 <em>&lsquo;{curIngredient}&rsquo;</em>
                  {checkStringUnderConsonant(curIngredient) ? '이' : '가'}{' '}
                  들어가 있습니다.
                  <br />
                  반려견에게 알레르기를 유발할 수 있으니 레시피 선택에 유의해
                  주시기 바랍니다.
                </div>
              </div>
            </div>
          )}
          {/*<h6 className={'pointColor'}>******SOLD OUT: 1번째 레시피 강제 적용. (테스트 이후 삭제)</h6>*/}

          <div className={s.swiper_recipe_outerWrap}>
            <i className={s.swiper_button_prev_recipe} ref={navPrevRef}>
              <ArrowLeft_s width="100%" height="100%" viewBox="0 0 28 28" />
            </i>
            <i className={s.swiper_button_next_recipe} ref={navNextRef}>
              <ArrowRight_s width="100%" height="100%" viewBox="0 0 28 28" />
            </i>
            <Swiper
              {...swiperSettings}
              watchOverflow={false}
              navigation={{
                prevEl: navPrevRef.current,
                nextEl: navNextRef.current,
              }}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = navPrevRef.current;
                swiper.params.navigation.nextEl = navNextRef.current;
                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();
              }}
            >
              {allRecipeInfoList.length > 0 &&
                allRecipeInfoList.map((rc, index) => (
                  <>
                    {rc.leaked === 'LEAKED' && (
                      <SwiperSlide
                        key={`recipe-${rc.id}-${index}`}
                        className={s.slide}
                      >
                        <SubscribeCustomInput
                          id={`${rc.name}-${rc.id}`}
                          selectedRadio={selectedRadio}
                          type={initialInputType}
                          name={'subscribe-recipes'}
                          initialize={initialize}
                          disabled={!rc.inStock}
                          selectedCheckbox={selectedCheckbox}
                          setSelectedCheckbox={setSelectedCheckbox}
                          setSelectedRadio={setSelectedRadio}
                          option={{ label: '레시피 선택' }}
                        >
                          {rc.isRecommendRecipe && (
                            <ItemRecommendlabel
                              label="추천!"
                              style={{
                                backgroundColor: '#000',
                              }}
                            />
                          )}
                          {!rc.inStock && <ItemSoldOutLabel />}
                          <figure className={`${s.image} img-wrap`}>
                            {rc.thumbnailUri2 && (
                              <Image
                                className={'init-next-image'}
                                src={rc.thumbnailUri2}
                                objectFit="cover"
                                layout="fill"
                                alt="레시피 상세 이미지"
                              />
                            )}
                          </figure>
                          <p className={s.row_1}>{rc.uiNameEnglish}</p>
                          <p className={s.row_2}>{rc.uiNameKorean}</p>
                          <p className={s.row_3}>{rc.description}</p>
                          <p className={s.row_4}>
                            <Link href="/recipes" passHref>
                              <a
                                target={'_blank'}
                                rel={'noreferrer'}
                                onClick={onPopupHandler}
                              >
                                더 알아보기
                              </a>
                            </Link>
                          </p>
                        </SubscribeCustomInput>
                      </SwiperSlide>
                    )}
                  </>
                ))}
            </Swiper>
          </div>
        </section>
      )}
      <div className={s.btn_box}>
        <button className={s.btn} onClick={onActiveConfirmModal}>
          {isLoading.submit ? (
            <Spinner style={{ color: '#fff' }} />
          ) : (
            '변경 레시피 적용하기'
          )}
        </button>
      </div>
      {activeConfirmModal && (
        <Modal_confirm
          text={`레시피를 변경하시겠습니까?`}
          isConfirm={onChangeRecipe}
          positionCenter
        />
      )}
      {/*{tbContext.visible && (*/}
      {/*  <Modal_global_alert*/}
      {/*    onClick={submitted ? onSuccessChangeSubscribeOrder : mct.alertHide}*/}
      {/*    background*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};
