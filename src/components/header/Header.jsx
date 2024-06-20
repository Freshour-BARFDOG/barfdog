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
import { IoIosArrowBack } from 'react-icons/io';
import Logo from '/public/img/logo(HQ).png';
import Logo_2x from '/public/img/logo@2x.png';
import MobileLogo from '/public/img/mobile_logo.svg';
// import MobileLogo from '/public/img/mobile_logo.png';
// import MobileLogo_2x from '/public/img/mobile_logo@2x.png';
import Topbutton from '/public/img/topbutton.svg';
import Icon_Home from '/public/img/icon/icon-home.svg';
import { authAction } from '/store/auth-slice';
import { userType } from '/store/TYPE/userAuthType';
import { Gnb_my } from './Gnb_my';
import { MoveToAdminPageButton } from './MoveToAdminPageButton';

const Modal_subscribeWidhSSR = dynamic(() =>
  import('/src/components/modal/Modal_subscribe'),
);

export default function Header() {
  const auth = useSelector((state) => state.auth);
  const userData = auth.userInfo;

  const router = useRouter();
  const dispatch = useDispatch();
  const curPath = router.asPath;
  const ds = useDeviceState();
  const isMobile = ds.isMobile;
  const mobileDevice = ds.mobileDevice; // # 채널톡 아이콘은 MobileDevice 여부를 판별하여, 크기가 조절된다.
  const pageInfo = useSelector((state) => state.page);
  const pageTitle = pageInfo.pageTitle;

  const [isSidrOpen, setIsSidrOpen] = useState(false);
  const [mypageState, setMypageState] = useState({
    isMyPage: undefined,
    depth: false,
  });

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
  // // console.log(userData)

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
          {mypageState.isMyPage ? (
            <section className={s['mobile-container-onMyapge']}>
              <span className={s['movepage-wrap']}>
                {mypageState.depth === 1 ? (
                  <Link href="/" passHref>
                    <a>
                      <Icon_Home
                        width="100%"
                        height="100%"
                        viewBox="0 0 30 30"
                      />
                    </a>
                  </Link>
                ) : (
                  <IoIosArrowBack size={26} onClick={returnToPrevPage} />
                )}
              </span>
              <span className={s['title-wrap']}>{pageTitle}</span>
              <span className={s['gbn-my-wrap']}>
                <Gnb_my
                  isMobile={isMobile}
                  setSidrOpen={setIsSidrOpen}
                  authData={auth}
                />
              </span>
            </section>
          ) : (
            <div className={s.headerContainer}>
              {/* <section id="account" className={`${s.account_area} pc`}>
                <ul>
                  {userData?.userType === userType.ADMIN && (
                    <MoveToAdminPageButton />
                  )}
                  {userData ? (
                    <MemberMemu data={userData} />
                  ) : (
                    <Non_MemberMenu />
                  )}
                  {userData?.userType !== userType.ADMIN && (
                    <ServiceCenter data={{ auth: userData }} />
                  )}
                  {userData && (
                    <button
                      type={'button'}
                      onClick={
                        userData.userType === userType.ADMIN
                          ? onAdminLogout
                          : onMemberLogout
                      }
                      data-desc={'admin-logout'}
                    >
                      로그아웃
                    </button>
                  )}
                </ul>
              </section> */}
              <section className={s.logo_area}>
                <Link href="/" passHref>
                  <a>
                    <Image
                      src={Logo}
                      srcSet={Logo_2x}
                      alt="사이트 로고"
                      priority
                    />
                  </a>
                </Link>
                <Gnb_my
                  isMobile={isMobile}
                  setSidrOpen={setIsSidrOpen}
                  authData={auth}
                />
              </section>
              {/* <section className={`${s.gnb_area}`}>
             <nav id="gnb" className={`${s.gnb_nav} pc`}>
                  <ul>
                    <PcGnb />
                  </ul>
                </nav> 
                <Gnb_my
                  isMobile={isMobile}
                  setSidrOpen={setIsSidrOpen}
                  authData={auth}
                />
              </section> */}
            </div>
          )}
        </Wrapper>
        <TopButton mobileDevice={mobileDevice} />
      </header>
      {!mypageState.isMyPage && <MobileGnb />}
      {<MobileSidr isOpen={isSidrOpen} setSidrOpen={setIsSidrOpen} />}
      <Modal_subscribeWidhSSR />
    </>
  );
}

