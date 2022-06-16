import React from 'react'
import s from './header.module.scss';
import Link from 'next/link';
import Wrapper from "/src/components/common/Wrapper";
import Gnb, { Gnb_my} from '/src/components/header/Gnb';
import ServiceCenter from '/src/components/header/ServiceCenter';
import Image from 'next/image';
import Logo from '/public/img/logo.png';
import Logo_2x from '/public/img/logo@2x.png';
import useUserData from "/util/hook/useUserData";






const MemberMemu = ({data}) => {
  const isAdmin = data.name === '관리자';
  return (
    <li>
      {!isAdmin && <span className={s.userClass}>{data.grade}</span>}
      <span className={s.username}>
        <em>{data.name}</em>님
      </span>
    </li>
  );
}



const Non_MemberMenu = () => {
  return (
    <>
      <li>
        <Link href="/account/signup" as="/account/signup">
          회원가입
        </Link>
      </li>
      <li>
        <Link href="/account/login" as="/account/login">
          로그인
        </Link>
      </li>
    </>
  );
}



const HeaderTopMenu = ( {loginState, data} ) => {


  const MenuList = loginState ? <MemberMemu data={data}  /> : <Non_MemberMenu />;
  return (
    <>
      {MenuList}
      <ServiceCenter />
    </>
  )
}



const Header = () => {
  const userData = useUserData();
  const isLogin = !!userData;

  return (
    <header id={s.site_header}>
      <Wrapper>
        <div className={s.inner}>
          <div id="account" className={`${s.account_area} clearfix`}>
            <ul className="clearfix">
              <HeaderTopMenu loginState={isLogin} data={userData}/>
            </ul>
          </div>
          <div className={s.logo_area}>
            <Link href="/" passHref>
              <a>
                <Image src={Logo} srcSet={Logo_2x} alt="사이트 로고" priority />
              </a>
            </Link>
          </div>
          <div className={`${s.gnb_area} clearfix`}>
            <nav id="gnb" className={`${s.gnb_nav} clearfix`}>
              <ul className="clearfix">
                <Gnb />
              </ul>
            </nav>
            <Gnb_my />
          </div>
        </div>
      </Wrapper>
    </header>
  );
}

export default Header;




