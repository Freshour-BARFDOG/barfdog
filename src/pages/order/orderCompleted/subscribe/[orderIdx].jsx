import React from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import s from 'src/pages/order/orderCompleted/index.module.scss';
import Image from 'next/image';

function OrderCompletedPage(props) {
  return (
    <>
      <MetaTitle title="정기구독 주문완료" />
      <Layout>
        <Wrapper>
          <section className={s.text_box}>
            <div className={s.row_1}>
              견주님,<br />
              바프독과 함께해 주셔서 감사합니다
            </div>
            <div className={s.row_2}>
              바프독은 주문 후 맞춤 생산되어 <span>가장 신선한 상태</span>로 전달됩니다.
            </div>
          </section>
          <section className={s.btn_box}>
            <div className={s.flex_box}>
              <Link href={'/'}>
                <button className={s.left_btn}>
                  홈으로
                </button>
              </Link>
              <Link href={`/mypage/orderHistory/subscribe/${props.orderIdx}`}>
                <button className={s.right_btn}>
                  주문내역 보기
                </button>
              </Link>
            </div>
          </section>

        </Wrapper>
      </Layout>
    </>
  );
}

export default OrderCompletedPage;

export async function getServerSideProps({ query }) {
  const { orderIdx } = query;
  
  return { props: { orderIdx } };
}