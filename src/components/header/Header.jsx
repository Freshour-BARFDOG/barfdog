import React, {useState} from 'react';
import s from './header.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import Wrapper from '/src/components/common/Wrapper';
import useUserData from '/util/hook/useUserData';
import useDeviceState from '/util/hook/useDeviceState';

import { MemberMemu, Non_MemberMenu } from './memberStateMenu';
import ServiceCenter from '/src/components/header/ServiceCenter';
import PcGnb from '/src/components/header/PcGnb';
import MobileGnb from './MobileGnb';
import MobileSidr from "./MobileSidr";
import DeadlineTimer from '/src/components/atoms/DeadlineTimer';

import Icon_cart from '/public/img/icon/cart.svg';
import Logo from '/public/img/logo.png';
import Logo_2x from '/public/img/logo@2x.png';
import MobileLogo from '/public/img/mobile_logo.png';
import MobileLogo_2x from '/public/img/mobile_logo@2x.png';
import Icon_mypage from '/public/img/icon/mypage.svg';
const Modal_subscribeWidhSSR = dynamic(() => import('/src/components/modal/Modal_subscribe'));

const Header = () => {
  const userData = useUserData();
  const isLogin = !!userData;
  const isMobile = useDeviceState().isMobile;
  const [isSidrOpen, setIsSidrOpen] = useState(false);


  return (
    <>
      <header id={s.site_header}>
        <Wrapper>
          <div className={s.headerContainer}>
            <section id="account" className={`${s.account_area} pc`}>
              <ul>
                {isLogin ? <MemberMemu data={userData} /> : <Non_MemberMenu />}
                <ServiceCenter />
              </ul>
            </section>
            <section className={s.logo_area}>
              <Link href="/" passHref>
                <a>
                  {isMobile ? (
                    <Image src={MobileLogo} srcSet={MobileLogo_2x} alt="사이트 로고" priority />
                  ) : (
                    <Image src={Logo} srcSet={Logo_2x} alt="사이트 로고" priority />
                  )}
                </a>
              </Link>
            </section>
            <section className={`${s.gnb_area}`}>
              <nav id="gnb" className={`${s.gnb_nav} pc`}>
                <ul>
                  <PcGnb />
                </ul>
              </nav>
              <Gnb_my isMobile={isMobile} setSidrOpen={setIsSidrOpen} />
            </section>
          </div>
        </Wrapper>
      </header>
      {isMobile && <MobileGnb />}
      {isMobile && <MobileSidr isOpen={isSidrOpen} setSidrOpen={setIsSidrOpen}/>}
      <Modal_subscribeWidhSSR />
    </>
  );
};

export default Header;

export const Gnb_my = ({ isMobile, setSidrOpen }) => {
  const onShowMobileSideMenu = () => {
    setSidrOpen(true);
  };
  return (
    <>
      <div className={s.gnb_my}>
        <ul className="clearfix">
          <li>
            <Link href="/cart" passHref>
              <a id="gnb_cart">
                <div className={s.shop_wrap}>
                  <Icon_cart />
                  <span className={s.gnb_shop_count}>{10}</span>
                  <i className={'DeadlineTimer-wrapper pc'}>
                    <DeadlineTimer />
                  </i>
                </div>
              </a>
            </Link>
          </li>
          <li>
            {isMobile ? (
              <button type={'button'} onClick={onShowMobileSideMenu}>
                <Icon_mypage />
              </button>
            ) : (
              <Link href="/mypage/orderHistory" passHref>
                <a>
                  <Icon_mypage />
                </a>
              </Link>
            )}
          </li>
        </ul>
      </div>
      <i className={'mobile'}>
        <DeadlineTimer />
      </i>
    </>
  );
};
