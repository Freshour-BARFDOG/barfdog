import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { ToggleBox } from '/src/components/atoms/ToggleBox';
import { SubscribDashboard } from '/src/components/subscribe/SubscribDashboard';
import { SubscribeGram } from '/src/components/subscribe/SubscribeGram';
import { SubscribeSkipPayment } from '/src/components/subscribe/SubscribeSkipPayment';
import { SubscribeCancle } from '/src/components/subscribe/SubscribeCancle';
import { SubscribePlan } from '/src/components/subscribe/SubscribePlan';
import { SubscribeRecipe } from '/src/components/subscribe/SubscribeRecipe';
import {getDataSSR} from "../../api/reqData";

export default function SubscribeInfoPage({}) {
  
  const boxStyle ={boxShadow:'0 5px 1.25rem rgb(0 0 0 / 3%)'}
  return (
    <>
      <MetaTitle title="마이페이지 구독관리" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <SubscribDashboard />
            
            <ToggleBox title="구독 그램(g) 변경" style={boxStyle}>
              <SubscribeGram />
            </ToggleBox>

            <ToggleBox title="구독 플랜 변경" style={boxStyle}>
              <SubscribePlan />
            </ToggleBox>

            <ToggleBox title="구독 레시피  변경" style={boxStyle}>
              <SubscribeRecipe />
            </ToggleBox>

            <ToggleBox title="구독 건너뛰기" style={boxStyle}>
              <SubscribeSkipPayment />
            </ToggleBox>

            <ToggleBox title="구독 취소" style={boxStyle}>
              <SubscribeCancle />
            </ToggleBox>
            
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}




//
// export async function getServerSideProps({ req, query }) {
//
//   // Query CASE
//   // surveyReportsId : 결제 전
//   // dogId: 구독 중 || 구독 보류
//   const { surveyReportsId, dogId } = query;
//
//
//   let data = null;
//
//   // DATA: this Dog's Result of survey Report
//   const getSurveyReportResultApiUrl = `/api/surveyReports/${surveyReportsId}/result`;
//   const surveyInfoRes = await getDataSSR(req, getSurveyReportResultApiUrl);
//   const thisDogId = dogId || surveyInfoRes.data.dogId;
//
//   // DATA: this Dog
//   const getDogInfoApiUrl = `/api/dogs/${thisDogId}`;
//   const dogInfoRes = await getDataSSR(req, getDogInfoApiUrl);
//   // DATA: Recipes
//   const getRecipeInfoApiUrl = `/api/recipes`;
//   const recipeInfoRes = await getDataSSR(req, getRecipeInfoApiUrl);
//   const recipeIdList = recipeInfoRes?.data?._embedded?.recipeListResponseDtoList?.map((l) => l.id) || [];
//   const recipeInfoList = [];
//   for (const recipeId of recipeIdList) {
//     const apiUrl = `/api/recipes/${recipeId}`;
//     const res = await getDataSSR(req, apiUrl);
//     // console.log(res)
//     recipeInfoList.push(res.data);
//   }
//
//   data = {
//     dogDto: dogInfoRes?.data.dogDto || null,
//     surveyInfo: surveyInfoRes?.data || null,
//     recipesDetailInfo: recipeInfoList,
//   };
//
//   /// ! TESTTESTTESTTESTTESTTESTTESTTESTTESTTEST
//   if(data.surveyInfo){
//     // CASE : 플랜 변경 (4주 => 2주)
//     // data.surveyInfo.plan= subscribePlanType.FULL.NAME';
//     // data.surveyInfo.recipeName= '스타터프리미엄, 터키&비프';
//     // data.surveyInfo.nextPaymentDate= '2022-08-10T10:44:01.179';
//     // data.surveyInfo.nextPaymentPrice= 120000;
//     // data.surveyInfo.nextDeliveryDate= '2022-08-24';
//     // CASE : 플랜 변경 (2주 => 4주)
//     data.surveyInfo.plan= subscribePlanType.HALF.NAME;
//     data.surveyInfo.recipeName= '터키&비프';
//     data.surveyInfo.nextPaymentDate= '2022-08-10T10:44:01.179';
//     data.surveyInfo.nextPaymentPrice= 112000;
//     data.surveyInfo.nextDeliveryDate= '2022-08-24';
//   }
//
//   /// ! TESTTESTTESTTESTTESTTESTTESTTESTTESTTEST
//
//   return { props: { data } };
// }
