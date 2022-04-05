import React from 'react'
import s from '/styles/css/Header.module.scss';
import Link from 'next/link';
import Wrapper from "/src/components/common/Wrapper";
import DeadlineTimer from '../atoms/DeadlineTimer';
import Img from '/src/components/atoms/Img';
import Nav from './Nav';
import HeaderAccount from './HeaderAccount';
import Icon_mypage from '/public/img/icon/mypage.svg';
import Icon_cart from '/public/img/icon/cart.svg';



function Gnb_side () {


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
    <div className={s.gnb_side}>
      <ul>
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



function Header() {

  return (
    <header>
      <Wrapper>
        <div id="account" className="account_area">
          <ul>
            <li>
              <span className='user_class'>웰컴</span>
              <span className='user_name'>바프독님</span>
            </li>
            <li>
              <Link href="/account/signup" as="/signup">
                회원가입
              </Link>
            </li>
            <li>
              <Link href="/account/login">로그인</Link>
            </li>
            <HeaderAccount />
          </ul>
        </div>
        <div className="logo_area">
          <Img
            src="/img/logo.png"
            srcSet="/img/logo@2x.png"
            alt="사이트 로고"
          />
        </div>
        <div className="gnb_area">
          <nav id="gnb" className="site_gnb">
            <ul>
              <li>
                <Link href="/survey">
                  <a>
                    <Img src="/img/icon/subscribe.png" alt="정기구독"></Img>
                  </a>
                </Link>
              </li>
              <Nav />
            </ul>
          </nav>
        </div>
        <Gnb_side />
      </Wrapper>
    </header>
  );
}

export default Header