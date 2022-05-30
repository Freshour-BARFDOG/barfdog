import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import { useRouter } from "next/router";
import s from "src/pages/mypage/dogs/[dogIdx]/updateSurveyResult.module.scss";
import Image from "next/image";

function Mypage() {
    const router = useRouter();
    if(!router.isReady) return;
    const { dogIdx } = router.query;
    
  return (
    <>
      <MetaTitle title={`설문수정내역 확인: ${dogIdx}`} />
      <Layout>
        <Wrapper>

            <section className={s.title}>
              <div className={s.title_text}>
                구독정보 변경 
              </div>
              <div className={s.title_text_2}>
                2022-02-24 설문결과
              </div>
            </section>

            <section className={s.before_result}>
              <div className={s.before_result_content}>
                <div className={s.inner_content}>
                  <div className={s.line_box}>
                    <div className={s.left_box}>
                      플랜
                    </div>
                    <div className={s.right_box}>
                      풀플랜
                    </div>
                  </div>
                  <div className={s.line_box}>
                    <div className={s.left_box}>
                      레시피
                    </div>
                    <div className={s.right_box}>
                      스타터프리미엄<br />
                      덕 &amp; 램
                    </div>
                  </div>
                  <div className={s.line_box}>
                    <div className={s.left_box}>
                      급여량
                    </div>
                    <div className={s.right_box}>
                      272g
                    </div>
                  </div>
                  <div className={s.line_box}>
                    <div className={s.left_box}>
                      다음 결제일
                    </div>
                    <div className={s.right_box}>
                      2022/03/02
                    </div>
                  </div>
                  <div className={s.line_box}>
                    <div className={s.left_box}>
                      결제 예정 금액
                    </div>
                    <div className={s.right_box}>
                      94,000원
                    </div>
                  </div>
                  <div className={s.line_box}>
                    <div className={s.left_box}>
                      발송 예정일
                    </div>
                    <div className={s.right_box}>
                      2022/03/04
                    </div>
                  </div>
                  
                </div>
              </div>
            </section>

            <section className={s.mid_image_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/survey/survey_down_arrow.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </section>


            <section className={s.after_result}>
              <div className={s.after_result_content}>
                <div className={s.inner_content}>
                  <div className={s.line_box}>
                    <div className={s.left_box}>
                      플랜
                    </div>
                    <div className={s.right_box}>
                      풀플랜
                    </div>
                  </div>
                  <div className={s.line_box}>
                    <div className={s.left_box}>
                      레시피
                    </div>
                    <div className={s.right_box}>
                      스타터프리미엄<br />
                      덕 &amp; 램
                    </div>
                  </div>
                  <div className={s.line_box}>
                    <div className={s.left_box}>
                      급여량
                    </div>
                    <div className={s.right_box}>
                      280g
                    </div>
                  </div>
                  <div className={s.line_box}>
                    <div className={s.left_box}>
                      다음 결제일
                    </div>
                    <div className={s.right_box}>
                      2022/03/09
                    </div>
                  </div>
                  <div className={s.line_box}>
                    <div className={s.left_box}>
                      결제 예정 금액
                    </div>
                    <div className={s.right_box}>
                      108,000원
                    </div>
                  </div>
                  <div className={s.line_box}>
                    <div className={s.left_box}>
                      발송 예정일
                    </div>
                    <div className={s.right_box}>
                      2022/03/12
                    </div>
                  </div>
                  
                </div>
              </div>
            </section>

            <section className={s.btn_section}>
              <div className={s.box_btn}>
                <div className={s.top_btn}>
                  구독정보 변경
                </div>
                <div className={s.bot_btn}>
                  취소
                </div>
              </div>
            </section>


        </Wrapper>
      </Layout>
    </>
  );
}

export default Mypage;