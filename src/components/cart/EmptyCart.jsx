import s from './emptyCart.module.scss';
import Link from 'next/link';
import React from 'react';

export const EmptyCart = () => {
  return (
    <>
      <div className={s.empty_box}>
        <span>아직 장바구니에 담은 상품이 없습니다.</span>
        <div className={s.button_box}>
          <Link href="/shop?category=all" passHref>
            <a className={s.emty_button}>상품 담으러 가기</a>
          </Link>
        </div>
      </div>
    </>
  );
};