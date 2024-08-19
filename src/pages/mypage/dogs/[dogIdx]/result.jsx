import React from 'react';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { useRouter } from 'next/router';
import s from '/src/components/survey/surveyStatistics(mypageVersion).module.scss';
import Link from 'next/link';
import { getDataSSR } from '/src/pages/api/reqData';
import LayoutWithoutFooter from '../../../../components/common/LayoutWithoutFooter';
import { SurveyResult } from '../../../../components/survey/result/SurveyResult';

export default function MypageSubscribe_resultPage({ data }) {
  // console.log(data);
  const router = useRouter();

  return (
    <>
      {/* <MetaTitle title={`마이페이지 ${data.name}의${"\u00a0"}설문결과`} /> */}
      <MetaTitle title={`마이페이지 맞춤레시피`} />
      <LayoutWithoutFooter>
        <MypageWrapper>
          <SurveyResult id={data.dogId} mode={'mypage'} />
        </MypageWrapper>
      </LayoutWithoutFooter>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { dogIdx } = query;
  const getApiUrl = '/api/dogs';
  const res = await getDataSSR(req, getApiUrl);
  let DATA = {
    dogId: dogIdx,
  };
  const embeddedData = res?.data._embedded;
  if (embeddedData) {
    const dataList = embeddedData?.queryDogsDtoList || [];
    if (!dataList.length) return;
    const thisDogDATA = dataList.filter(
      (list) => list.id === Number(dogIdx),
    )[0];
    DATA = {
      ...DATA,
      name: thisDogDATA.name, // 반려견 이름
      subscribeStatus: thisDogDATA.subscribeStatus, // 구독상태
    };
  }

  return { props: { data: DATA } };
}
