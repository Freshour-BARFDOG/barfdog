import React, { useEffect, useState } from 'react';
import s from 'src/pages/order/subscribeShop/index.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { useRouter } from 'next/router';
import { SubscribeRecipe } from '/src/components/subscribe/SubscribeRecipe';
import { SubscribePlan } from '/src/components/subscribe/SubscribePlan';
import { getData, getDataSSR, postObjData } from '../../api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import { SubscribeRecommendResult } from '/src/components/subscribe/SubscribeRecommendResult';
import { validate } from '/util/func/validation/validation_orderSubscribe';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import {subscribePlanType} from "/store/TYPE/subscribePlanType";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import {useDispatch} from "react-redux";
import {cartAction} from "/store/cart-slice";
import {FullScreenRunningDog} from "../../../components/atoms/FullScreenLoading";


// - 1.  설문조사 리포트 레시피 추천 결과 조회  못먹는 음식 조회 /api/dogs/14
// - 2-1. Client에서 Redux로 데이터들고, 구독주문하기(주문서) 페이지로 이동
// - 2-2. => 구독 정보 생성

export default function RegisterSubscribeInfoPage({ data }) {
  
  let initialData
    if(data){
      initialData = {
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
        inedibleFood: data.dogDto.activity,
        inedibleFoodEtc: data.dogDto.inedibleFoodEtc, // 못먹는 음식
        // recipeIngredient: data.recipeDtoList.filter();
        caution: data.dogDto.activity,
        recipeDtoList: data.recipeDtoList, // []
      };
    }
  
  
  const initialForm = {
    plan: '',
    recipeIdList: [],
    nextPaymentPrice: null,
  }
  const [info, setInfo] = useState(initialData);
  const [isLoading, setIsLoading] = useState(); // boolean
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(initialForm);
  const router = useRouter();
  const dispatch = useDispatch();
  

  const onPrevPage = () => {
    if (confirm(`이전 페이지로 돌아가시겠습니까?`)) router.back();
  };

  
  
  const calcSubscribePlanPaymentPrice = (totalNumberOfPacks, discountPercent) => {
    if(!form.recipeIdList[0]) {
      return {
        perPack: 0,
        originPrice: 0,
        salePrice: 0,
      }
    }
    
    const selectedRecipes = info.recipeInfoList?.filter((rc) => form.recipeIdList.indexOf(rc.id) >= 0);
    const result = selectedRecipes?.map((recipe) => {
      const recipeGramConst = recipe.pricePerGram; // 1g 당 가격 상수 ( 어드민에서 입력한 값 )
      const recipeGram = info?.foodAnalysis.oneMealRecommendGram; // 한끼(한팩) 무게g
      const perPack = Number((recipeGramConst * recipeGram).toFixed(0));
      
      return {
        perPack : perPack, // 팩당가격상수 * 무게
        originPrice : totalNumberOfPacks * perPack, // 할인 전 가격
        salePrice : (totalNumberOfPacks * perPack * (1 - (discountPercent / 100))) // 할인 후 가격 (판매가)
      }
    });
    
    // 평균
    let perPack = result.map(r=>r.perPack).reduce((acc, cur)=> acc+cur)/ result.length
    let originPrice = result.map(r=>r.originPrice).reduce((acc, cur)=> acc+cur) / result.length;
    let salePrice =  result.map(r=>r.salePrice).reduce((acc, cur)=> acc+cur) / result.length; // ! 1원 단위 절삭
    // console.log(result)
    const cutOffUnit = 10; // '10'원단위로 절사 (1원단위 버림)
    perPack = Math.floor(perPack/cutOffUnit) * cutOffUnit;
    originPrice = Math.floor(originPrice/cutOffUnit) * cutOffUnit;
    salePrice = Math.floor(salePrice/cutOffUnit) * cutOffUnit;
    return {
      perPack ,
      originPrice,
      salePrice,
    };
  };
  
 
  
  
  const onSubmit = async () => {
    if (submitted === true) return;
    
    const nextPaymentPrice = calcSubscribePlanPaymentPrice(
      subscribePlanType[form.plan]?.totalNumberOfPacks,
      subscribePlanType[form.plan]?.discountPercent,
    ).salePrice;
    
    const body = {
      plan: form.plan,
      recipeIdList: form.recipeIdList,
      nextPaymentPrice: nextPaymentPrice // 최종계산된가격
    };
    
    const errObj = validate(body);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return alert('유효하지 않은 항목이 있습니다.\n선택한 레시피 및 플랜을 확인해주세요. ');
  
 
    const postFormValuesApiUrl = `/api/subscribes/${info.subscribeId}/planRecipes`;
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      
      const res = await postObjData(postFormValuesApiUrl, body);
      
      console.log(res);
      if (res.isDone) {
        await dispatch(cartAction.setSubscribeOrder({ data: { subscribeId: info.subscribeId, ...body } }));
        setSubmitted(true);
        setIsLoading({nextPage: true});
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
  }

  return (
    <>
      <MetaTitle title="플랜 레시피 선택" />
      <Layout>
        <Wrapper>
          <SubscribeRecommendResult info={info} />
          <SubscribePlan name={'plan'} info={info} form={form} setForm={setForm} calcPrice={calcSubscribePlanPaymentPrice}/>
          <SubscribeRecipe
            name="recipeIdList"
            info={info}
            setInfo={setInfo}
            form={form}
            setForm={setForm}
          />
          <section className={s.btn_box}>
            <button className={s.prevPage} onClick={onPrevPage}>
              뒤로가기
            </button>
            <button className={s.nextPage} onClick={onSubmit}>
              {isLoading?.submit ? <Spinner style={{ color: '#fff' }} /> : '맞춤레시피 구매하기'}
            </button>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { surveyReportsId } = query;

  let data = null;
  const getSurveyInfoApiUrl = `/api/surveyReports/${surveyReportsId}/result`;
  const surveyInfoRes = await getDataSSR(req, getSurveyInfoApiUrl); // 해당 정보가 중요
  const dogId = surveyInfoRes.data.dogId;
  const getDogInfoApiUrl = `/api/dogs/${dogId}`;
  const dogInfoRes = await getDataSSR(req, getDogInfoApiUrl);
  data = {
    dogDto: dogInfoRes.data.dogDto || null,
    recipeDtoList: dogInfoRes.data.recipeDtoList || null,
    surveyInfo: surveyInfoRes.data || null,
  };

  // console.log(dogInfoRes.data.status, surveyInfoRes.data.status);
  // if(dogInfoRes.data.status !== 200 || surveyInfoRes !== 200){
  //   res.setHeader("location", "/account/login");
  //   res.statusCode = 401;
  //   res.end();
  //   return;
  // }
  
  

  return { props: { data } };
}
