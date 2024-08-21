import React, { useCallback, useEffect, useState } from 'react';
import { getData, putObjData } from '/src/pages/api/reqData';
import s from '/src/components/survey/statistics/surveyStatistics.module.scss';
import Loading from '/src/components/common/Loading';
import { calcDogAge } from '/util/func/calcDogAge';
import Btn_01 from '/public/img/mypage/statistic_dog_walker.svg';
import Btn_02 from '/public/img/mypage/statistic_dog_walker2.svg';
import { UnitOfDemicalPointOfOneMealGram } from '../../../../util/func/subscribe/finalVar';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper_product } from './Swiper_product';
import { useSubscribePlanInfo } from '/util/hook/useSubscribePlanInfo';
import SurveyResultRecipe from './SurveyResultRecipe';
import SurveyResultPlan from './SurveyResultPlan';
import { calcOneMealGramsWithRecipeInfo } from '/util/func/subscribe/calcOneMealGramsWithRecipeInfo';
import { convertFixedNumberByOneDayRecommendKcal } from '/util/func/subscribe/convertFixedNumberByOneDayRecommendKcal';
import { originSubscribeIdList } from '/util/func/subscribe/originSubscribeIdList';
import { validate } from '/util/func/validation/validation_orderSubscribe';
import {
  valid_hasFormErrors,
  valid_isTheSameArray,
} from '/util/func/validation/validationPackage';
import { calcSubscribePrice } from '/util/func/subscribe/calcSubscribePrices';
import { surveyDescriptionList } from '../statistics/description';
import { cartAction } from '/store/cart-slice';
import { useModalContext } from '/store/modal-context';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useRouter } from 'next/router';
import { Modal_deliveryNotice } from '../../modal/Modal_deliveryNotice';
import { FaArrowRight } from 'react-icons/fa';

