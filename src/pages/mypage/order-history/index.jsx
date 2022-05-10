import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from "styles/css/mypage/order-history/index.module.scss";

function OrderHistoryPage() {
  return (
    <>
      <MetaTitle title="마이페이지 주문내역"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={Styles.title}>
              주문내역
            </section>

            <section className={Styles.content_title}>
              <div className={Styles.flex_box}>
                <div className={Styles.left_box}>
                  <div>
                    정기구독
                  </div>
                  
                </div>
                <div className={Styles.right_box}>
                  일반주문
                </div>
              </div>
            </section>

            <section className={Styles.content}>
              <p>
                구독중인 상품이 없습니다.
              </p>

              <div className={Styles.btn_box}>
                <div className={Styles.btn}>
                  정기구독 시작하기
                </div>
              </div>
            </section>

            


          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default OrderHistoryPage;