// function TopButton ({mobileDevice}) {
function TopButton() {
  const [showButton, setShowButton] = useState(false);
  const [pageY, setPageY] = useState(0);

  // * 버튼 위치 변경으로 PC/모바일 구분만 필요하게 변경
  // * react-device-detect: 안드로이드 테블릿 미대응으로 삭제

  // // console.log( 'isMobileByWinWidth = ', DeviceDetect.isMobile )
  // // console.log( 'isMobileLib = ', isMobileDevice )
  // 스크롤 최상단 이동
  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  };

  // ScrollYOffset > 200 이상일 경우 스크롤 올릴때 나타남
  useEffect(() => {
    const handleScroll = () => {
      const { pageYOffset } = window;
      const deltaY = pageYOffset - pageY;
      // const showButton = pageYOffset !== 0 && deltaY <= 0;
      const showButton = pageYOffset > 200 && deltaY <= 0;
      setShowButton(showButton);
      setPageY(pageYOffset);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pageY]);

  // const isMobile  = () => {
  //   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)
  // }

  // const renderItems = () => {
  //   if(isMobile) {
  //     return showButton &&
  //     <div className={s.toboxm}>
  //       <button className={s.topbuttonm} id="top" onClick={scrollToTop} type="button">
  //         <div className={s.image_wrap}>
  //           <Topbutton/>
  //         </div>
  //       </button>
  //     </div>
  //   } else {
  //     return showButton &&
  //     <div className={s.tobox}>
  //       <button className={s.topbutton} id="top" onClick={scrollToTop} type="button">
  //         <div className={s.image_wrap}>
  //           <Topbutton/>
  //         </div>
  //       </button>
  //     </div>
  //   }
  // };
  const isMobile = () => {
    const user = navigator.userAgent;
    const isCheck = false;
    // const Mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
    // /Mobi/i.test

    if (
      user.indexOf('iPhone') > -1 ||
      user.indexOf('Android') > -1 ||
      // || user.indexOf("iPad") > -1
      user.indexOf('iPod') > -1
      // Mobile
    ) {
      return (
        showButton && (
          <div className={s.toboxm}>
            <button
              className={s.topbuttonm}
              id="top"
              onClick={scrollToTop}
              type="button"
            >
              <div className={s.image_wrap}>
                <Topbutton />
              </div>
            </button>
          </div>
        )
      );
    }
    return (
      showButton && (
        <div className={s.tobox}>
          <button
            className={s.topbutton}
            id="top"
            onClick={scrollToTop}
            type="button"
          >
            <div className={s.image_wrap}>
              <Topbutton width="100%" height="100%" viewBox="0 0 50 50" />
            </div>
          </button>
        </div>
      )
    );
  };

  /*BrowserView, MobileView, isBrowser, isMobile*/
  return (
    showButton && (
      <section>
        {isMobile()}
        {/* <DeviceDetect.MobileView>
        <div className={s.toboxm}>
          <button className={s.topbuttonm} id="top" onClick={scrollToTop} type="button">
            <div className={s.image_wrap}>
              <Topbutton/>
            </div>
          </button>
        </div>
      </DeviceDetect.MobileView>
      <DeviceDetect.BrowserView>
        <div className={s.tobox}>
          <button className={s.topbutton} id="top" onClick={scrollToTop} type="button">
            <div className={s.image_wrap}>
              <Topbutton/>
            </div>
          </button>
        </div>
      </DeviceDetect.BrowserView> */}

        {/* <MobileView>
        <div className={s.toboxm}>
          <button className={s.topbuttonm} id="top" onClick={scrollToTop} type="button">
            <div className={s.image_wrap}>
              <Topbutton/>
            </div>
          </button>
        </div>
      </MobileView>
      <BrowserView>
        <div className={s.tobox}>
          <button className={s.topbutton} id="top" onClick={scrollToTop} type="button">
            <div className={s.image_wrap}>
              <Topbutton/>
            </div>
          </button>
        </div>
      </BrowserView> */}

        {/* <div className={`${s.custom} ${mobileDevice ? s.toboxm : s.tobox}`}>
        <button className={s.topbuttonm} id="top" onClick={scrollToTop} type="button">
          <div className={s.image_wrap}>
            <Topbutton/>
          </div>
        </button>
      </div> */}
      </section>
    )
  );
}
