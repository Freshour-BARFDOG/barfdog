import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from "styles/css/mypage/review/index.module.scss";
import Image from 'next/image';

function ReviewPage() {
  return (
    <>
      <MetaTitle title="마이페이지 후기" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            
          <section className={Styles.title}>
              상품후기
          </section>

          <section className={Styles.content_title}>
            <div className={Styles.flex_box}>
              <div className={Styles.left_box}>
                <div>
                  후기작성
                </div>
                
              </div>
              <div className={Styles.right_box}>
                작성한 후기
              </div>
            </div>
          </section>

          <section className={Styles.content}>
            <p>
              작성 가능한 후기가 없습니다
            </p>
          </section>
            
          </MypageWrapper>
        </Wrapper>


        <Wrapper>
          <MypageWrapper>
            
            <section className={Styles.title}>
                상품후기
            </section>

            <section className={Styles.content_title2}>
              <div className={Styles.flex_box}>
                <div className={Styles.left_box}>
                  <div>
                    후기작성
                  </div>                
                </div>

                <div className={Styles.right_box}>
                  작성한 후기
                </div>

              </div>
            </section>

            <section className={Styles.content}>
              <div className={Styles.flex}>
                <div className={Styles.left}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/mypage/review_pic_1.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                  <div className={Styles.title_text}>
                    <p>믹스 레시피</p>
                    <div className={Styles.mid_text}>정기구독 &middot; 3회차</div>
                    <div className={Styles.day_text}>2022.02.15</div>
                  </div>
                </div>

                <div className={Styles.right}>
                  <div className={Styles.btn}>후기 작성하기</div>
                </div>
              </div>
            </section>


            <section className={Styles.content}>
              <div className={Styles.flex}>
                <div className={Styles.left}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/mypage/review_pic_1.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                  <div className={Styles.title_text}>
                    <p>믹스 레시피</p>
                    <div className={Styles.mid_text}>정기구독 &middot; 3회차</div>
                    <div className={Styles.day_text}>2022.02.15</div>
                  </div>
                </div>

                <div className={Styles.right}>
                  <div className={Styles.btn}>후기 작성하기</div>
                </div>
              </div>
            </section>

            <section className={Styles.content}>
              <div className={Styles.flex}>
                <div className={Styles.left}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/mypage/review_pic_1.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                  <div className={Styles.title_text}>
                    <p>믹스 레시피</p>
                    <div className={Styles.mid_text}>정기구독 &middot; 3회차</div>
                    <div className={Styles.day_text}>2022.02.15</div>
                  </div>
                </div>

                <div className={Styles.right}>
                  <div className={Styles.btn}>후기 작성하기</div>
                </div>
              </div>
            </section>

            <div className={Styles.pagination_box}>
              <div className={Styles.content}>
                <div> &#60;</div>
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>...</div>
                <div>11</div>
                <div> &#62;</div>
              </div>
            </div>
            
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default ReviewPage;