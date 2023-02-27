import React, {useEffect, useState} from 'react';
import s from 'src/pages/order/subscribeShop/index.module.scss';
import {useDispatch} from 'react-redux';
import {useRouter} from 'next/router';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import {SubscribeShopRecipe} from '/src/components/subscribe/SubscribeShopRecipe';
import {SubscribeShopPlan} from '/src/components/subscribe/SubscribeShopPlan';
import {getDataSSR, postObjData} from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import {SubscribeRecommendResult} from '/src/components/subscribe/SubscribeRecommendResult';
import {validate} from '/util/func/validation/validation_orderSubscribe';
import {valid_hasFormErrors} from '/util/func/validation/validationPackage';
import {subscribePlanType} from '/store/TYPE/subscribePlanType';
import {cartAction} from '/store/cart-slice';
import {subscribeStatus} from '/store/TYPE/subscribeStatus';
import {useModalContext} from '/store/modal-context';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import {FullScreenRunningDog} from '/src/components/atoms/FullScreenLoading';
import {calcChangedSubscribeDeliveryDate} from '/util/func/calcNextSubscribeDeliveryDate';
import transformDate from '/util/func/transformDate';
import {useSubscribePlanInfo} from "/util/hook/useSubscribePlanInfo";
import {calcSubscribePrice} from "/util/hook/useSubscribeInfo";


