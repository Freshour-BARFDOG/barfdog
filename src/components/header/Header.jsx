import React, { useEffect, useState } from 'react';
import s from './header.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import Wrapper from '/src/components/common/Wrapper';
import useDeviceState from '/util/hook/useDeviceState';

import { MemberMemu, Non_MemberMenu } from './memberStateMenu';
import ServiceCenter from '/src/components/header/ServiceCenter';
import PcGnb from '/src/components/header/PcGnb';
import MobileGnb from './MobileGnb';
import MobileSidr from './MobileSidr';
import DeadlineTimer from '/src/components/atoms/DeadlineTimer';
import { IoIosArrowBack } from 'react-icons/io';
import Icon_cart from '/public/img/icon/cart.svg';
import Logo from '/public/img/logo(HQ).png';
import Logo_2x from '/public/img/logo@2x.png';
import MobileLogo from '/public/img/mobile_logo.png';
import MobileLogo_2x from '/public/img/mobile_logo@2x.png';
import Topbutton from '/public/img/topbutton.png';
import Icon_Home from '/public/img/icon/icon-home.svg';
import Icon_mypage from '/public/img/icon/mypage.svg';
import { authAction } from '/store/auth-slice';
import { userType } from '/store/TYPE/userAuthType';

const Modal_subscribeWidhSSR = dynamic(() => import('/src/components/modal/Modal_subscribe'));

export default function Header() {
  const auth = useSelector((state) => state.auth);
  const userData = auth.userInfo;

  const router = useRouter();
  const dispatch = useDispatch();
  const curPath = router.asPath;
  const isMobile = useDeviceState().isMobile;

  const pageInfo = useSelector((state) => state.page);
  const pageTitle = pageInfo.pageTitle;

  const [isSidrOpen, setIsSidrOpen] = useState(false);
  const [mypageState, setMypageState] = useState({ isMyPage: undefined, depth: false });

  useEffect(() => {
    checkMypagePath(curPath);
  }, [curPath]);

  const checkMypagePath = () => {
    const isCurPathMypage = curPath.split('/')[1] === 'mypage';
    setMypageState((prevState) => ({
      ...prevState,
      isMyPage: isCurPathMypage,
    }));
    if (isCurPathMypage) {
      const mypageDepth1 = curPath.split('/')[2] && 1;
      const mypageDepth2 = curPath.split('/')[3] && 2;
      setMypageState((prevState) => ({
        ...prevState,
        depth: mypageDepth2 || mypageDepth1,
      }));
    }
  };
  // console.log(userData)

  const returnToPrevPage = () => {
    router.back();
  };

  const onAdminLogout = () => {
    dispatch(authAction.adminLogout());
  };

  const onMemberLogout = () => {
    dispatch(authAction.logout());
  };

  // ! 사용목적: isMobile상태로인해 , '랜더링 되었다가 사라지는 component'를 애초에 랜더링하지 않게하기 위함
  if (isMobile === null) return;

  return (
    <>
      <header id={s.site_header}>
        <Wrapper>
          {isMobile && mypageState.isMyPage ? (
            <section className={s['mobile-container-onMyapge']}>
              <span className={s['movepage-wrap']}>
                {mypageState.depth === 1 ? (
                  <Link href="/" passHref>
                    <a>
                      <Icon_Home />
                    </a>
                  </Link>
                ) : (
                  <IoIosArrowBack size={26} onClick={returnToPrevPage} />
                )}
              </span>
              <span className={s['title-wrap']}>{pageTitle}</span>
              <span className={s['gbn-my-wrap']}>
                <Gnb_my isMobile={isMobile} setSidrOpen={setIsSidrOpen} authData={auth}/>
              </span>
            </section>
          ) : (
            <div className={s.headerContainer}>
              <section id="account" className={`${s.account_area} pc`}>
                <ul>
                  {userData ? <MemberMemu data={userData} /> : <Non_MemberMenu />}
                  {userData?.userType !== userType.ADMIN && <ServiceCenter />}
                  {userData && (
                    <button
                      type={'button'}
                      onClick={
                        userData.userType === userType.ADMIN ? onAdminLogout : onMemberLogout
                      }
                      data-desc={'admin-logout'}
                    >
                      로그아웃
                    </button>
                  )}
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
                <Gnb_my isMobile={isMobile} setSidrOpen={setIsSidrOpen} authData={auth} />
              </section>
              <TopButton />
            </div>
          )}
        </Wrapper>
      </header>
      {isMobile && !mypageState.isMyPage && <MobileGnb />}
      {isMobile && <MobileSidr isOpen={isSidrOpen} setSidrOpen={setIsSidrOpen} />}
      <Modal_subscribeWidhSSR />
     
    </>
  );
}

export const Gnb_my = ({ isMobile, setSidrOpen, authData }) => {
  const userInfo = authData?.userInfo;
  const cart = useSelector((s) => s.cart);
  const router = useRouter();

  const onShowMobileSideMenu = () => {
    setSidrOpen(true);
  };
  const onMovePage = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      return alert('로그인 후 이용가능합니다.');
    }

    const btn = e.currentTarget;
    const link = btn.dataset.link;
    await router.push(link);
  };

  return (
    <>
      <div className={s.gnb_my}>
        <ul className="clearfix">
          <li>
            <button id="gnb_cart" data-link={'/cart'} onClick={onMovePage}>
              <div className={s.shop_wrap}>
                <Icon_cart />
                <span className={s.gnb_shop_count}>{cart.itemCount || 0}</span>
              </div>
            </button>
          </li>
          <li>
            {isMobile ? (
              <button type={'button'} onClick={onShowMobileSideMenu}>
                <Icon_mypage />
              </button>
            ) : (
              <button data-link={'/mypage/orderHistory'} onClick={onMovePage}>
                <Icon_mypage />
              </button>
            )}
          </li>
        </ul>
      </div>
      <i id={'DeadlineTimer-wrapper'} className={'mobile'}>
        <DeadlineTimer />
      </i>
    </>
  );
};


function TopButton() {
  const [showButton, setShowButton] = useState(false);
  const [pageY, setPageY] = useState(0);

  // 스크롤 최상단 이동
  const scrollToTop = () => {
    window.scroll({
        top: 0,
        behavior: 'smooth'
    })
  }

  // 스크롤 0이상일때 항상 나타남
  // useEffect(() => {
  //   const handleShowButton = () => {
  //       if (window.scrollY > 0) {
  //           setShowButton(true)
  //       } else {
  //           setShowButton(false)
  //       }
  //   }

  //   console.log(window.scrollY)
  //   window.addEventListener("scroll", handleShowButton)
  //   return () => {
  //       window.removeEventListener("scroll", handleShowButton)
  //   }
  // }, [])

  // 스크롤 올릴때 나타남
  useEffect(() => {
    const handleScroll = () => {
    const { pageYOffset } = window;
    const deltaY = pageYOffset - pageY;
    const showButton = pageYOffset !== 0 && deltaY <= 0;
    //const showButton = pageYOffset > 200 && deltaY <= 0;
    setShowButton(showButton);
    setPageY(pageYOffset);
  };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pageY]);

  return showButton && (
    <section className={s.tobox}>
        <button className={s.topbutton} id="top" onClick={scrollToTop} type="button">
          <div className={s.image_wrap}>
          <Image src={Topbutton} width={42} height={52} alt="Tob" priority />
          </div>
        </button>
    </section>
  )
}