import React from 'react';
import MenuLayout, { SubmenuList } from "/src/components/header/MenuLayout";
import s from '/styles/css/Header.module.scss';
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
        <List id="gnb_cart" href="/shop">
          <div className={s.shop_wrap}>
            <Icon_cart />
            <Cart_counter id='gnb_shop_count' className={s.gnb_shop_count}/>
            <DeadlineTimer />
          </div>
        </List>
        <List href="/mypage"><Icon_mypage /></List>
      </ul>
    </div>
  )
}

function Gnb_survey (){
  return (
    <li>
      <Link href="/survey" passHref>
        <a><SVG_subscribe/></a>
      </Link>
    </li>
  );
}

function Gnb() {
  return (
    <>
      <Gnb_survey />
      <MenuLayout title="샵">
        <SubmenuList title="ALL" link="/shop" />
        <SubmenuList title="생식" link="/shop/raw" />
        <SubmenuList title="토핑" link="/shop/topping" />
        <SubmenuList title="굿즈" link="/shop/goods" />
      </MenuLayout>
      <MenuLayout title="레시피">
        <SubmenuList title="스타터프리미엄" link="/recipe/starter" />
        <SubmenuList title="터키&amp;비프" link="/recipe/turkeyAndBeef" />
        <SubmenuList title="덕&amp;램" link="/recipe/duckAndLamb" />
        <SubmenuList title="램&amp;비프" link="/recipe/labmAndBeef" />
      </MenuLayout>
      <MenuLayout title="커뮤니티">
        <SubmenuList title="공지사항" link="/community/goods" />
        <SubmenuList title="이벤트" link="/community/event" />
        <SubmenuList title="블로그" link="/community/blog" />
        <SubmenuList title="어바웃" link="/community/about" />
      </MenuLayout>
      <MenuLayout title="리뷰" link="/review" />
    </>
  );
}

export default Gnb;