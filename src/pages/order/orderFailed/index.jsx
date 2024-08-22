import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from './orderFailed.module.scss';
import React from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Link from 'next/link';
import LayoutWithoutFooter from '../../../components/common/LayoutWithoutFooter';

export default function OrderFailedPage(props) {
  return (
    <>
      <MetaTitle title="결제 실패" />
      <LayoutWithoutFooter>
        <Wrapper>
          <section className={s.text_box}>
            <div className={s.box}>
              <div className={s.box_text}>!</div>
            </div>
            <div className={s.row_1}>
              <span>상품 결제</span>가 정상적으로
              <br />
              완료되지 않았습니다.
            </div>
            <div className={s.row_2}>이용에 불편을 드려 죄송합니다.</div>
          </section>
          <section className={s.btn_box}>
            <div className={s.flex_box}>
              <Link href="/" passHref>
                <a>
                  <button className={s.left_btn}>홈으로</button>
                </a>
              </Link>
              <Link href={`/cart`} passHref>
                <a>
                  <button className={s.right_btn}>장바구니로 돌아가기</button>
                </a>
              </Link>
            </div>
          </section>
        </Wrapper>
      </LayoutWithoutFooter>
    </>
  );
}
