import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from '/src/pages/healthcare/kit/kit.module.scss';
import Image from 'next/image';
import Soon from '/public/img/healthcare/soon.png';
import Report from '/public/img/healthcare/report.png';
import Needs from '/public/img/healthcare/NEEDS.png';
import Solutions from '/public/img/healthcare/SOLUTIONS.png';
import Client1 from '/public/img/healthcare/client1.png';
import Client2 from '/public/img/healthcare/client2.png';
import Client3 from '/public/img/healthcare/client3.png';
import Line from '/public/img/healthcare/kit-line.png';
import { Swiper_report } from '../../../components/home/Swiper_report';
import { Swiper_solution } from '../../../components/home/Swiper_solution';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function DiagnosticKitPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    handleResize(); // 처음 렌더링 시 크기에 따라 isMobile 설정
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);
  return (
    <>
      <MetaTitle title="진단기기" />
      <Layout>
        <Wrapper>
          <section className={s.kit_top}>
            <div className={s.kit_left}>
              <div className={s.kit_title}>
                <h1>
                  반려견 장내 미생물 <br />
                  진단 분석 서비스
                </h1>
                <div className={s.img_wrap}>
                  <Image src={Soon} alt="soon" />
                </div>
              </div>
              <div className={s.kit_text}>
                <div>
                  <span>간단한 배변 채취</span>로{' '}
                  <span>장내 환경 및 질병 유발 유해균 파악</span>이 가능합니다 !
                </div>
              </div>
            </div>
            <div className={s.kit_right}>
              <Image src={Report} alt="report" />
            </div>
          </section>
        </Wrapper>

        <Wrapper fullWidth={true}>
          <section className={s.kit_intro}>
            <Image src={Needs} alt="Needs" />
            <div className={s.needs_title}>
              이 서비스는 <span>어떤 보호자님들께 필요</span>할까요?
            </div>

            <div className={s.needs_content}>
              <div className={s.needs_container}>
                <div className={s.img_wrap}>
                  <Image src={Client1} className={s.client_img} alt="Client1" />
                </div>
                <div className={s.needs_text_box}>
                  <div className={s.needs_text_title}>
                    <p>1. </p>
                    <div className={s.text_content}>
                      반려견의{' '}
                      <span className={s.text_highlight}>아픈 원인</span>이
                      궁금한 보호자님
                    </div>
                  </div>
                  <div className={s.text_sub_content}>
                    <div>“ 반려견의 변 상태가 자주 좋지 않은데</div>
                    <div>원인을 잘 모르겠어요. ”</div>
                  </div>
                </div>
              </div>

              <div className={s.needs_container}>
                <div className={s.img_wrap}>
                  <Image src={Client2} alt="Client2" />
                </div>
                <div className={s.needs_text_box}>
                  <div className={s.needs_text_title}>
                    <p>2. </p>{' '}
                    <div className={s.text_content}>
                      <span className={s.text_highlight}>
                        건강하게 먹이고 있는지
                      </span>{' '}
                      궁금한 보호자님
                    </div>
                  </div>

                  <div className={s.text_sub_content}>
                    <span>“ 좋은 밥이라고 해서 먹이고 있는데</span>
                    <span> 이게 아이한테 잘 맞는지, </span>
                    <span>진짜로 건강하게 먹이고 있는지 궁금해요 ”</span>
                  </div>
                </div>
              </div>

              <div className={s.needs_container}>
                <div className={s.img_wrap}>
                  <Image src={Client3} alt="Client3" />
                </div>
                <div className={s.needs_text_box}>
                  <div className={s.needs_text_title}>
                    <p>3. </p>
                    <div className={s.text_content}>
                      반려견{' '}
                      <span className={s.text_highlight}>건강검진 비용</span>이
                      부담스러운 보호자님
                    </div>
                  </div>
                  <p className={s.text_sub_content}>
                    “ 마음 같아서는 매년 건강검진해주고 싶은데,
                    <br />
                    &nbsp;&nbsp;사실 금액적으로 부담스러워요 ”
                  </p>
                </div>
              </div>
            </div>

            <div className={s.line_wrap}>
              <Image src={Line} alt="line-kit" />
            </div>

            <Image src={Solutions} alt="Solutions" />
            <div className={s.needs_title}>
              진단 분석을 통해
              <span> 무엇을 알 수 있나요?</span>
            </div>

            {isMobile ? (
              <Swiper_solution />
            ) : (
              <div className={s.solution_content}>
                <div className={s.solution_text_box}>
                  <div className={s.solution_text_title}>
                    <span>01. </span>
                    <p>식이 솔루션 제공</p>
                  </div>
                  <p>
                    기존 급여하고 계신 식단과 장내 환경을 종합적으로 분석한
                    결과를 바탕으로 더 나은 식단 관리를 위한 전문적인 식이
                    솔루션을 제공합니다
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
            )}
          </section>
        </Wrapper>

        <Wrapper>
          <section className={s.kit_bottom}>
            <div className={s.bottom_title_container}>
              <div className={s.title}>
                사전 1차 체험단을 통한 만족도 조사 결과
              </div>
              <div className={s.title_sub}>
                <span>90% 이상</span> 2차 체험단 연장 희망 응답
              </div>
              <div className={s.title_result}>
                • 1차 체험단 200명 진행 완료
                <br />• 24년 2분기 2차 체험단 진행 예정(약 400명){' '}
              </div>
            </div>
          </section>
        </Wrapper>

        <Swiper_report />

        <Wrapper>
          <section className={s.kit_bottom}>
            <div className={s.bottom_content_container}>
              <div className={s.hash_tag_wrap}>
                <div className={s.hash_tag}>#꼼꼼한 분석</div>
                <div className={s.hash_tag}>#식이솔루션</div>
                <div className={s.hash_tag}>#질병예측</div>
                <div className={s.hash_tag}>#건강변화확인</div>
              </div>
              <div className={s.content_box}>
                상당히 <span>높은 고객 만족도</span>와<span>다수의 후기</span>
                로 인정받은 바프독 진단 기기 서비스 !
                <br />
                조만간 2차 체험단이 진행됩니다.{' '}
                <span className={s.red_text}> COMING SOON!</span>
              </div>
            </div>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}
