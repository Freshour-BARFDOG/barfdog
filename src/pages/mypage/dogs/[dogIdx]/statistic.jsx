import React, {useState} from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import { useRouter } from "next/router";
import s from '/src/components/survey/surveyStatistics(mypageVersion).module.scss';
import Link from "next/link";
import Image from 'next/image';
import {SurveyStatistics} from "/src/components/survey/SurveyStatistics";





export default function MypageSubscribe_statisticPage({dogId}) {
  
  const router = useRouter();
  const isThisDogSubscribedState = false;
  const hasSurveyDataChangedEnoughtToRecommend = true;
  
  const onPrevPage = () => {
    router.back();
  }

  return (
    <>
      <MetaTitle title={`마이페이지 설문결과: ${dogId}`} />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <SurveyStatistics id={dogId} mode={'mypage'}/>
            <section className={s.last_text}>
              <p className={s['ref-message']}>
                ※ 해당 결과지는 바프독 고객을 대상으로한 참고용 결과이니, <br/>
                자세한 반려견의 건강상태는 수의사와 상담해 주세요.
              </p>
              {hasSurveyDataChangedEnoughtToRecommend && (<p className={s['notice-message']}>
                *반려견 정보가 수정되어 권장 식사량이 변경되었습니다.<br/>
                변경된 정보로 플랜을 재설정 하시겠습니까?
              </p>)}
            </section>

            <section className={s.btn_box}>
              {isThisDogSubscribedState === false &&(<Link href={'/mypage/dogs/[id]/updateOrder'} passHref>
                <a>맞춤 플랜 확인하기</a>
              </Link>)}

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


export async function getServerSideProps ({ query}) {
  const { dogIdx } = query;
  
  return { props : {dogId: dogIdx}}
  
}