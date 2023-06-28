import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import s from '../orderFailed.module.scss'
import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Link from 'next/link';
import {useRouter} from "next/router";

export default function OrderFailedPage (props) {
  const router = useRouter();
  const {subscribeId, dogId} = router.query;

    return (<>
      <MetaTitle title="결제 실패 (구독상품)" />
      <Layout>
        <Wrapper>
        <section className={s.text_box}>
            <div className={s.box}>
              <div className={s.box_text}>!</div>
            </div>
            <div className={s.row_1}>
              <span>비정상적인 결제</span>가 발생되었습니다.
              <br />
            </div>
            <div className={s.row_2}>
              주문서의 금액과 결제 금액이 일치하지 않습니다. <br/>
              결제된 주문은 관리자에 의해 즉시 [결제취소] 되었습니다.
            </div>
          </section>
          <section className={s.btn_box}>
            <div className={s.flex_box}>
              <Link href="/" passHref>
                <a>
                  <button className={s.left_btn}>홈으로</button>
                </a>
              </Link>
              {dogId && <Link href={`/order/subscribeShop?dogId=${dogId}`} passHref>
                <a>
                  <button className={s.right_btn}>주문서로 돌아가기</button>
                </a>
              </Link>}
            </div>
          </section>
        </Wrapper>
      </Layout>
    </>)
}
