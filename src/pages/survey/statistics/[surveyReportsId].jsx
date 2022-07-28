import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { SurveyStatistics } from '/src/components/survey/SurveyStatistics';
import s from "/src/components/survey/surveyStatistics.module.scss";

export default function SurveyStatisticsPage({surveyReportsId}) {
  // 설문조사 조회시, 강아지 ID가 아닌  설문조사의 ID로 조회한다.
  return (
    <>
      <MetaTitle title="설문조사 통계" />
      <Layout>
        <Wrapper>
          <SurveyStatistics id={surveyReportsId} mode={'default'}/>
          <section className={s.last_text}>
            <div>
              ※ 해당 결과지는 바프독 고객을 대상으로한 참고용 결과이니, <br/>
            </div>
            <div>자세한 반려견의 건강상태는 수의사와 상담해 주세요.</div>
          </section>
  
          <section className={s.btn_box}>
            {/*<div className={s.btn}>맞춤 플랜 확인하기</div>*/}
              <a href={`/order/subscribeShop?surveyReportsId=${surveyReportsId}`} className={s.btn} >맞춤 플랜 확인하기</a>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}



// CF) _app.jsx SSR 적용 후 , getinitialProps에서 query가져올 수 없음
// SurveyStatisticsPage.getInitialProps = async ({ query }) => {
//   const { surveyReportsId } = query;
//   return { surveyReportsId };
// };



export async function getServerSideProps({ query }) {
  const { surveyReportsId } = query;
  
  return { props: { surveyReportsId } };
}
