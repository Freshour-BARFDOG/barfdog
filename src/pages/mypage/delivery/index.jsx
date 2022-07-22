import React, { useState } from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from "./delivery.module.scss";
import Image from "next/image";
import TabContentContainer, {
  LeftContainer,
  RightContainer,
} from "/src/components/atoms/TabContentContainer";
import Tabmenu_TwoButton from "/src/components/atoms/Tabmenu_TwoButton";




const TEST_ContTobeInserted = () => {
  return (
    <>
      <section className={Styles.content_body}>
        <div className={Styles.grid_box}>
          <div className={Styles.col_1}>
            <p>2022.02.14</p>
            <div></div>
            <div>믹스 레시피 (8회차) · 시호</div>
            <div className={Styles.text}>
              <div>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/pages/delivery/delivery_icon_1.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                주문정보
              </div>
            </div>
          </div>

            <div className={Styles.col_2}>
              <p>조리예정일</p>
              <div>3월 12일</div>
            </div>

            <div className={Styles.col_3}>
              <p>발송예정일</p>
              <div>3월 16일</div>
            </div>

            <div className={Styles.col_4}>배송예정</div>

            <div className={Styles.col_5}>
              <div className={Styles.btn}>배송조회</div>
            </div>

        </div>

        <div className={Styles.grid_box}>
          <div className={Styles.col_1}>
            <p>2022.02.14</p>
            <div></div>
            <div>믹스 레시피 (8회차) · 시호</div>
            <div className={Styles.text}>
              <div>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/pages/delivery/delivery_icon_1.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                주문정보
              </div>
            </div>
          </div>

            <div className={Styles.col_2}>
              <p>조리예정일</p>
              <div>3월 12일</div>
            </div>

            <div className={Styles.col_3}>
              <p>발송예정일</p>
              <div>3월 16일</div>
            </div>

            <div className={Styles.col_4}>배송예정</div>

            <div className={Styles.col_5}>
              <div className={Styles.btn}>배송조회</div>
            </div>

        </div>
        
        <div className={Styles.grid_box}>
          <div className={Styles.col_1}>
            <p>2022.02.14</p>
            <div></div>
            <div>비건 레시피</div>
            <div className={Styles.text}>
              <div>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/pages/delivery/delivery_icon_1.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                주문정보
              </div>
            </div>
          </div>

            <div className={Styles.col_2}>
              <p>조리예정일</p>
              <div>3월 12일</div>
            </div>

            <div className={Styles.col_3}>
              <p>발송예정일</p>
              <div>3월 16일</div>
            </div>

            <div className={Styles.col_4}>배송예정</div>

            <div className={Styles.col_5}>
              <div className={Styles.btn}>배송조회</div>
            </div>

        </div>

        <div className={Styles.grid_box}>
          <div className={Styles.col_1}>
            <p>2022.02.14</p>
            <div></div>
            <div>비건 레시피</div>
            <div className={Styles.text}>
              <div>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/pages/delivery/delivery_icon_1.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                주문정보
              </div>
            </div>
          </div>

            <div className={Styles.col_2}>
              <p>조리예정일</p>
              <div>3월 12일</div>
            </div>

            <div className={Styles.col_3}>
              <p>발송예정일</p>
              <div>3월 16일</div>
            </div>

            <div className={Styles.col_4}>배송예정</div>

            <div className={Styles.col_5}>
              <div className={Styles.btn}>배송조회</div>
            </div>

        </div>
      </section>
    </>
  );
};








function MypageDeliverPage() {
  const [activeMenu, setActiveMenu] = useState("left");

  return (
    <>
      <MetaTitle title="마이페이지 배송현황" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={Styles.title}>배송현황</section>
            <Tabmenu_TwoButton
              leftMenuName={"정기구독"}
              rightMenuName={"일반상품"}
              getPositionHandler={setActiveMenu}
            />
            <TabContentContainer>
              <LeftContainer activeMenu={activeMenu}>
                <TEST_ContTobeInserted />

              </LeftContainer>
              <RightContainer activeMenu={activeMenu}>
                <TEST_ContTobeInserted />

              </RightContainer>
            </TabContentContainer>

          
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default MypageDeliverPage;
