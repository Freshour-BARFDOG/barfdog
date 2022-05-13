import React from 'react';
import s from '/styles/css/Header.module.scss';
import { useModalContext } from "@store/modal-context";

import MenuLayout, { SubmenuList } from "/src/components/header/MenuLayout";
import Link from 'next/link';
import DeadlineTimer from '/src/components/atoms/DeadlineTimer';

import Icon_mypage from '/public/img/icon/mypage.svg';
import Icon_cart from '/public/img/icon/cart.svg';
import SVG_subscribe from '/public/img/icon/subscribe.svg';



export const Gnb_my = () => {

  const List = ( {id, href, children} ) => {
    return (
      <li>
        <Link href={href} passHref><a id={id}>{children}</a></Link>
      </li>
    )
  };

  const Cart_counter = ({className}) => {
    const user_shop_count = 10;

    return (
      <>
      <span className={className}>{user_shop_count}</span>
      </>
    )
  }

  return (
    <div className={s.gnb_my}>
      <ul className='clearfix'>
        <List id="gnb_cart" href="/cart">
          <div className={s.shop_wrap}>
            <Icon_cart />
            <Cart_counter id='gnb_shop_count' className={s.gnb_shop_count}/>
            <DeadlineTimer />
          </div>
        </List>
        <List href="/mypage/order-history"><Icon_mypage /></List>
      </ul>
    </div>
  )
}




const Gnb_survey = () => {
  const mct = useModalContext();
  const onClickHandler = () => {
    mct.subscribe.onShow();
  };
  return (
    <li className={s.subscribe} onClick={onClickHandler}>
      <span>
        <SVG_subscribe />
      </span>
    </li>
  );
}




const Gnb = () => {
  return (
    <>
      <Gnb_survey />
      <MenuLayout title="샵">
        <SubmenuList title="ALL" link="/shop?category=all" />
        <SubmenuList title="생식" link="/shop?category=raw" />
        <SubmenuList title="토핑" link="/shop?category=topping" />
        <SubmenuList title="굿즈" link="/shop?category=goods" />
      </MenuLayout>
      <MenuLayout title="레시피" link="/recipes">
        {/* <SubmenuList title="스타터프리미엄" link="/recipes/starter" />
        <SubmenuList title="터키&amp;비프" link="/recipes/turkeyAndBeef" />
        <SubmenuList title="덕&amp;램" link="/recipes/duckAndLamb" />
        <SubmenuList title="램&amp;비프" link="/recipes/lambAndBeef" /> */}
      </MenuLayout>
      <MenuLayout title="커뮤니티">
        <SubmenuList title="공지사항" link="/community/notice" />
        <SubmenuList title="이벤트" link="/community/event" />
        <SubmenuList title="블로그" link="/community/blog" />
        <SubmenuList title="어바웃" link="/community/about" />
      </MenuLayout>
      <MenuLayout title="리뷰" link="/review" />
    </>
  );
}

export default Gnb;