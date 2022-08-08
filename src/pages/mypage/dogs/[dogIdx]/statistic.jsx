import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { useRouter } from 'next/router';
import s from '/src/components/survey/surveyStatistics(mypageVersion).module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { SurveyStatistics } from '/src/components/survey/SurveyStatistics';
import { getDataSSR } from '../../../api/reqData';
import {subscribeStatus} from "../../../../../store";


export default function MypageSubscribe_statisticPage({ data }) {
  // console.log(data);
  const router = useRouter();
  const onPrevPage = () => {
    router.push('/mypage/dogs');
  };

  return (
    <>
      {/* <MetaTitle title={`마이페이지 ${data.name}의${"\u00a0"}설문결과`} /> */}
      <MetaTitle title={`마이페이지 설문결과`} />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <SurveyStatistics id={data.dogId} mode={'mypage'} />
            <section className={s.last_text}>
              <p className={s['ref-message']}>
                ※ 해당 결과지는 바프독 고객을 대상으로한 참고용 결과이니, <br />
                자세한 반려견의 건강상태는 수의사와 상담해 주세요.
              </p>
              {true && (
                <p className={s['notice-message']}>
                  *반려견 정보가 수정되어 권장 식사량이 변경되었습니다.
                  <br />
                  변경된 정보로 플랜을 재설정 하시겠습니까?
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  ( -  TEST > 반려견 정보 수정 이후, 권장식사량 변동에 대한 데이터를 불러올 수 있을 경우 , 적용가능한 기능)
                  <br/>
                  ( - 현재는 비구독 상태일 경우에 나타남 )
                </p>
              )}
            </section>
            <section className={s.btn_box}>
              {data.subscribeStatus === subscribeStatus.BEFORE_PAYMENT && (
                <Link href={`/order/subscribeShop?dogId=${data.dogId}`} passHref>
                  <a>맞춤 플랜 확인하기</a>
                </Link>
              )}
              <button className={s.link} onClick={onPrevPage}>
                목록으로 돌아가기
              </button>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
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
    const thisDogDATA = dataList.filter((list) => list.id === Number(dogIdx))[0];
    DATA = {
      ...DATA,
      name: thisDogDATA.name, // 반려견 이름
      subscribeStatus: thisDogDATA.subscribeStatus, // 구독상태
    };
  }

  return { props: { data: DATA } };
}