export default function RegisterSubscribeInfoPage({ data }) {
  const subscribePlanInfo = useSubscribePlanInfo();
  const info = {
    dogId: data.surveyInfo.dogId,
    dogName: data.surveyInfo.dogName,
    subscribeId: data.surveyInfo.subscribeId,
    subscribeStatus: data.surveyInfo.subscribeStatus,
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
    planDiscountPercent: subscribePlanInfo.planDiscountPercent,
  };
  
  const initialForm = {
    plan: data.surveyInfo.plan || null,
    recipeIdList: data.surveyInfo.recipeDtoList.filter((rc)=>
      data.surveyInfo.recipeName?.split(',').indexOf(rc.name) >= 0).map(rc=>rc.id) || [],
    nextPaymentPrice: null,
  };

  const fullscreenLoadingDuration = 0; // ms
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(); // boolean
  const [submitted, setSubmitted] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [form, setForm] = useState(initialForm);


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

  const calcSubscribePlanPaymentPrice = (planName) => {
    if (!form.recipeIdList[0] || !planName) {
      return {
        perPack: 0,
        originPrice: 0,
        salePrice: 0,
      };
    }
    const discountPercent = subscribePlanInfo.planDiscountPercent[planName];
    const oneMealRecommendGram = info.foodAnalysis.oneMealRecommendGram; // 한끼(한팩) 무게g
    const pricePerGrams = info.recipeInfoList?.filter((recipe) => form.recipeIdList.indexOf(recipe.id) >= 0).map( recipe => recipe.pricePerGram );
    
    return calcSubscribePrice( {
      discountPercent,
      oneMealRecommendGram,
      planName,
      pricePerGrams
    });
  };
  
  
  
  
  const onStartSubscribeOrder = async () => {
    // 맞춤레시피 구매하기 (CONDITION: 결제 전)
    if (submitted) return;
  
    const nextPaymentPrice = calcSubscribePlanPaymentPrice(form.plan).salePrice;

    const body = {
      plan: form.plan,
      recipeIdList: form.recipeIdList,
      nextPaymentPrice: nextPaymentPrice, // 최종계산된가격
    };
    // console.log(body);

    const errObj = validate(body);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed)
      return alert('유효하지 않은 항목이 있습니다.\n선택한 레시피 및 플랜을 확인해주세요. ');

    const apiUrl = `/api/subscribes/${info.subscribeId}/planRecipes`;
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));

      const res = await postObjData(apiUrl, body);
      console.log(res);
      if (res.isDone) {
        await dispatch(
          cartAction.setSubscribeOrder({ data: { subscribeId: info.subscribeId, ...body } }),
        );
        setSubmitted(true);
        await router.push(`/order/deliveryInfo`);
      } else {
        alert('플랜,레시피 등록에 실패하였습니다.');
      }
    } catch (err) {
      console.error('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onChangeSubscribeOrder = async () => {
    // 맞춤레시피 변경하기 (CONDITION: 구독 중 or 구독 보류)
    // ! 기존에 플랜, 레시피 정보 그대로, 맞춤플랜 변경하기 실행했을 경우: nextPaymentPrice가 없으므로, 에러발생시킴
    if (submitted === true) return console.error('The form has already been sumitted');
    setIsLoading((prevState) => ({
      ...prevState,
      paging: true,
    }));
  
    const nextPaymentPrice = calcSubscribePlanPaymentPrice(form.plan).salePrice;
  
    const body = {
      plan: form.plan,
      recipeIdList: form.recipeIdList,
      nextPaymentPrice: nextPaymentPrice, // 최종 계산된 가격
    };
    console.log('onChangeSubscribeOrder:\n', body)

    const errObj = validate(body);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) {
      return onShowModal('유효하지 않은 항목이 있습니다.\n선택한 레시피 및 플랜을 확인해주세요.');
    }
    
    const prevInfo = data.surveyInfo;
    const prevDATA = {
      plan: prevInfo.plan, // 기존 주문 정보
      recipeName: prevInfo.recipeName, // 기존 주문 정보
      oneMealRecommendGram: info.foodAnalysis.oneMealRecommendGram, // 기존 주문 정보
      nextPaymentPrice: prevInfo.nextPaymentPrice, // 기존 주문 정보
      nextPaymentDate: transformDate(prevInfo.nextPaymentDate), // 기존 주문 정보
      nextDeliveryDate: transformDate(prevInfo.nextDeliveryDate), // 기존 주문 정보
    };

    const nextPlan = form.plan;
    const nextPlanDeliveryPeriodInWeeks = subscribePlanType[nextPlan].weeklyPaymentCycle;

    const nextDATA = {
      plan: nextPlan, // 유저가 선택한 플랜
      recipeIdList: form.recipeIdList, // 다음 변경될 recipe의 ID List
      recipeName: info.recipeInfoList
        .filter((list) => form.recipeIdList.join(',').indexOf(list.id) >= 0)
        .map((list) => list.name)
        .join(', '), // 유저가 선택한 레시피 이름
      oneMealRecommendGram: info.foodAnalysis.oneMealRecommendGram, // 기존 주문 정보 (변하지 않는 값)
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
      dogId: prevInfo.dogId,
      prev: prevDATA,
      next: nextDATA,
    };

    // console.log('DATA:', DATA);
    await setSubmitted(true);
    await dispatch(cartAction.changeSubscribeOrder({ data: DATA }));
    await router.push(`/order/orderChanged/subscribe?dogId=${info.dogId}`);
    setIsLoading((prevState) => ({
      ...prevState,
      paging: false,
    }));
  };

  const onPrevPage = () => {
    if (confirm(`이전 페이지로 돌아가시겠습니까?`)) router.back();
  };
  const onShowModal = (message) => {
    if (message) mct.alertShow();
    setModalMessage(message);
  };

  const onHideModal = () => {
    setModalMessage('');
    mct.alertHide();
  };

  if (isLoading?.fetching) {
    return <FullScreenRunningDog opacity={1} />;
  }
  // console.log(form, info)
  
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
          <SubscribeShopRecipe name="recipeIdList" info={info} form={form} setForm={setForm} />
          <section className={s.btn_box}>
            <button className={s.prevPage} onClick={onPrevPage}>
              뒤로가기
            </button>

            {info.subscribeStatus === subscribeStatus.BEFORE_PAYMENT && (
              <button className={s.nextPage} onClick={onStartSubscribeOrder}>
                {isLoading?.submit ? <Spinner style={{ color: '#fff' }} /> : '맞춤레시피 구매하기'}
              </button>
            )}

            {/* ! PRODUCT CODE */}
            {(info.subscribeStatus === subscribeStatus.SUBSCRIBING ||
              info.subscribeStatus === subscribeStatus.SUBSCRIBE_PENDING) && (
              <button className={s.nextPage} onClick={onChangeSubscribeOrder}>
                {isLoading?.submit ? <Spinner style={{ color: '#fff' }} /> : '맞춤플랜 변경하기'}
              </button>
            )}

            {/* ! TEST CODE */}
            {/*<button className={s.nextPage} onClick={onChangeSubscribeOrder}>*/}
            {/*  {isLoading?.paging ? <Spinner style={{ color: '#fff' }} /> : '맞춤레피시 변경하기'}*/}
            {/*</button>*/}
          </section>
        </Wrapper>
      </Layout>
      {hasAlert && <Modal_global_alert message={modalMessage} onClick={onHideModal} background />}
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
    ? `/api/surveyReports/${surveyReportsId}/result`
    : dogId
    ? `/api/dogs/${dogId}/surveyReportResult`
    : null;
  const surveyInfoRes = await getDataSSR(req, getSurveyReportResultApiUrl);
  const thisDogId = dogId || surveyInfoRes.data.dogId;

  // DATA: this Dog
  const getDogInfoApiUrl = `/api/dogs/${thisDogId}`;
  const dogInfoRes = await getDataSSR(req, getDogInfoApiUrl);

  // DATA: Recipes
  const getRecipeInfoApiUrl = `/api/recipes`;
  const recipeInfoRes = await getDataSSR(req, getRecipeInfoApiUrl);
  
  if(dogInfoRes?.data && dogInfoRes?.data && recipeInfoRes?.data) {
    const recipeIdList =
      recipeInfoRes?.data?._embedded?.recipeListResponseDtoList?.map((l) => l.id) || [];
    const recipeInfoList = [];
    for (const recipeId of recipeIdList) {
      const apiUrl = `/api/recipes/${recipeId}`;
      const res = await getDataSSR(req, apiUrl);
      // console.log(res)
      recipeInfoList.push(res.data);
    }
  
    data = {
      dogDto: dogInfoRes.data.dogDto || null,
      surveyInfo: surveyInfoRes?.data || null,
      recipesDetailInfo: recipeInfoList,
    };
  }
  
  if(!data){
    return {
      props:{},
      redirect:{
        destination: '/'
      }
    }
  }

  return { props: { data } };
}
