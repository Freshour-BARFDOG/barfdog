import React, { useCallback, useEffect, useState } from 'react';
import s from 'src/pages/order/subscribeShop/index.module.scss';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { SubscribeShopRecipe } from '/src/components/subscribe/SubscribeShopRecipe';
import { SubscribeShopPlan } from '/src/components/subscribe/SubscribeShopPlan';
import { getDataSSR, putObjData } from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import { SubscribeRecommendResult } from '/src/components/subscribe/SubscribeRecommendResult';
import { validate } from '/util/func/validation/validation_orderSubscribe';
import {
  valid_hasFormErrors,
  valid_isTheSameArray,
} from '/util/func/validation/validationPackage';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import { cartAction } from '/store/cart-slice';
import { subscribeStatus } from '/store/TYPE/subscribeStatus';
import { useModalContext } from '/store/modal-context';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { FullScreenRunningDog } from '/src/components/atoms/FullScreenLoading';
import { calcChangedSubscribeDeliveryDate } from '/util/func/calcNextSubscribeDeliveryDate';
import transformDate from '/util/func/transformDate';
import { useSubscribePlanInfo } from '/util/hook/useSubscribePlanInfo';
import { useSubscribeRecipeInfo } from '/util/hook/useSubscribeRecipeInfo';
import { calcOneMealGramsWithRecipeInfo } from '/util/func/subscribe/calcOneMealGramsWithRecipeInfo';
import { calcSubscribePrice } from '/util/func/subscribe/calcSubscribePrices';
import { convertFixedNumberByOneDayRecommendKcal } from '../../../../util/func/subscribe/convertFixedNumberByOneDayRecommendKcal';
import { originSubscribeIdList } from '/util/func/subscribe/originSubscribeIdList';

