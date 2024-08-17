import React, { useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import LayoutWithoutFooter from '../../../components/common/LayoutWithoutFooter';
import { SurveyResult } from '../../../components/survey/result/SurveyResult';

export default function SurveyStatisticsPage({ id }) {
  // 설문조사 조회시, 강아지 ID가 아닌  설문조사의 ID로 조회한다.

  return (
    <>
      <MetaTitle title="맞춤레시피" />
      <LayoutWithoutFooter>
        <SurveyResult id={id} mode={'default'} />
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
