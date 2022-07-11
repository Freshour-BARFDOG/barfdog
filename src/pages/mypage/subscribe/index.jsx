import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from "./subscribe.module.scss";
import Image from 'next/image';


function SubscribeIndexPage() {
  return (
    <>
      <MetaTitle title="마이페이지 구독관리"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>

            <section className={Styles.title}>
              구독관리
            </section>

            <section className={Styles.content}>
              <div className={Styles.flex_box}>

                <div className={Styles.col_1}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/mypage/subscribe/subscribe_index_sample_1.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>

                  <div className={Styles.text}>
                    {/* <div className={Styles.red_box_text}>1회 건너뛰기</div> */}
                    <p>풀플랜 믹스 레시피</p>
                    <div className={Styles.text2}>총 14팩 / 2주 정기결제</div>
                  </div>

                </div>

                <div className={Styles.grid}>
                  <div className={Styles.col_2}>
                    <div className={Styles.text2}>다음 결제일</div>
                    <div className={Styles.text3}>2022-03-14</div>
                  </div>

                  <div className={Styles.col_3}>
                    <div className={Styles.text2}>다음 결제금액</div>
                    <div className={Styles.text3}>280,000원</div>
                  </div>

                  <div className={Styles.col_4}>
                    <button className={Styles.btn}>
                      관리하기
                    </button>

                  </div>
                </div>

              </div>
         

            </section>
            
            

            <section className={Styles.content}>
              <div className={Styles.flex_box}>

                <div className={Styles.col_1}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/mypage/subscribe/subscribe_index_sample_2.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>

                  <div className={Styles.text}>
                    <div className={Styles.red_box_text}>1회 건너뛰기</div>
                    <p>풀플랜 믹스 레시피</p>
                    <div className={Styles.text2}>총 14팩 / 2주 정기결제</div>
                  </div>

                </div>

                <div className={Styles.grid}>
                  <div className={Styles.col_2}>
                    <div className={Styles.text2}>다음 결제일</div>
                    <div className={Styles.text3}>2022-03-14</div>
                  </div>

                  <div className={Styles.col_3}>
                    <div className={Styles.text2}>다음 결제금액</div>
                    <div className={Styles.text3}>280,000원</div>
                  </div>

                  <div className={Styles.col_4}>
                    <button className={Styles.btn}>
                      관리하기
                    </button>
                  </div>
                </div>

              </div>

            </section>

            <section className={Styles.content}>
              <div className={Styles.flex_box}>

                <div className={Styles.col_1}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/mypage/subscribe/subscribe_index_sample_3.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>

                  <div className={Styles.text}>
                    {/* <div className={Styles.red_box_text}>1회 건너뛰기</div> */}
                    <p>풀플랜 믹스 레시피</p>
                    <div className={Styles.text2}>총 14팩 / 2주 정기결제</div>
                  </div>

                </div>

                
                <div className={Styles.grid}>
                  <div className={Styles.col_2}>
                    <div className={Styles.text2}>다음 결제일</div>
                    <div className={Styles.text3}>2022-03-14</div>
                  </div>

                  <div className={Styles.col_3}>
                    <div className={Styles.text2}>다음 결제금액</div>
                    <div className={Styles.text3}>280,000원</div>
                  </div>

                  <div className={Styles.col_4}>
                    <button className={Styles.btn}>
                      관리하기
                    </button>
                  </div>
                </div>

              </div>

            </section>
            
            

            



          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default SubscribeIndexPage;