export default function RegisterSubscribeInfoPage({ data }) {
  const subscribePlanInfo = useSubscribePlanInfo();
  const recipeInfo = useSubscribeRecipeInfo();

  const info = {
    dogId: data.surveyInfo.dogId,
    dogName: data.surveyInfo.dogName,
    subscribeId: data.surveyInfo.subscribeId,
    subscribeStatus: data.surveyInfo.subscribeStatus,
    oneMealGramsPerRecipe: data.surveyInfo.oneMealGramsPerRecipe || null,
    recommendRecipeId: data.surveyInfo.recommendRecipeId,
    recommendRecipeName: data.surveyInfo.recommendRecipeName,
    recommendRecipeDescription: data.surveyInfo.recommendRecipeDescription,
    recommendRecipeImgUrl: data.surveyInfo.recommendRecipeImgUrl,
    uiNameKorean: data.surveyInfo.uiNameKorean,
    uiNameEnglish: data.surveyInfo.uiNameEnglish,
    foodAnalysis: {
      oneDayRecommendKcal: data.surveyInfo.foodAnalysis.oneDayRecommendKcal,
      oneDayRecommendGram: data.surveyInfo.foodAnalysis.oneDayRecommendGram,
      oneMealRecommendGram: data.surveyInfo.foodAnalysis.oneMealRecommendGram,
    },
    inedibleFood: data.dogDto.inedibleFood,
    inedibleFoodEtc: data.dogDto.inedibleFoodEtc, // 못먹는 음식
    caution: data.dogDto.caution,
    recipeInfoList: data.recipesDetailInfo, // 레시피의 모든 정보 (초기화)

    // 콕뱅크 할인율 할때 이부분 수정하면됨
    planDiscountPercent: subscribePlanInfo.planDiscountPercent,
  };

  const currentRecipeIds =
    data.surveyInfo.recipeDtoList
      .filter(
        (rc) => data.surveyInfo.recipeName?.split(',').indexOf(rc.name) >= 0,
      )
      .map((rc) => rc.id) || [];
  const currentOneMealGrams = useCallback(
    calcOneMealGramsWithRecipeInfo({
      selectedRecipeIds: currentRecipeIds,
      allRecipeInfos: recipeInfo?.data || [],
      oneDayRecommendKcal: info.foodAnalysis.oneDayRecommendKcal,
      isOriginSubscriber,
    }).map((recipe) => recipe.oneMealGram),
    [recipeInfo.loading, subscribePlanInfo.loading, data],
  );

  // console.log('data.surveyInfo>>>', data.surveyInfo);

  const initialForm = {
    plan: data.surveyInfo.plan || null,
    recipeIdList: currentRecipeIds,
    nextPaymentPrice: null,
    oneMealGramList: [],
  };

  const fullscreenLoadingDuration = 0; // ms
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState({}); // boolean
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [oneMealGramsForm, setOneMealGramsForm] = useState({
    current: [],
    next: [],
  });
  const [isOriginSubscriber, setIsOriginSubscriber] = useState(false);

  useEffect(() => {
    //! [추가] 기존 구독자인지 확인
    originSubscribeIdList.includes(info.subscribeId) &&
      setIsOriginSubscriber(true);
  }, []);

  // console.log(info.subscribeId);
  // console.log(isOriginSubscriber);

  useEffect(() => {
    if (oneMealGramsForm.current.length === 0) {
      setOneMealGramsForm((prevState) => ({
        ...prevState,
        current: currentOneMealGrams,
      }));
    }
  }, [currentOneMealGrams]);

  useEffect(() => {
    setIsLoading((prevState) => ({
      ...prevState,
      fetching: true,
    }));

    setTimeout(() => {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    }, fullscreenLoadingDuration);
  }, [subscribePlanInfo.loading]);

  //*** 구독플랜 금액 계산
  const calcSubscribePlanPaymentPrice = useCallback(
    (planName) => {
      if (!form.recipeIdList[0] || !planName || !recipeInfo.data) {
        return {
          perPack: 0,
          originPrice: 0,
          salePrice: 0,
        };
      }
      const discountPercent = subscribePlanInfo.planDiscountPercent[planName];
      const oneDayRecommendKcal = info.foodAnalysis.oneDayRecommendKcal;
      const pricePerGrams = info.recipeInfoList
        ?.filter((recipe) => form.recipeIdList.indexOf(recipe.id) >= 0)
        .map((recipe) => recipe.pricePerGram);
      const currentRecipeInfos = info.recipeInfoList
        ?.filter((recipe) => form.recipeIdList.indexOf(recipe.id) >= 0)
        .map((recipe) => recipe.name);
      const nextOneMealGrams = calcOneMealGramsWithRecipeInfo({
        selectedRecipeIds: form.recipeIdList,
        allRecipeInfos: recipeInfo.data,
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

      return calcSubscribePrice({
        discountPercent,
        oneMealGrams: nextOneMealGrams,
        planName,
        pricePerGrams,
        isOriginSubscriber,
        recipeNameList: currentRecipeInfos,
      });
    },
    [form.plan, form.recipeIdList, recipeInfo, subscribePlanInfo],
  );

  const onStartSubscribeOrder = async () => {
    // 맞춤레시피 구매하기 (CONDITION: 결제 전)
    if (submitted) return;

    const nextPaymentPrice = calcSubscribePlanPaymentPrice(form.plan).salePrice;

    const body = {
      plan: form.plan,
      recipeIdList: form.recipeIdList,
      nextPaymentPrice: nextPaymentPrice, // 최종계산된가격
      oneDayRecommendKcal: convertFixedNumberByOneDayRecommendKcal(
        info.foodAnalysis.oneDayRecommendKcal,
      ), // 반려견 설문조사 변경여부 검증용
    };

    console.log('body>>>', body);

    const errObj = validate(body);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed)
      return mct.alertShow(
        '유효하지 않은 항목이 있습니다.\n선택한 레시피 및 플랜을 확인해주세요. ',
      );

    // console.log('--- onStartSubscribeOrder:\n', body)

    try {
      setSubmitted(true);
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));

      const apiUrl = `/api/subscribes/${info.subscribeId}`;
      const res = await putObjData(apiUrl, body);
      // console.log(res);
      if (res.isDone) {
        await dispatch(
          cartAction.setSubscribeOrder({
            data: { subscribeId: info.subscribeId, ...body },
          }),
        );
        await router.push(`/order/deliveryInfo`);
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

  const onChangeSubscribeOrder = async () => {
    if (submitted) return;
    // 구독 중 or 구독 보류 상태일 경우, 맞춤레시피 변경하기
    // ! 기존에 플랜, 레시피 정보 그대로, 맞춤플랜 변경하기 실행했을 경우: nextPaymentPrice가 없으므로, 에러발생시킴

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        paging: true,
      }));

      const nextPaymentPrice = calcSubscribePlanPaymentPrice(
        form.plan,
      ).salePrice;

      const body = {
        plan: form.plan,
        recipeIdList: form.recipeIdList,
        nextPaymentPrice: nextPaymentPrice, // 최종 계산된 가격
        oneDayRecommendKcal: info.foodAnalysis.oneDayRecommendKcal, // 반려견 설문조사 변경여부 검증용
      };
      // console.log('onChangeSubscribeOrder:\n', body)

      const errObj = validate(body);
      const isPassed = valid_hasFormErrors(errObj);
      if (!isPassed) {
        return mct.alertShow(
          '유효하지 않은 항목이 있습니다.\n선택한 레시피 및 플랜을 확인해주세요.',
        );
      }

      const prevInfo = data.surveyInfo;
      const prevDATA = {
        plan: prevInfo.plan, // 기존 주문 정보
        recipeName: prevInfo.recipeName, // 기존 주문 정보
        oneMealGrams: info.oneMealGramsPerRecipe, // 강아지 생성 후 > 맞춤레시피 구매하기 시 생성되는 값. / 쉼표(,) 구분으로 2개 이상의 레시피에 대응
        nextPaymentPrice: prevInfo.nextPaymentPrice, // 기존 주문 정보
        nextPaymentDate: transformDate(prevInfo.nextPaymentDate), // 기존 주문 정보
        nextDeliveryDate: transformDate(prevInfo.nextDeliveryDate), // 기존 주문 정보
      };

      const nextPlan = form.plan;
      const nextPlanDeliveryPeriodInWeeks =
        subscribePlanType[nextPlan].weeklyPaymentCycle;

      const nextDATA = {
        plan: nextPlan, // 유저가 선택한 플랜
        recipeIdList: form.recipeIdList, // 다음 변경될 recipe의 ID List
        recipeName: info.recipeInfoList
          .filter((list) => form.recipeIdList.join(',').indexOf(list.id) >= 0)
          .map((list) => list.name)
          .join(', '), // 유저가 선택한 레시피 이름
        oneMealGrams: oneMealGramsForm.next,
        nextPaymentPrice: nextPaymentPrice, // 유저가 선택한 플랜&레시피에 따라서 계산된 값
        nextPaymentDate: calcChangedSubscribeDeliveryDate(
          prevInfo.nextPaymentDate,
          nextPlanDeliveryPeriodInWeeks,
        ), // prev SubscribeOrder 의 nextPayment 완료 후, 그 다음 Cylcle
        nextDeliveryDate: calcChangedSubscribeDeliveryDate(
          prevInfo.nextDeliveryDate,
          nextPlanDeliveryPeriodInWeeks,
        ), // prev SubscribeOrder 의 nextPayment 완료 후, 그 다음 Cylcle
      };

      const DATA = {
        lastSurveyDate: prevInfo.lastSurveyDate,
        subscribeId: prevInfo.subscribeId,
        oneDayRecommendKcal: data.surveyInfo.foodAnalysis.oneDayRecommendKcal, // 반려견 설문조사 변경여부 검증용
        dogId: prevInfo.dogId,
        prev: prevDATA,
        next: nextDATA,
      };

      // // console.log('DATA:', DATA);
      await setSubmitted(true);
      await dispatch(cartAction.changeSubscribeOrder({ data: DATA }));
      await router.push(`/order/orderChanged/subscribe?dogId=${info.dogId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        paging: false,
      }));
    }
  };

  const onPrevPage = () => {
    if (confirm(`이전 페이지로 돌아가시겠습니까?`)) router.back();
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  if (isLoading?.fetching) {
    return <FullScreenRunningDog opacity={1} />;
  }

  console.log('form>>>', form);

  return (
    <>
      <MetaTitle title="플랜 레시피 선택" />
      <Layout>
        <Wrapper>
          <SubscribeRecommendResult info={info} />
          <SubscribeShopPlan
            name={'plan'}
            info={info}
            form={form}
            setForm={setForm}
            calcPrice={calcSubscribePlanPaymentPrice}
          />
          <SubscribeShopRecipe
            name="recipeIdList"
            info={info}
            form={form}
            setForm={setForm}
          />
          <section className={s.btn_box}>
            <button className={s.prevPage} onClick={onPrevPage}>
              뒤로가기
            </button>

            {(info.subscribeStatus === subscribeStatus.BEFORE_PAYMENT ||
              info.subscribeStatus === subscribeStatus.SURVEY_COMPLETED) && (
              <button className={s.nextPage} onClick={onStartSubscribeOrder}>
                {isLoading?.submit ? (
                  <Spinner style={{ color: '#fff' }} />
                ) : (
                  '맞춤레시피 구매하기'
                )}
              </button>
            )}

            {(info.subscribeStatus === subscribeStatus.SUBSCRIBING ||
              info.subscribeStatus === subscribeStatus.SUBSCRIBE_CANCEL ||
              info.subscribeStatus === subscribeStatus.SUBSCRIBE_PENDING) && (
              <button className={s.nextPage} onClick={onChangeSubscribeOrder}>
                {isLoading?.submit ? (
                  <Spinner style={{ color: '#fff' }} />
                ) : (
                  '맞춤플랜 변경하기'
                )}
              </button>
            )}
          </section>
        </Wrapper>
      </Layout>
      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  // Query CASE
  // surveyReportsId : 결제 전
  // dogId: 구독 중 || 구독 보류
  const { surveyReportsId, dogId } = query;

  let data = null;

  // DATA: this Dog's Result of survey Report
  const getSurveyReportResultApiUrl = surveyReportsId
    ? `/api/surveyReports/${surveyReportsId}/result` // "설문조사 직후" 현재 페이지 진입
    : dogId
    ? `/api/dogs/${dogId}/surveyReportResult` // "설문조사 수정 후", "맞춤플랜 변경"으로 현재 페이지 진입
    : null;
  const surveyInfoRes = await getDataSSR(req, getSurveyReportResultApiUrl);
  const surveyInfoData = surveyInfoRes?.data || null;
  const thisDogId = dogId || surveyInfoData?.dogId || null;

  // DATA: this Dog
  const getDogInfoApiUrl = `/api/dogs/${thisDogId}`;
  const dogInfoRes = await getDataSSR(req, getDogInfoApiUrl);
  const dogData = dogInfoRes?.data || null;
  const dogDto = dogData?.dogDto || null;

  // DATA: Recipes
  const getRecipeInfoApiUrl = `/api/recipes`;
  const recipeInfoRes = await getDataSSR(req, getRecipeInfoApiUrl);
  const recipeInfoData = recipeInfoRes?.data;

  // console.log(
  //   'recipeInfoData',
  //   recipeInfoData._embedded?.recipeListResponseDtoList,
  // );

  if (dogData && recipeInfoData) {
    const recipeIdList =
      recipeInfoData._embedded?.recipeListResponseDtoList?.map((l) => l.id) ||
      [];
    const recipesDetailInfo = [];
    for (const recipeId of recipeIdList) {
      const apiUrl = `/api/recipes/${recipeId}`;
      const res = await getDataSSR(req, apiUrl);
      const data = res.data;
      console.log('recipeDatas>>>> ', data);
      if (data) {
        recipesDetailInfo.push({
          ...data,
          kcalPerGram: data.gramPerKcal, // gramPerKcal(X) -> KcalPerGram(O) : 고객사에서 전달받은 무게상수의 단위를 그대로 사용하였으나, 오류가 있어서 수정함.
        });
      }
    }

    // console.log("dogDto: ",dogDto);
    // console.log("surveyInfoData: ",surveyInfoData);
    // console.log("recipesDetailInfo: ",recipesDetailInfo);
    data = {
      dogDto: dogDto,
      surveyInfo: surveyInfoData,
      recipesDetailInfo: recipesDetailInfo,
    };
  }

  if (!data) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    };
  }

  return { props: { data } };
}
