import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from "styles/css/mypage/card/index.module.scss";
import Image from 'next/image';



const EmptyContent = () => {
  return (
    <section className={Styles.body}>
      <div className={Styles.inner_body}>구독중인 카드가 없습니다.</div>
    </section>
  );
  
}


function Mypage() {
  return (
    <>
      <MetaTitle title="마이페이지 카드관리"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>

            <section className={Styles.title}>
              카드관리
            </section>

            <section className={Styles.body}>
              <div className={Styles.table_box}>
                <div className={Styles.grid_title_box}>
                  <div className={Styles.col_1}>
                    카드명
                  </div>
                  <div >
                    구독중인 플랜
                  </div>
                  <div>
                    다음 결제일
                  </div>
                  <div>
                    다음 결제 금액
                  </div>
                  <div>

                  </div>
                  
                </div>

                <section className={Styles.line_box}>
                  <hr className={Styles.line} />
                </section>


                <div className={Styles.grid_body_box}>
                  <div className={Styles.col_1}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/pages/card/card_card.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                    삼성 8038
                  </div>

                  <div className={Styles.col_2}>
                    (시호)풀 플랜 믹스레시피 외 3건
                  </div>

                  <div>
                    2022.03.04
                  </div>

                  <div>
                    282,000원
                  </div>
                  
                  <div className={Styles.btn_box}>
                    <div className={Styles.btn}>
                      카드변경
                    </div>
                  </div>
                </div>

                <div className={Styles.grid_body_box}>
                  <div className={Styles.col_1}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/pages/card/card_card.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                    신한 4024
                  </div>

                  <div className={Styles.col_2}>
                    (바둑이)토핑 플랜 스타터프리미엄 외 1건
                  </div>

                  <div>
                    2022.03.04
                  </div>

                  <div>
                    282,000원
                  </div>
                  
                  <div className={Styles.btn_box}>
                    <div className={Styles.btn}>
                      카드변경
                    </div>
                  </div>
                </div>

                <div className={Styles.grid_body_box}>
                  <div className={Styles.col_1}>
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/pages/card/card_card.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                    삼성 6079
                  </div>

                  <div className={Styles.col_2}>
                    (쵸파)풀 플랜 믹스레시피
                  </div>

                  <div>
                    2022.03.04
                  </div>

                  <div>
                    282,000원
                  </div>
                  
                  <div className={Styles.btn_box}>
                    <div className={Styles.btn}>
                      카드변경
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={Styles.second_body}>
              <hr />
              <div className={Styles.text}>
                정기구독 결제 카드가 여기에 표시됩니다.
              </div>
            </section>



            <div className={Styles.modal}>
              <div className={Styles.grid_box}>
                <div>시호123123123123123</div>
                <div>풀 플랜 믹스레시피</div>
                <div>세바스티...12312312312</div>
                <div>하프 플랜 덕앤램</div>
                <div>초롱이</div>
                <div>토핑 플랜 스타터프리미엄</div>
                <div>몽실이</div>
                <div>풀 플랜 믹스레시피</div>
              </div>
            </div>
            
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default Mypage;