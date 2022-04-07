import React, { useState } from 'react'
import s from '/styles/css/Header.module.scss';
import Link from 'next/link';
import Wrapper from "/src/components/common/Wrapper";
import IMG from '/src/components/atoms/IMG';
import Gnb, { Gnb_my} from '/src/components/header/Gnb';
import ServiceCenter from '/src/components/header/ServiceCenter';
import User_class_box from '../atoms/User_class_box';




function Header(props) {

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
            <Link href="/" passHref>
              <a><IMG
                src="/img/logo.png"
                srcSet="/img/logo@2x.png"
                alt="사이트 로고"
                width='278'
                height="48"
              /></a>
            </Link>
            
          </div>{/* logo_area */}
          <div className={`${s.gnb_area} clearfix`}>
            <nav id="gnb" className={`${s.gnb_nav} clearfix`}>
              <ul className='clearfix'>
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