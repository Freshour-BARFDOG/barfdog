import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from "styles/css/mypage/review/create.module.scss";
import Image from 'next/image';
import RatingStars from "/src/components/atoms/RatingStars";


function CreateReviewPage() {
  return (
    <>
      <MetaTitle title="마이페이지 후기 작성" />
      <Layout>
        <Wrapper>
          <MypageWrapper>

          <section className={Styles.title}>
            후기 작성
          </section>

          <section className={Styles.content_title}>
            <div className={Styles.title_flex_box}>
              <div className={Styles.left_box}>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/mypage/review_create.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>

              <div className={Styles.mid_box}>
                바프레드
                <p>정기구독 &middot; 3회차</p>
              </div>

              <div className={Styles.right_box}>
                <p>
                  2022.02.15 주문
                </p>
              </div>
            </div>
          </section>

          <section className={Styles.how_was}>

            <div className={Styles.text}>
              상품은 어떠셨나요?
            </div>
            <div>
              <RatingStars count={4}  margin={12}  size={25}/>
            </div>
          </section>

          <seciton className={Styles.line}>
            <hr />
          </seciton>

          <section className={Styles.body}>
            <div className={Styles.flex}>
              <div className={Styles.left_side}>
                <div className={Styles.text2}>
                  상세리뷰
                </div>
              </div>
              <div className={Styles.right_side}>
                <div className={Styles.box}>
                  <div className={Styles.text_color_sub}>
                    <div className={Styles.dd}>
                      50자 이상 작성시 300원이 적립됩니다.<br />
                      상품에 대한 견주님의 의견을 남겨주시면 큰 힘이 됩니다.
                      <div className={Styles.right_bot}>
                        0/1000
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={Styles.picture_attach}>
            <div className={Styles.flex}>
              <div className={Styles.left_side}>

                <div className={Styles.text2}>
                  사진첨부
                </div>

                <div className={Styles.outer}>
                  <div className={Styles.red_text}>
                    500원 추가적립!
                  </div>
                </div>
              </div>

              <div className={Styles.right_side}> 
                <div className={Styles.square}>
                  <div className={Styles.cross}>
                  </div>
                </div>
                <div className={Styles.text_color_sub}>
                  20MB 이하. JPG, PNG, GIF 파일 10장 이내
                </div>
              </div>


            </div>
          </section>


          <seciton className={Styles.line2}>
            <hr />
          </seciton>

          <section className={Styles.btn}>
            <div className={Styles.flex}>
              <div className={Styles.left_btn}>
                취소
              </div>
              <div className={Styles.right_btn}>
                등록
              </div>
            </div>
          </section>

          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default CreateReviewPage;