export const SurveyResult = ({ id, mode = 'default' }) => {
  const auth = useSelector((state) => state.auth);
  const userData = auth.userInfo;
  const surveyData = useSelector((state) => state.surveyData.surveyData);
  const reportLoadingDuration = 0;
  const [surveyInfo, setSurveyInfo] = useState({});
  const [resultInfo, setResultInfo] = useState({});
  const [recipeInfo, setRecipeInfo] = useState({});
  const [recipeDoubleInfo, setRecipeDoubleInfo] = useState([]);
  const [recipeSingleInfo, setRecipeSingleInfo] = useState([]);
  const [userInfo, setUserInfo] = useState(userData);
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [isRendered, setIsRendered] = useState(true);
  const [isShowResult, setIsShowResult] = useState(true);
  const [isActiveDogIdx, setIsActiveDogIdx] = useState('');
  const [chartData, setChartData] = useState({});
  const [pricePerPack, setPricePerPack] = useState(''); // 가격
  const [submitted, setSubmitted] = useState(false);
  const subscribePlanInfo = useSubscribePlanInfo();
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const dispatch = useDispatch();

  const [isArrowActive, setIsArrowActive] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [activeModal, setActiveModal] = useState(false);

  const [form, setForm] = useState({
    plan: null,
    recipeIdList: [],
    nextPaymentPrice: null,
  });

  const [isOriginSubscriber, setIsOriginSubscriber] = useState(false);
  const [oneMealGramsForm, setOneMealGramsForm] = useState({
    current: [],
    next: [],
  });

  const [toppingPerPackPriceList, setToppingPerPackPriceList] = useState([]);
  const [activeConcern, setActiveConcern] = useState('');

  const [mypageSubscribeId, setMypageSubscribeId] = useState(null);

  // 하단 버튼 '마이페이지로 돌아가기'
  const onPrevPage = () => {
    router.push('/mypage');
  };

  useEffect(() => {
    //! [추가] 기존 구독자인지 확인
    originSubscribeIdList.includes(surveyInfo.subscribeId) &&
      setIsOriginSubscriber(true);
  }, []);

  useEffect(() => {
    if (!id || !id.length) return;

    (async () => {
      try {
        // setIsLoading((prevState) => ({
        //   ...prevState,
        //   fetching: true,
        // }));

        // ! mypage => '강아지' id로 조회
        // ! survey => '설문조사' id로 조회
        const apiUrl =
          mode === 'mypage'
            ? `/api/dogs/${id}/surveyReport`
            : `/api/surveyReports/${id}`;

        const res = await getData(apiUrl);
        console.log('/api/surveyReports/>>>', res);
        setSurveyInfo(res.data);

        setActiveConcern(res.data.priorityConcerns.split(',')[0] || '');

        setForm((prevState) => ({
          ...prevState,
          oneDayRecommendKcal: res.data.foodAnalysis.oneDayRecommendKcal,
        }));

        // ! mypage => '강아지' id로 조회
        // ! survey => '설문조사' id로 조회

        if (mode === 'default') {
          const apiResultUrl = `/api/surveyReports/${id}/result`;
          const resultRes = await getData(apiResultUrl);
          // console.log('apiResultUrl>>>', resultRes);
          setResultInfo(resultRes.data);
        } else if (mode === 'mypage') {
          const apiDogList = '/api/dogs';
          const dogListRes = await getData(apiDogList);
          const dogListData = dogListRes?.data._embedded.queryDogsDtoList;
          // console.log('dogListData>>>', dogListData);
          const subscribeId = dogListData?.find(
            (dog) => dog.id === Number(id),
          ).subscribeId;
          setMypageSubscribeId(subscribeId);
        }

        const getRecipeInfoApiUrl = `/api/recipes`;
        const recipeInfoRes = await getData(getRecipeInfoApiUrl);
        const recipeInfoData = recipeInfoRes?.data;
        // setRecipeInfo(recipeInfoData._embedded?.recipeListResponseDtoList);

        if (recipeInfoData) {
          const recipeIdList =
            recipeInfoData._embedded?.recipeListResponseDtoList?.map(
              (l) => l.id,
            ) || [];
          const recipesDetailInfo = [];
          for (const recipeId of recipeIdList) {
            const apiUrl = `/api/recipes/${recipeId}`;
            const res = await getData(apiUrl);
            const data = res.data;

            if (data) {
              recipesDetailInfo.push({
                ...data,
                kcalPerGram: data.gramPerKcal, // gramPerKcal(X) -> KcalPerGram(O) : 고객사에서 전달받은 무게상수의 단위를 그대로 사용하였으나, 오류가 있어서 수정함.
              });

              setRecipeInfo(recipesDetailInfo);
            }

            if (data.ingredientList.length > 1 && data.inStock) {
              setRecipeDoubleInfo((prevState) => {
                if (!prevState.some((recipe) => recipe.id === data.id)) {
                  return [...prevState, data];
                } else {
                  return prevState;
                }
              });
            } else if (data.ingredientList.length === 1 && data.inStock) {
              setRecipeSingleInfo((prevState) => {
                if (!prevState.some((recipe) => recipe.id === data.id)) {
                  return [...prevState, data];
                } else {
                  return prevState;
                }
              });
            }

            // recipesDetailInfo.push({
            //   ...data,
            //   kcalPerGram: data.gramPerKcal, // gramPerKcal(X) -> KcalPerGram(O) : 고객사에서 전달받은 무게상수의 단위를 그대로 사용하였으나, 오류가 있어서 수정함.
            // });
          }
        }

        setIsRendered(false);
      } catch (err) {
        console.error(err);
        console.error('데이터를 가져올 수 없습니다.');
      }

      setTimeout(() => {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: false,
        }));
      }, reportLoadingDuration);
    })();
  }, []);

  // const currentRecipeIds =
  //   resultInfo.recipeDtoList
  //     .filter((rc) => surveyInfo.recipeName?.split(',').indexOf(rc.name) >= 0)
  //     .map((rc) => rc.id) || [];
  const currentOneMealGrams = useCallback(
    calcOneMealGramsWithRecipeInfo({
      // selectedRecipeIds: currentRecipeIds,
      selectedRecipeIds: form.recipeIdList,
      allRecipeInfos: recipeInfo?.data || [],
      oneDayRecommendKcal: resultInfo.foodAnalysis?.oneDayRecommendKcal,
      isOriginSubscriber,
    }).map((recipe) => recipe.oneMealGram),
    [recipeInfo.loading, subscribePlanInfo.loading, surveyInfo],
  );

  useEffect(() => {
    if (oneMealGramsForm.current.length === 0) {
      setOneMealGramsForm((prevState) => ({
        ...prevState,
        current: currentOneMealGrams,
      }));
    }
  }, [currentOneMealGrams]);

  // //*** 구독플랜 금액 계산
  const calcSubscribePlanPaymentPrice = useCallback(
    (planName) => {
      if (!form.recipeIdList[0] || !planName || !recipeInfo) {
        return {
          perPack: 0,
          originPrice: 0,
          salePrice: 0,
        };
      }
      const discountPercent = subscribePlanInfo.planDiscountPercent[planName];
      const oneDayRecommendKcal = surveyInfo.foodAnalysis?.oneDayRecommendKcal;
      const pricePerGrams = recipeInfo
        ?.filter((recipe) => form.recipeIdList.indexOf(recipe.id) >= 0)
        .map((recipe) => recipe.pricePerGram);
      const currentRecipeInfos = recipeInfo
        ?.filter((recipe) => form.recipeIdList.indexOf(recipe.id) >= 0)
        .map((recipe) => recipe.name);
      const nextOneMealGrams = calcOneMealGramsWithRecipeInfo({
        selectedRecipeIds: form.recipeIdList,
        allRecipeInfos: recipeInfo,
        oneDayRecommendKcal: oneDayRecommendKcal,
        isOriginSubscriber,
      }).map((recipe) => recipe.oneMealGram);

      const isSameArray = valid_isTheSameArray(
        oneMealGramsForm.next,
        nextOneMealGrams,
      );
      // // console.log(oneMealGramsForm.next, nextOneMealGrams, "\n", isSameArray);
      if (!isSameArray) {
        setOneMealGramsForm((prevState) => ({
          ...prevState,
          next: nextOneMealGrams,
        }));
      }

      // console.log('=====', nextOneMealGrams);

      // console.log('::::::', {
      //   discountPercent,
      //   oneMealGrams: nextOneMealGrams,
      //   planName,
      //   pricePerGrams,
      //   isOriginSubscriber,
      //   recipeNameList: currentRecipeInfos,
      // });

      //! [추가] 평균 전체가격, 레시피별 가격
      const { avgPrice, recipePrices } = calcSubscribePrice({
        discountPercent,
        oneMealGrams: nextOneMealGrams,
        planName,
        pricePerGrams,
        isOriginSubscriber,
        recipeNameList: currentRecipeInfos,
        toppingPerPackPriceList,
      });

      return {
        avgPrice, // 평균 전체 가격
        recipePrices, // 레시피별 가격
        // recipePrices: calcPriceList.map(item => ({
        //   name: item.recipeName,
        //   perPack: item.perPack,
        // })),
      };
    },
    // [form.plan, form.recipeIdList, recipeInfo, subscribePlanInfo],
    [form],
  );

  //! 로딩 화면
  if (isLoading.fetching || isRendered) {
    return <></>;
    // return <Loading />;
  }

  const onClickModalButton = () => {
    mct.alertHide();
  };

  //* 결제하러 가기
  const onPayHandler = async () => {
    if (submitted) return;

    const nextPaymentPrice = calcSubscribePlanPaymentPrice(form.plan).avgPrice
      .salePrice;

    // console.log(nextPaymentPrice);

    //! 서버에 전송할 데이터
    const body = {
      plan: form.plan,
      recipeIdList: form.recipeIdList,
      nextPaymentPrice: nextPaymentPrice, // 최종계산된가격
      oneDayRecommendKcal: convertFixedNumberByOneDayRecommendKcal(
        surveyInfo.foodAnalysis.oneDayRecommendKcal,
      ), // 반려견 설문조사 변경여부 검증용
      subscribeItemList: null, // 일반 구독상품은 추후 추가 예정
    };

    // console.log('body>>>', body);

    const errObj = validate(body);
    const isPassed = valid_hasFormErrors(errObj);

    console.log(errObj, isPassed);
    if (!isPassed)
      return mct.alertShow(
        '유효하지 않은 항목이 있습니다.\n선택한 레시피 및 플랜을 확인해주세요. ',
      );

    // console.log('--- onStartSubscribeOrder:\n', body)

    // ! mypage => '강아지' id로 조회
    // ! survey => '설문조사' id로 조회
    let subscribeId =
      mode === 'mypage' ? mypageSubscribeId : resultInfo.subscribeId;

    try {
      setSubmitted(true);
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));

      const apiUrl = `/api/subscribes/${subscribeId}`;

      const res = await putObjData(apiUrl, body);
      // console.log(res);
      if (res.isDone) {
        await dispatch(
          cartAction.setSubscribeOrder({
            data: { subscribeId, ...body },
          }),
        );

        await router.push(`/order/ordersheet/subscribe/${subscribeId}`);
      } else {
        const serverErrorMessage = res.data.data.message;
        const defErrorMessage = '플랜,레시피 등록에 실패하였습니다.';
        mct.alertShow(
          (serverErrorMessage || defErrorMessage) +
            '\n페이지 새로고침 후, 다시 시도해주세요.',
        );
        setSubmitted(false);
      }
    } catch (err) {
      alert('API통신 오류');
      console.error(err);
      setSubmitted(false);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }
  };

  const onActiveAlertModalHandler = () => {
    setActiveModal(true);
  };

  const handleConcernClick = (concern) => {
    setActiveConcern(concern);
  };

  // console.log('surveyInfo===>', surveyInfo);
  // console.log('resultInfo===>', resultInfo);
  // console.log('recipeInfo===>', recipeInfo);
  // console.log('recipeDoubleInfo===>', recipeDoubleInfo);
  // console.log('recipeSingleInfo===>', recipeSingleInfo);
  // console.log('form===>', form);

  return (
    <div id="statistics">
      <section
        className={`${mode !== 'mypage' ? s.default : s.mypage} ${s.title} ${
          s.result_container
        }`}
      >
        <div className={s.top_wrapper}>
          <h1>고민별 추천 레시피</h1>
          <div className={s.concern_btn_list}>
            {surveyInfo.priorityConcerns.split(',').map((concern, index) => (
              <button
                key={index}
                onClick={() => handleConcernClick(concern)}
                className={activeConcern === concern ? s.active : ''}
              >
                #{concern}
              </button>
            ))}
          </div>
        </div>

        <div className={s.result_box_list}>
          <div
            // key={index}
            className={`${s.dog_img_wrapper} ${isShowResult ? s.active : ''} ${
              form.plan && form.recipeIdList.length ? s.ready : ''
            }`}
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
            // onClick={() => dogInfoClickHandler(dogInfo.surveyId, index)}
          >
            <div className={s.dog_info_wrapper}>
              <div
                className={`${s.survey_result_wrapper} animation-show-all-child`}
              >
                {/* 3. 레시피 선택 */}
                <SurveyResultRecipe
                  surveyInfo={surveyInfo}
                  recipeInfo={recipeInfo}
                  recipeDoubleInfo={recipeDoubleInfo}
                  recipeSingleInfo={recipeSingleInfo}
                  form={form}
                  setForm={setForm}
                  calcPrice={calcSubscribePlanPaymentPrice}
                  pricePerPack={pricePerPack}
                  setPricePerPack={setPricePerPack}
                />

                <div className={s.box_dot_divider}></div>

                {/* 4. 플랜 선택 */}
                <SurveyResultPlan
                  surveyInfo={surveyInfo}
                  recipeInfo={recipeInfo}
                  recipeDoubleInfo={recipeDoubleInfo}
                  recipeSingleInfo={recipeSingleInfo}
                  form={form}
                  setForm={setForm}
                  calcPrice={calcSubscribePlanPaymentPrice}
                  pricePerPack={pricePerPack}
                  setPricePerPack={setPricePerPack}
                  setToppingPerPackPriceList={setToppingPerPackPriceList}
                />

                {/* 5. 챙겨줄 제품 - Swiper */}
                {/* <div className={s.recommend_product_container}>
                    {surveyInfo.myDogName} (이)에게 더 챙겨줄 제품은 없을까요?
                    <div className={s.recommend_product_title}>
                      함게 구독하면 좋은 일반 상품도 살펴보세요!
                    </div>
                    <Swiper_product />
                  </div> */}
              </div>
            </div>
          </div>
        </div>

        {mode === 'mypage' && (
          <button className={s.link} onClick={onPrevPage}>
            마이페이지로 돌아가기
          </button>
        )}
      </section>

      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}
      {activeModal && (
        <Modal_deliveryNotice
          onModalActive={setActiveModal}
          onPayHandler={onPayHandler}
        />
      )}
      <button
        className={`${
          form.plan && form.recipeIdList.length > 0 ? s.activated : ''
        } ${s.payment_btn}`}
        onClick={onActiveAlertModalHandler}
        disabled={!(form.plan && form.recipeIdList.length > 0)}
      >
        결제하러 가기
        <FaArrowRight />
      </button>
    </div>
  );
};
