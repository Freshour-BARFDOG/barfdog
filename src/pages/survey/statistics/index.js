import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { SurveyStatistics } from '/src/components/survey/result/SurveyStatistics';
import LayoutWithoutFooter from '../../../components/common/LayoutWithoutFooter';

export default function SurveyStatisticsPage({ id }) {
  // 설문조사 조회시, 강아지 ID가 아닌  설문조사의 ID로 조회한다.

  return (
    <>
      <MetaTitle title="설문조사 통계" />
      <LayoutWithoutFooter>
        <SurveyStatistics id={id} mode={'default'} />
      </LayoutWithoutFooter>
    </>
  );
}

// CF) _app.jsx SSR 적용 후 , getinitialProps에서 query가져올 수 없음
// SurveyStatisticsPage.getInitialProps = async ({ query }) => {
//   const { surveyReportsId } = query;
//   return { surveyReportsId };
// };

export async function getServerSideProps({ query }) {
  const { id } = query || null;

  return { props: { id } };
}
