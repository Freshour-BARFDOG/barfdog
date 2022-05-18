import React, { useState } from "react";
import Styles from "styles/css/mypage/order-history/index.module.scss";
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import TabContentContainer, {
  LeftContainer,  RightContainer} from "/src/components/atoms/TabContentContainer";
import Tabmenu_TwoButton from '/src/components/atoms/Tabmenu_TwoButton';




function OrderHistoryPage() {
  const [activeMenu, setActiveMenu] = useState('left');

  return (
    <>
      <MetaTitle title="마이페이지 주문내역" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={Styles.title}>주문내역</section>
            <Tabmenu_TwoButton
              leftMenuName={"정기구독"}
              rightMenuName={"일반상품"}
              getPositionHandler={setActiveMenu}
            />
            <TabContentContainer>
              <LeftContainer activeMenu={activeMenu}>
                <section className={Styles.content}>
                  <div
                    className={`${Styles.content_left}}`}
                  >
                    <p>구독중인 정기구독 상품이 없습니다.</p>
                    <div className={Styles.btn_box}>
                      <button className={Styles.btn}>정기구독 시작하기</button>
                    </div>
                  </div>
                </section>
              </LeftContainer>
              <RightContainer activeMenu={activeMenu}>
                <section className={Styles.content}>
                  <div
                    className={`${Styles.content_right}}`}
                  >
                    <p>구독중인 일반 상품이 없습니다.</p>
                    <div className={Styles.btn_box}>
                      <div className={Styles.btn}>숍 시작하기</div>
                    </div>
                  </div>
                </section>
              </RightContainer>
            </TabContentContainer>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default OrderHistoryPage;