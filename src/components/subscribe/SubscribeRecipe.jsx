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
// import ArrowLeft_s from '@public/img/icon/swiper-arrow-small-l.svg';
// import ArrowRight_s from '@public/img/icon/swiper-arrow-small-r.svg';
import { originSubscribeIdList } from '/util/func/subscribe/originSubscribeIdList';
import { SurveyRecipeInput } from '../survey/result/SurveyRecipeInput';
import transformLocalCurrency from '/util/func/transformLocalCurrency';

// const swiperSettings = {
//   className: `${s.swiper_recipes} ${s.inMypage}`,
//   slidesPerView: 'auto',
//   spaceBetween: 20,
//   loop: false, // ! Important : loop사용 시, checkbox복수 선택 불가함 (loop에 사용되는 dummy slider로 인함)
//   autoplay: false,
//   modules: [Navigation],
//   breakpoints: {
//     300: {
//       slidesPerView: 1,
//       spaceBetween: 0,
//     },
//     651: {
//       //601 이상일 경우
//       slidesPerView: 2, //레이아웃 2열
//       spaceBetween: 20,
//     },
//     1001: {
//       slidesPerView: 3,
//       spaceBetween: 20,
//     },
//     1201: {
//       slidesPerView: 4,
//       spaceBetween: 20,
//     },
//   },
// };

