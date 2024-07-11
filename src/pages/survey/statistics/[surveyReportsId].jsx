import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { SurveyStatistics } from '/src/components/survey/result/SurveyStatistics';
// import s from '/src/components/survey/result/surveyStatistics.module.scss';
import SurveyLayout from '../../../components/common/SurveyLayout';
import { SurveyActiveStep } from '../../../components/survey/SurveyActiveStep';

export default function SurveyStatisticsPage({ surveyReportsId }) {
  // 설문조사 조회시, 강아지 ID가 아닌  설문조사의 ID로 조회한다.
  return (
    <>
      <MetaTitle title="설문조사 통계" />
      <Layout>
        <Wrapper>
          {/* [삭제 예정] 설문조사 레이아웃 */}
          {/* <SurveyLayout resultPage={'resultPage'} surveyReportsId={surveyReportsId}> */}
          {/* <Wrapper
          fullWidth={true}
          bgColor="#fffafa"
          minHeight="100vh"
          alignItems="flex-start"
        > */}
          <SurveyStatistics id={surveyReportsId} mode={'default'} />
          {/* <section className={s.last_text}>
            <div>
              ※ 해당 결과지는 바프독 고객을 대상으로한 참고용 결과이니, <br />
            </div>
            <div>자세한 반려견의 건강상태는 수의사와 상담해 주세요.</div>
          </section> */}
          {/* </SurveyLayout> */}
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
