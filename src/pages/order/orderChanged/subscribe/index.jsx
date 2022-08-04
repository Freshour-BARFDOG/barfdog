import React, {useState} from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './subscribeOrderChanged.module.scss';
import Image from 'next/image';
import {getDataSSR, putObjData} from '/src/pages/api/reqData';
import { useSelector } from 'react-redux';
import {FullScreenLoading} from "/src/components/atoms/FullScreenLoading";
import transformLocalCurrency from "../../../../../util/func/transformLocalCurrency";
import transformDate from "../../../../../util/func/transformDate";
import {subscribePlanType} from "../../../../../store/TYPE/subscribePlanType";
import {validate} from "../../../../../util/func/validation/validation_orderSubscribe";
import {valid_hasFormErrors} from "../../../../../util/func/validation/validationPackage";
import {cartAction} from "../../../../../store/cart-slice";
import Modal_global_alert from "../../../../components/modal/Modal_global_alert";


export default function SubscribeOrderChangedPage({ data }) {
  // console.log(data);
  const cart = useSelec
  tor((s) => s.cart);
  const prevInfo = cart.subscribeOrder.prev;
  console.log(cart.subscribeOrder);
  const [isLoading, setIsLoading] = useState(); // boolean
  const [submitted, setSubmitted] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  
  const DATA = {
    lastSurveyDate: data.surveyReportInfo.lastSurveyDate,
    prev: {
      plan:prevInfo.plan,
      recipeName:prevInfo.recipeName,
      oneMealRecommendGram:prevInfo.oneMealRecommendGram,
      nextPaymentDate:prevInfo.nextPaymentDate,
      nextPaymentPrice:prevInfo.nextPaymentPrice,
      nextDeliveryDate:prevInfo.nextDeliveryDate,
    },
    next: {
      plan:data.surveyRerportResultInfo.plan, // 그전에 선택한값 REDUX
      recipeName:data.surveyRerportResultInfo.recipeName, // id리스트에서 가져올수 있죠 // REDUX
      oneMealRecommendGram:data.surveyRerportResultInfo.oneMealRecommendGram, // 계산기 급여량...갖고오기 // REDUX
      nextPaymentDate:data.surveyRerportResultInfo.nextPaymentDate,
      nextPaymentPrice:data.surveyRerportResultInfo.nextPaymentPrice, // 이전페이지 계산기
      nextDeliveryDate:data.surveyRerportResultInfo.recipe,// 기존 배송일에서.....계산기..........deliveruy calc....
    },
  }
  
  const onChangeSubscribeOrder = async () => { // ! 추가 테스트 필요  // 실제 구독 결제해야, 500 error 가 안 뜸.
    if (submitted === true) return;
    // 이전 페이지에서, REDUX로 데이터 옮길 것
    
    const nextPaymentPrice = calcSubscribePlanPaymentPrice(
      subscribePlanType[form.plan]?.totalNumberOfPacks,
      subscribePlanType[form.plan]?.discountPercent,
    ).salePrice;
    
    const body = {
      plan: form.plan,
      recipeIdList: form.recipeIdList,
      nextPaymentPrice: nextPaymentPrice, // 최종 계산된 가격
    };
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const apiUrl = `api/subscribes/${data.surveyInfo.subscribeId}`;
      const res = await putObjData(apiUrl, body);
      console.log(res)
      if(!res.isDone){  ////////////////// ! TEST CODE //
        // if(res.isDone){  // ! PRODUCT CODE
        setSubmitted(true);
        onShowModal('맞춤레시피 변경이 완료되었습니다.');
      } else {
        onShowModal(`데이터를 전송하는데 실패했습니다.\n${res.error}`);
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };


 
  
  const onPrevPage = () => {
    if (confirm(`이전 페이지로 돌아가시겠습니까?`)) router.back();
  };
  
  
  if(!data){
    return <FullScreenLoading/>;
  }
  return (
    <>
      <MetaTitle title={`정기구독 플랜레시피 변경}`} />
      <Layout>
        <Wrapper>
          <section className={s.title}>
            <div className={s.title_text}>구독정보 변경</div>
            <div className={s.title_text_2}>{DATA.lastSurveyDate} 설문결과</div>
          </section>

          <section className={s.before_result}>
            <div className={s.before_result_content}>
              <div className={s.inner_content}>
                <div className={s.line_box}>
                  <div className={s.left_box}>플랜</div>
                  <div className={s.right_box}>{DATA.prev.plan}</div>
                </div>
                <div className={s.line_box}>
                  <div className={s.left_box}>레시피</div>
                  <div className={s.right_box}>
                    <p>{DATA.prev.recipeName}</p>
                  </div>
                </div>
                <div className={s.line_box}>
                  <div className={s.left_box}>급여량</div>
                  <div className={s.right_box}>
                    {transformLocalCurrency(DATA.prev.oneMealRecommendGram)}g
                  </div>
                </div>
                <div className={s.line_box}>
                  <div className={s.left_box}>다음 결제일</div>
                  <div className={s.right_box}>{transformDate(DATA.prev.nextPaymentDate)}</div>
                </div>
                <div className={s.line_box}>
                  <div className={s.left_box}>결제 예정 금액</div>
                  <div className={s.right_box}>
                    {transformLocalCurrency(DATA.prev.nextPaymentPrice)}원
                  </div>
                </div>
                <div className={s.line_box}>
                  <div className={s.left_box}>발송 예정일</div>
                  <div className={s.right_box}>{DATA.prev.nextDeliveryDate}</div>
                </div>
              </div>
            </div>
          </section>

          <section className={s.mid_image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require('public/img/survey/survey_down_arrow.png')}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </section>

          <section className={s.after_result}>
            <div className={s.after_result_content}>
              <div className={s.inner_content}>
                <div className={s.line_box}>
                  <div className={s.left_box}>플랜</div>
                  <div className={s.right_box}>{DATA.next.plan}</div>
                </div>
                <div className={s.line_box}>
                  <div className={s.left_box}>레시피</div>
                  <div className={s.right_box}>
                    <p>{DATA.next.recipeName}</p>
                  </div>
                </div>
                <div className={s.line_box}>
                  <div className={s.left_box}>급여량</div>
                  <div className={s.right_box}>
                    {transformLocalCurrency(DATA.next.oneMealRecommendGram)}g
                  </div>
                </div>
                <div className={s.line_box}>
                  <div className={s.left_box}>다음 결제일</div>
                  <div className={s.right_box}>{transformDate(DATA.next.nextPaymentDate)}</div>
                </div>
                <div className={s.line_box}>
                  <div className={s.left_box}>결제 예정 금액</div>
                  <div className={s.right_box}>
                    {transformLocalCurrency(DATA.next.nextPaymentPrice)}원
                  </div>
                </div>
                <div className={s.line_box}>
                  <div className={s.left_box}>발송 예정일</div>
                  <div className={s.right_box}>{DATA.next.nextDeliveryDate}</div>
                </div>
              </div>
            </div>
          </section>

          <section className={s.btn_section}>
            <div className={s.box_btn}>
              <button type={'button'} className={s.top_btn}>구독정보 변경</button>
              <button type={'button'} className={s.bot_btn} onClick={onPrevPage}>취소</button>
            </div>
          </section>
        </Wrapper>
      </Layout>
      <Modal_global_alert message={modalMessage} onClick={submitted ? onSuccessChangeSubscribeOrder : onHideModal} background />
    </>
  );
}

const DUMMY_surveyReportResult_RESPONSE ={
  data:{
    "dogId" : 164,
    "dogName" : "김바프",
    "subscribeId" : 160,
    "subscribeStatus" : "SUBSCRIBING",
    "recommendRecipeId" : 13,
    "recommendRecipeName" : "스타트",
    "recommendRecipeDescription" : "레시피 설명",
    "recommendRecipeImgUrl" : "http://localhost:8080/display/recipes?filename=스타트1.jpg",
    "uiNameKorean" : "레시피 한글",
    "uiNameEnglish" : "RECIPE ENGLISH",
    "foodAnalysis" : {
      "oneDayRecommendKcal" : 163.3593,
      "oneDayRecommendGram" : 202,
      "oneMealRecommendGram" : 101
    },
    "recipeDtoList" : [ {
      "id" : 13,
      "name" : "스타트",
      "description" : "레시피 설명",
      "pricePerGram" : 48.234,
      "gramPerKcal" : 1.23456,
      "inStock" : true,
      "imgUrl" : "http://localhost:8080/display/recipes?filename=스타트2.jpg"
    }, {
      "id" : 14,
      "name" : "터키비프",
      "description" : "레시피 설명",
      "pricePerGram" : 48.234,
      "gramPerKcal" : 1.23456,
      "inStock" : true,
      "imgUrl" : "http://localhost:8080/display/recipes?filename=터키비프2.jpg"
    }, {
      "id" : 15,
      "name" : "덕램",
      "description" : "레시피 설명",
      "pricePerGram" : 48.234,
      "gramPerKcal" : 1.23456,
      "inStock" : true,
      "imgUrl" : "http://localhost:8080/display/recipes?filename=덕램2.jpg"
    }, {
      "id" : 16,
      "name" : "램비프",
      "description" : "레시피 설명",
      "pricePerGram" : 48.234,
      "gramPerKcal" : 1.23456,
      "inStock" : true,
      "imgUrl" : "http://localhost:8080/display/recipes?filename=램비프2.jpg"
    } ],
    "plan" : "FULL",
    "recipeName" : "스타트,터키비프",
    "oneMealRecommendGram" : 101,
    "nextPaymentDate" : "2022-07-28T10:44:01.179",
    "nextPaymentPrice" : 120000,
    "nextDeliveryDate" : "2022-07-30",
    "_links" : {
      "self" : {
        "href" : "http://localhost:8080/api/dogs/164/surveyReportResult"
      },
      "query-orderSheet-subscribe" : {
        "href" : "http://localhost:8080/api/orders/sheet/subscribe/160"
      },
      "update_subscribe" : {
        "href" : "http://localhost:8080/api/subscribes/160"
      },
      "profile" : {
        "href" : "/docs/index.html#resources-query-dog-surveyReportResult"
      }
    }
  }
  
}

export async function getServerSideProps({ req, query }) {
  const { dogId } = query;

  let data = null;
  const getSurveyReportApiUrl = `/api/dogs/${dogId}/surveyReport`;
  const surveyResportInfoRes = await getDataSSR(req, getSurveyReportApiUrl);
  const getSurveyReportsResultApiUrl = `/api/dogs/${dogId}/surveyReportResult`;
  const surveyReportResultInfoRes = DUMMY_surveyReportResult_RESPONSE ||  await getDataSSR(req, getSurveyReportsResultApiUrl);

  data = {
    surveyReportInfo: surveyResportInfoRes.data,
    surveyRerportResultInfo: surveyReportResultInfoRes.data,
  };
  
  if(!data){
    return {
      redirect: {
        permanent: false,
        destination: "/account/login",
      },
      props:{},
    }
  }

  return { props: { data } };
}
