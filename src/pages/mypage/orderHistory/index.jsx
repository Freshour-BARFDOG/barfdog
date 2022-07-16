import React, { useState } from "react";
import Styles from "./orderHistory.module.scss";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import Pagination from "@src/components/atoms/Pagination";
import MetaTitle from "/src/components/atoms/MetaTitle";
import TabContentContainer, {
  LeftContainer,
  RightContainer,
} from "/src/components/atoms/TabContentContainer";
import Tabmenu_TwoButton from "/src/components/atoms/Tabmenu_TwoButton";
import Image from "next/image";
import Link from "next/link";


const Message_emptySubscribe = () => {
  return (
    <>
      <p>구독중인 정기구독 상품이 없습니다.</p>
      <div className={Styles.btn_box}>
        <Link href="/survey/guide" passHref>
          <a className={Styles.btn}>정기구독 시작하기</a>
        </Link>
      </div>
    </>
  );
};

const Message_emptySigleItem = () => {
  return (
    <>
      <p>구독중인 일반 상품이 없습니다.</p>
      <div className={Styles.btn_box}>
        <Link href="/shop?category=all" passHref>
          <a className={Styles.btn}>숍 시작하기</a>
        </Link>
      </div>
    </>
  );
};

const SubscribeItemList = () => {
  return (
    <div className={Styles["subscribeItem-container"]}>
      {/* Styles["subscribeItem-container" 는 여러개X Styles.day부터 개체 복사 */}
      <div className={Styles.day}>2022.02.14</div>

      <hr className={Styles.hr1} />

      <div className={Styles.content_body}>
        <div className={Styles.left_box}>
          <div className={`${Styles.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/mypage/order_history/subscribe_order_detail_1.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>

          <div className={Styles.flex_box}>
            <div className={Styles.text}>
              <p>시호</p>
              <div className={Styles.line_box}>
                <hr />
              </div>
              <div className={Styles.last_text}>믹스레시피 (8회차)</div>
            </div>

            <div className={Styles.text2}>
              <div>주문번호</div>
              <div>10000826742324</div>
              <div>결제금액</div>
              <div>84,000원</div>
            </div>
          </div>
        </div>

        <div className={Styles.mid_box}>배송중</div>

        <div className={Styles.right_box}>
          <Link href="/mypage/orderHistory/subscribe/1" passHref>
            <a className={Styles.btn}>주문상세 </a>
          </Link>
          <a className={Styles.btn2}>구독관리</a>
        </div>
      </div>
      <div className={Styles.day}>2022.02.14</div>

      <hr className={Styles.hr1} />

      <div className={Styles.content_body}>
        <div className={Styles.left_box}>
          <div className={`${Styles.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/mypage/order_history/subscribe_order_detail_1.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>

          <div className={Styles.flex_box}>
            <div className={Styles.text}>
              <p>시호</p>
              <div className={Styles.line_box}>
                <hr />
              </div>
              <div className={Styles.last_text}>믹스레시피 (8회차)</div>
            </div>

            <div className={Styles.text2}>
              <div>주문번호</div>
              <div>10000826742324</div>
              <div>결제금액</div>
              <div>84,000원</div>
            </div>
          </div>
        </div>

        <div className={Styles.mid_box}>배송중</div>

        <div className={Styles.right_box}>
          <Link href="/mypage/orderHistory/subscribe/1" passHref>
            <a className={Styles.btn}>주문상세 </a>
          </Link>
          <a className={Styles.btn2}>구독관리</a>
        </div>
      </div>
      <div className={Styles.day}>2022.02.14</div>

      <hr className={Styles.hr1} />

      <div className={Styles.content_body}>
        <div className={Styles.left_box}>
          <div className={`${Styles.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/mypage/order_history/subscribe_order_detail_1.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>

          <div className={Styles.flex_box}>
            <div className={Styles.text}>
              <p>시호</p>
              <div className={Styles.line_box}>
                <hr />
              </div>
              <div className={Styles.last_text}>믹스레시피 (8회차)</div>
            </div>

            <div className={Styles.text2}>
              <div>주문번호</div>
              <div>10000826742324</div>
              <div>결제금액</div>
              <div>84,000원</div>
            </div>
          </div>
        </div>

        <div className={Styles.mid_box}>배송중</div>

        <div className={Styles.right_box}>
          <Link href="/mypage/orderHistory/subscribe/1" passHref>
            <a className={Styles.btn}>주문상세 </a>
          </Link>
          <a className={Styles.btn2}>구독관리</a>
        </div>
      </div>

      <hr className={Styles.hr2} />

      <div className={Styles.pagination_box}>
        <Pagination itemCountPerGroup={5} itemTotalCount={100} />
      </div>

    </div>
  );
  
}


const SingleItemList = () => {
  return (
    <div className={Styles["subscribeItem-container"]}>
          <div className={Styles.day}>2022.02.14</div>

      <hr className={Styles.hr1} />

      <div className={Styles["item-container"]}>
        <div className={Styles.left_box}>
          <div className={`${Styles.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/mypage/order_history/subscribe_sample_1.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>

          <div className={Styles.flex_box}>
            <div className={Styles.text}>
              <div className={Styles.last_text}>바프레드 외 8건</div>
            </div>

            <div className={Styles.text2}>
              <div>주문번호</div>
              <div>10000826742324</div>
              <div>결제금액</div>
              <div>84,000원</div>
            </div>
          </div>
        </div>

        <div className={Styles.mid_box}>배송중</div>

        <div className={Styles.right_box}>
          <Link href="/mypage/orderHistory/single/1" passHref>
            <a className={Styles.btn}>주문상세</a>
          </Link>
        </div>
      </div>

      <hr className={Styles.hr2} />

      <div className={Styles.pagination_box}>
        <Pagination itemCountPerGroup={5} itemTotalCount={100} />
      </div>
    
    </div>
  );
};









function OrderHistoryPage() {
  const [activeMenu, setActiveMenu] = useState("left");

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
                  {true && <Message_emptySubscribe />}
                  {true && <SubscribeItemList />}
                </section>
              </LeftContainer>
              <RightContainer activeMenu={activeMenu}>
                <section className={Styles.content}>
                  {true && <Message_emptySigleItem />}
                  {true && <SingleItemList />}
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
