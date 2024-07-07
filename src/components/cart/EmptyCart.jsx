import s from './emptyCart.module.scss';
import Link from 'next/link';
import React from 'react';

export const EmptyCart = () => {
  return (
    <>
      <div className={s.empty_box}>
        <span>
          장바구니에는 스토어의 상품만 담을 수 있습니다. <br /> AI 추천 식단은
          별도 결제가 필요합니다.{' '}
        </span>
        {/* <span>아직 장바구니에 담은 상품이 없습니다.</span> */}
        <div className={s.button_box_shop}>
          <Link href="/shop?category=all" passHref>
            <a className={s.emty_button}>스토어 상품 담으러 가기</a>
          </Link>
        </div>
        <div className={s.button_box_ai}>
          <Link href="/shop?category=all" passHref>
            <a className={s.emty_button}>AI 식단 추천 받으러 가기</a>
          </Link>
        </div>
      </div>
    </>
  );
};
