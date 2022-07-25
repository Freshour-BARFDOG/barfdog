import React, {useState} from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import { useRouter } from "next/router";
import s from '/src/components/survey/surveyStatistics(mypageVersion).module.scss';
import Link from "next/link";
import Image from 'next/image';
import {SurveyStatistics} from "../../../../components/survey/SurveyStatistics";





function MypageSubscribe_statisticPage() {
  const isThisDogSubscribedState = false;
  const hasSurveyDataChangedEnoughtToRecommend = true;
  const router = useRouter();
  if (!router.isReady) return;
  const { dogIdx } = router.query;
  const onPrevPage = () => {
    router.back();
  }




  return (
    <>
      <MetaTitle title={`설문결과: ${dogIdx}`} />
      <Layout>
        <Wrapper>
          <MypageWrapper>
  
            {/* ------------------ 추가한 Component ------------------ */}
            {/*
            1개의 component(Statistic.jsx)만 사용하여
            data Fetching 코드를 2번 작성하는 작업을 줄이기 위해서
            해당 작업을 요청드립니다.
            - < 작업 경로 >
            - http://localhost:4000/mypage/dogs/12334/statistic
            - http://localhost:4000/survey/statistics
            - < CSS파일 >
            - 이전 작업파일: src/components/survey/surveyStatistics(mypageVersion).module.scss
            - 최종으로 남길 파일: src/components/survey/surveyStatistics.module.scss
            */}
            <SurveyStatistics mode={'mypage'}/>
            {/* ------------------ 추가한 Component ------------------ */}
            
            
            
            
            {/* ------------------ 기존 코드 ------------------ */}

            {/* 기존코드 삭제 */}


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

export default MypageSubscribe_statisticPage;