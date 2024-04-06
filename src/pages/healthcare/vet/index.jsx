import React from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from '/src/pages/healthcare/vet/vet.module.scss';
import Image from 'next/image';
import Soon from '/public/img/healthcare/soon.png';
import VetImg from '/public/img/healthcare/vet.jpg';

export default function AiVetPage() {
  return (
    <>
      <MetaTitle title="AI 수의사" />
      <Layout>
        <Wrapper>
          <section className={s.vet_top}>
            <div className={s.vet_left}>
              <div className={s.vet_title_wrap}>
                <div className={s.vet_title}>
                  <p>AI</p> 수의사
                </div>
                <div className={s.img_wrap}>
                  <Image src={Soon} alt="soon" />
                </div>
              </div>
              <div className={s.vet_text}>
                <div>
                  보다 더 고도화된
                  <span>AI 챗봇 서비스</span>로<span>로 반려견 건강 상담</span>
                  을 받아보세요!
                </div>
              </div>
            </div>
            <div className={s.vet_right}>
              <Image src={VetImg} alt="report" />
            </div>
          </section>
        </Wrapper>
        <Wrapper fullWidth={true}>
          <section className={s.vet_intro}>
            <div className={s.needs_title}>출시 알림 신청하기</div>
            <div className={s.bottom_title_container}>
              <div className={s.title}>
                집에서 간편하게 반려견 건강 상담을 받아보고 싶으신가요? 바프독
                AI 수의사 서비스가 출시될 때 가장 먼저 알려드릴게요.
              </div>
              <div className={s.title_sub}>
                <span>90% 이상</span> 2차 체험단 연장 희망 응답
              </div>
              <div className={s.title_result}>
                1차 체험단 200명 진행 완료 / 24년 2분기 2차 체험단 진행 예정(약
                400명){' '}
              </div>
            </div>

            <div className={s.needs_content}>
              <div className={s.needs_container}>
                <div className={s.needs_text_box}>
                  <div className={s.needs_text_title}>
                    <span>1. </span> 반려견의{' '}
                    <span className={s.text_highlight}>아픈 원인</span>이 궁금한
                    보호자님
                  </div>
                  <p>
                    “ 반려견의 변 상태가 자주 좋지 않은데 원인을 잘 모르겠어요.
                    ”
                  </p>
                </div>
              </div>
            </div>

            <div className={s.needs_title}>
              진단 분석을 통해
              <span> 무엇을 알 수 있나요?</span>
            </div>

            <div className={s.solution_content}>
              <div className={s.solution_text_box}>
                <div className={s.solution_text_title}>
                  <span>01. </span>
                  <p>식이 솔루션 제공</p>
                </div>
                <p>
                  기존 급여하고 계신 식단과 장내 환경을 종합적으로 분석한 결과를
                  바탕으로 더 나은 식단 관리를 위한 전문적인 식이 솔루션을
                  제공합니다
                </p>
              </div>

              <div className={s.solution_text_box}>
                <div className={s.solution_text_title}>
                  <span>02. </span>
                  <p>질병 유발균 확인</p>
                </div>
                <p>
                  피부질환, 장 질환(설사, 구토) 등 기타 질병을 유발할 수 있는
                  유해균 보유 상황을 제공합니다
                </p>
              </div>

              <div className={s.solution_text_box}>
                <div className={s.solution_text_title}>
                  <span>03. </span>
                  <p>유산균 종 검출 유무 확인</p>
                </div>
                <p>
                  현재 급여 중인 유산균이 아이에게 알맞은 제품인지 파악할 수
                  있는 유산균 종(19종) 검출 유무를 제공합니다
                </p>
              </div>

              <div className={s.solution_text_box}>
                <div className={s.solution_text_title}>
                  <span>04. </span>
                  <p>장내 환경 변화 확인</p>
                </div>
                <p>
                  검사를 할 때마다 분석 히스토리가 제공되어 주기적으로 반려견
                  장내 환경 변화를 쉽게 파악할 수 있도록 도와드립니다
                </p>
              </div>
            </div>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}