export const SubscribeRecipe = ({ subscribeInfo }) => {
  // const navPrevRef = useRef(null);
  // const navNextRef = useRef(null);
  const mct = useModalContext();
  const tbContext = useContext(ToggleBoxContext);
  // const initialInputType =
  //   subscribeInfo.info.planName === subscribePlanType.FULL.NAME
  //     ? 'checkbox'
  //     : 'radio';
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
  const [isOriginSubscriber, setIsOriginSubscriber] = useState(false);
  const [changingRecipePrice, setChangingRecipePrice] = useState(null);
  const [recommendRecipeId, setRecommendRecipeId] = useState(null);
  const [inedibleRecipeIds, setInedibleRecipeIds] = useState([]);
  const [recipeDoubleInfo, setRecipeDoubleInfo] = useState([]);
  const [recipeSingleInfo, setRecipeSingleInfo] = useState([]);
  const [shippingLeftCount, setShippingLeftCount] = useState(null);

  // // console.log(selectedRadio)
  // // console.log(selectedCheckbox)
  // // console.log(subscribeInfo);
  // // console.log(tbContext)

  //*** 추천 레시피 & 못먹는 음식 플래그 ***//
  useEffect(() => {}, []);

  useEffect(() => {
    try {
      (async () => {
        const url = `/api/subscribes/${subscribeInfo.info.subscribeId}/shippingLeft`;
        const res = await getData(url);

        if (res.status === 200) {
          setShippingLeftCount(res.data.shippingLeft);
        }
      })();
    } catch (err) {
      console.error(err);
    }
  }, []);

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
    //! [추가] 기존 구독자인지 확인
    originSubscribeIdList.includes(subscribeInfo.info.subscribeId) &&
      setIsOriginSubscriber(true);

    // INIT RECIPE VALUE
    if (allRecipeInfoList.length) return; // Block code Execution after recipeInfo Initialization.

    const recipeIdList = subscribeInfo.recipe.allRecipeIdList;
    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: true,
      }));
      try {
        // 더블/싱글 레시피 구분
        const recipeInfoList = [];
        for (const recipeId of recipeIdList) {
          const apiUrl = `/api/recipes/${recipeId}`;
          const res = await getData(apiUrl);
          // console.log('res.data>>>', res.data);
          const allRecipeData = res.data;

          if (
            allRecipeData.ingredientList.length > 1 &&
            allRecipeData.inStock
          ) {
            setRecipeDoubleInfo((prevState) => {
              if (!prevState.some((recipe) => recipe.id === allRecipeData.id)) {
                return [...prevState, allRecipeData];
              } else {
                return prevState;
              }
            });
          } else if (
            allRecipeData.ingredientList.length === 1 &&
            allRecipeData.inStock
          ) {
            setRecipeSingleInfo((prevState) => {
              if (!prevState.some((recipe) => recipe.id === allRecipeData.id)) {
                return [...prevState, allRecipeData];
              } else {
                return prevState;
              }
            });
          }

          const dogId = subscribeInfo.info.dogId;
          //
          // const surveyInfoUrl = `/api/dogs/${dogId}/surveyReportResult`;
          // const surveyInfoRes = await getData(surveyInfoUrl);
          // const surveyInfo = surveyInfoRes.data;

          // console.log('surveyInfo____', surveyInfo);

          // // 1. 추천 레시피
          // const selectedConditions = surveyInfo.priorityConcerns
          //   .split(',')
          //   .filter(Boolean);
          // let recommendRecipeIds = [];

          // selectedConditions.forEach((condition) => {
          //   if (concernsRecipeMap[condition]) {
          //     recommendRecipeIds.push(...concernsRecipeMap[condition]);
          //   }
          // });

          // recommendRecipeIds = [...new Set(recommendRecipeIds)]; // 중복 제거

          // // inedibleFood에 포함된 재료의 레시피 ID를 제외
          // const inedibleFoods = surveyInfo.inedibleFood
          //   .split(',')
          //   .filter(Boolean);
          // inedibleFoods.forEach((food) => {
          //   if (inedibleFoodRecipeMap[food]) {
          //     recommendRecipeIds = recommendRecipeIds.filter(
          //       (id) => !inedibleFoodRecipeMap[food].includes(id),
          //     );
          //   }
          // });

          // // recommendRecipeId의 최종 값
          // const finalRecommendRecipeId = recommendRecipeIds.length
          //   ? recommendRecipeIds[0]
          //   : null;
          // setRecommendRecipeId(finalRecommendRecipeId);

          // // 2. 못먹는 음식
          // if (surveyInfo.inedibleFood) {
          //   const inedibleFoodList = surveyInfo.inedibleFood
          //     .split(',')
          //     .map((food) => food.trim());

          //   const recipeIds = inedibleFoodList.flatMap(
          //     (food) => inedibleFoodRecipeMap[food] || [],
          //   );

          //   const uniqueRecipeIds = [...new Set(recipeIds)];

          //   setInedibleRecipeIds(uniqueRecipeIds);
          // }

          const recommendRecipeInfo =
            dogId && (await getRecommendRecipe(dogId));
          allRecipeData.isRecommendRecipe =
            allRecipeData.id === recommendRecipeInfo.recommendRecipeId;
          recipeInfoList.push(allRecipeData);
        }
        setAllRecipeInfoList(recipeInfoList);
        const initialValueList = recipeInfoList
          .filter((info) => subscribeInfo.recipe.idList.indexOf(info.id) >= 0)
          .map((info) => `${info.name}-${info.id}`);

        const initRadioVal = initialValueList[0];
        let initCheckboxObjVal = {};
        for (const val of initialValueList) {
          initCheckboxObjVal[val] = true;
        }
        // initialInputType === 'radio'
        //   ? setSelectedRadio(initRadioVal)
        //   : setSelectedCheckbox(initCheckboxObjVal);
        setSelectedCheckbox(initCheckboxObjVal);
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, []);

  const fetchChangingPrice = async (nextPaymentPrice) => {
    try {
      const url = `/api/subscribes/${subscribeInfo.info.subscribeId}/price/${
        nextPaymentPrice * shippingLeftCount
      }`;
      const res = await getData(url);
      console.log(res);
      if (res) {
        setChangingRecipePrice(res.data.changingPrice);
      } else {
        mct.alertShow(`데이터 전송 실패\n${res.error}`);
      }
    } catch (err) {
      alert(err);
    }
  };

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
    console.log(selectedCheckboxCount);

    if (selectedCheckboxCount === 0) {
      setChangingRecipePrice(null);
    }
    if (selectedCheckboxCount > maxSelectedCheckboxCount) {
      mct.alertShow('풀플랜은 최대 2개 레시피를 선택할 수 있습니다.');
      setInitialize(true);
      setSelectedIdList([]);
    } else {
      setInitialize(false);
      setSelectedIdList(seletedIdList);

      const calcSalePriceAfterChangingRecipe = ({ plan: plan }) => {
        const currentRecipeInfos =
          recipeInfo &&
          recipeInfo.data &&
          recipeInfo.data.filter(
            (recipe) => selectedIdList.indexOf(recipe.id) >= 0,
          );
        const result = calcSubscribePrice({
          discountPercent: subscribeInfo.plan.discountPercent,
          oneMealGrams: calcOneMealGramsWithRecipeInfo({
            selectedRecipeIds: selectedIdList,
            allRecipeInfos: currentRecipeInfos,
            oneDayRecommendKcal: subscribeInfo.info.oneDayRecommendKcal,
            isOriginSubscriber,
          }).map((recipe) => recipe.oneMealGram),
          planName: plan,
          pricePerGrams: currentRecipeInfos?.map(
            (recipe) => recipe.pricePerGram,
          ),
          isOriginSubscriber,
          recipeNameList: currentRecipeInfos?.map((recipe) => recipe.name),
        });

        // console.log('result.salePrice>>>', currentRecipeInfos);
        // console.log('result.salePrice>>>', result);
        // console.log('currentRecipeInfos:::', currentRecipeInfos);

        return result.avgPrice?.salePrice;
      };

      const curPlan = subscribeInfo.info.planName;
      const nextPaymentPrice = calcSalePriceAfterChangingRecipe({
        plan: curPlan,
      });

      if (nextPaymentPrice) {
        fetchChangingPrice(nextPaymentPrice);
      }
    }
  }, [selectedCheckbox]);

  console.log('changingRecipePrice___', changingRecipePrice);

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
  // console.log('____selected', selectedRadio);
  // console.log('selectedCheckbox', selectedCheckbox);
  // console.log('subscribeInfo.recipe.idList', subscribeInfo.recipe.idList);
  // console.log('subscribeInfo.recipe', subscribeInfo.recipe);
  // console.log('isOriginSubscriber>>>>', isOriginSubscriber);
  // console.log(subscribeInfo);

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
        isOriginSubscriber,
      }).map((recipe) => recipe.oneMealGram),
      planName: plan,
      pricePerGrams: currentRecipeInfos.map((recipe) => recipe.pricePerGram),
      isOriginSubscriber,
      recipeNameList: currentRecipeInfos.map((recipe) => recipe.name),
    });

    // console.log('result.salePrice>>>', result);
    // console.log('currentRecipeInfos:::', currentRecipeInfos);

    return result.avgPrice.salePrice;
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

  // console.log('recipeInfo___', recipeInfo);
  // console.log('recipeSingleInfo___', recipeSingleInfo);
  // console.log('recipeDoubleInfo___', recipeDoubleInfo);

  return (
    <>
      {isLoading.reload && <FullScreenLoading />}
      {isLoading.fetching ? (
        <Spinner />
      ) : (
        <div className={s.recipe_container}>
          {/* 3-1) 더블 */}
          <div className={s.recipe_box}>
            <h3>
              [ <strong>더블미트</strong>(복합 단백질) 레시피 ]
            </h3>

            <div className={s.recipe_list}>
              {recipeDoubleInfo.map((recipe, index) => (
                <>
                  <SurveyRecipeInput
                    id={`${recipe.name}-${recipe.id}`}
                    name={name}
                    initialize={initialize}
                    disabled={!recipe.inStock}
                    selectedCheckbox={selectedCheckbox}
                    setSelectedCheckbox={setSelectedCheckbox}
                    option={{ label: '레시피 선택' }}
                  >
                    {recommendRecipeId === recipe.id && (
                      <ItemRecommendlabel
                        label="추천!"
                        style={{
                          backgroundColor: '#be1a21',
                        }}
                      />
                    )}
                    {inedibleRecipeIds.includes(recipe.id) && (
                      <ItemRecommendlabel
                        label={`못먹는\n재료 포함`}
                        style={{
                          backgroundColor: '#000',
                          fontSize: '13px',
                          whiteSpace: 'pre-line',
                          lineHeight: 1.2,
                        }}
                        inedibleFood={true}
                      />
                    )}

                    <Image
                      src={recipe.thumbnailUri2}
                      width={149 * 1.4}
                      height={149 * 1.4}
                      alt="레시피 상세 이미지"
                    />
                    <div>
                      <strong>{recipe.uiNameKorean}</strong>
                    </div>
                    <div className={s.recipe_description}>
                      · 주재료: {recipe.ingredientList.join(', ')} <br />·{' '}
                      {recipe.name === 'STARTER PREMIUM +'
                        ? '첫 생식에 추천'
                        : recipe.name === 'TURKEY&BEEF +'
                        ? '성장기 자견에게 추천'
                        : recipe.name === 'DUCK&LAMB +'
                        ? '기력회복이 필요하다면 추천'
                        : recipe.name === 'LAMB&BEEF +'
                        ? '푸석푸석한 모질이라면 추천'
                        : ''}
                      <br />·{' '}
                      {recipe.name === 'STARTER PREMIUM +'
                        ? '부드러워 소화에 적은 부담'
                        : recipe.name === 'TURKEY&BEEF +'
                        ? '영양 보충 & 면역력 강화'
                        : recipe.name === 'DUCK&LAMB +'
                        ? '관절 강화 & 근력 회복'
                        : recipe.name === 'LAMB&BEEF +'
                        ? '윤기나는 피부와 모질'
                        : ''}
                    </div>
                    <button>
                      <Link href="/recipes" passHref>
                        <a
                          target={'_blank'}
                          rel={'noreferrer'}
                          onClick={onPopupHandler}
                        >
                          자세히 알아보기
                        </a>
                      </Link>
                    </button>
                  </SurveyRecipeInput>
                </>
              ))}
            </div>
          </div>

          {/* 3-2) 싱글 */}
          <div className={s.recipe_box}>
            <h3>
              {' '}
              [ <strong>싱글미트</strong>(단일 단백질) 레시피 ]
            </h3>
            <div className={s.recipe_list}>
              {recipeSingleInfo.map((recipe, index) => (
                <>
                  <SurveyRecipeInput
                    id={`${recipe.name}-${recipe.id}`}
                    name={name}
                    initialize={initialize}
                    disabled={!recipe.inStock}
                    selectedCheckbox={selectedCheckbox}
                    setSelectedCheckbox={setSelectedCheckbox}
                    option={{ label: '레시피 선택' }}
                  >
                    {recommendRecipeId === recipe.id && (
                      <ItemRecommendlabel
                        label="추천!"
                        style={{
                          backgroundColor: '#be1a21',
                        }}
                      />
                    )}
                    {inedibleRecipeIds.includes(recipe.id) && (
                      <ItemRecommendlabel
                        label={`못먹는\n재료 포함`}
                        style={{
                          backgroundColor: '#000',
                          fontSize: '13px',
                          whiteSpace: 'pre-line',
                          lineHeight: 1.2,
                        }}
                        inedibleFood={true}
                      />
                    )}
                    <Image
                      src={recipe.thumbnailUri2}
                      width={149 * 1.5}
                      height={149 * 1.5}
                      alt="레시피 상세 이미지"
                    />
                    <div>
                      {' '}
                      <strong>{recipe.uiNameKorean}</strong>
                    </div>
                    <div className={s.recipe_description}>
                      · 주재료: {recipe.ingredientList.join(', ')} <br />·{' '}
                      {recipe.name === 'Premium CHICKEN'
                        ? '자견~노견, 전 연령 추천'
                        : recipe.name === 'Premium TURKEY'
                        ? '성장기 자견에게 추천'
                        : recipe.name === 'Premium LAMB'
                        ? '활동량이 많다면 추천'
                        : recipe.name === 'Premium BEEF'
                        ? '자견~노견, 전 연령 추천'
                        : ''}
                      <br />·{' '}
                      {recipe.name === 'Premium CHICKEN'
                        ? '관절 강화 & 소화 흡수율 높음'
                        : recipe.name === 'Premium TURKEY'
                        ? '영양 보충 & 면역력 강화'
                        : recipe.name === 'Premium LAMB'
                        ? '피로회복 & 피모관리'
                        : recipe.name === 'Premium BEEF'
                        ? '체중관리 & 빈혈회복'
                        : ''}
                    </div>
                    <button>자세히 알아보기</button>
                  </SurveyRecipeInput>
                </>
              ))}
            </div>
          </div>
        </div>
      )}
      {selectedIdList.length > 0 && changingRecipePrice && (
        <div className={s.recipe_change_price}>
          <p className={s.top_text}>
            부분 {changingRecipePrice > 0 ? '결제' : '환불'}될 금액
          </p>
          <div className={s.bot_1}>
            <span> {transformLocalCurrency(changingRecipePrice)}원</span>
          </div>
        </div>
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
    </>
  );
};
