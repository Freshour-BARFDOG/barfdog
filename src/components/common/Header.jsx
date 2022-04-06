import React, { useState } from 'react'
import s from '/styles/css/Header.module.scss';
import Link from 'next/link';
import Wrapper from "/src/components/common/Wrapper";
import DeadlineTimer from '../atoms/DeadlineTimer';
import IMG from '/src/components/atoms/IMG';
import Gnb from './Gnb';
import ServiceCenter from './ServiceCenter';
import Icon_mypage from '/public/img/icon/mypage.svg';
import Icon_cart from '/public/img/icon/cart.svg';
import User_class_box from '../atoms/User_class_box';



function Gnb_my () {

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





function Header(props) {

  // 여러개의 State을 관리해야할 때 , useState보다 더 효율적인 방법?
  const [userClass, setUserClass] = useState('웰컴');
  const [loginState, setLoginState] = useState(false);


  const HeaderTopMenu = ( {loginState} ) => {
    
    const Member = () => {
      return <>
        <li>
          <User_class_box user_class={userClass}/>
          <span className='user_name'>바프독님</span>
        </li>
      </>
    }

    const Non_Member = () => {
      return <>
        <li>
          <Link href="/account/signup" as="/signup">회원가입</Link>
        </li>
        <li>
          <Link href="/account/login">로그인</Link>
        </li>
      </>
    }

    const MenuList = loginState ? <Member /> : <Non_Member />;
    return (
      <>
        {MenuList}
        <ServiceCenter />
      </>
    )
  }
  
  function Gnb_inner_survey (){
    return (
      <>
        <li>
          <Link href="/survey" passHref>
              <IMG src="/img/icon/subscribe.svg" alt="정기구독" width="132" height="40"/>
          </Link>
        </li>
      </>
    )
  }




  return (
    <header id={s.site_header}>
      <Wrapper>
        <div className={s.inner}>
          <div id="account" className={`${s.account_area} clearfix`}>
            <ul className='clearfix'>
              <HeaderTopMenu loginState={loginState}/>
            </ul>
          </div>{/* account */}
          <div className={s.logo_area}>
            <IMG
              src="/img/logo.png"
              srcSet="/img/logo@2x.png"
              alt="사이트 로고"
              width='278'
              height="48"
            />
          </div>{/* logo_area */}
          <div className={`${s.gnb_area} clearfix`}>
            <nav id="gnb" className={`${s.gnb_nav} clearfix`}>
              <ul className='clearfix'>
                <Gnb_inner_survey />
                <Gnb />
              </ul>
            </nav>
            <Gnb_my />
          </div>{/* gnb_area */}
        </div>{/* inner */}
      </Wrapper>
    </header>
  );
}

export default Header