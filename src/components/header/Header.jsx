import React, { useEffect, useState } from 'react';
import s from './header.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import Wrapper from '/src/components/common/Wrapper';
import useDeviceState from '/util/hook/useDeviceState';

import MenuLayout, { SubmenuList } from '/src/components/header/MenuLayout';
import { general_itemType } from '../../../store/TYPE/itemType';
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
  const [isBottombar, setIsBottombar] = useState(false);
  const [mypageState, setMypageState] = useState({
    isMyPage: undefined,
    depth: false,
  });

  // [일반유저] 너비 1080 이하 시, 하단바 생성
  // [관리자] 너비 1200 이하 시, 하단바 생성
  useEffect(() => {
    // 화면 크기를 체크하여 isMobile 상태를 업데이트하는 함수
    let size = userData?.userType === userType.ADMIN ? 1200 : 1080;

    const updateMobileStatus = () => {
      setIsBottombar(window.innerWidth < size);
    };

    // 컴포넌트 마운트 시 화면 크기를 체크
    updateMobileStatus();

    // 화면 크기 변경 시 isMobile 상태를 업데이트하기 위해 이벤트 리스너 등록
    window.addEventListener('resize', updateMobileStatus);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', updateMobileStatus);
    };
  }, []);

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
          <div className={s.site_header_top}>
            {/* 1. Logo */}
            <section className={s.logo_area}>
              <Link href="/" passHref>
                <a>
                  {isMobile ? (
                    <Image
                      src={Logo}
                      // srcSet={Logo_2x}
                      alt="사이트 로고"
                      // priority
                      // layout="fill"
                      width={140 * 1.5}
                      height={25 * 1.5}
                      // className={s.logo_img}
                    />
                  ) : (
                    <Image
                      src={Logo}
                      srcSet={Logo_2x}
                      alt="사이트 로고"
                      priority
                      width={334 / 1.55}
                      height={59 / 1.55}
                      // className={s.logo_img}
                    />
                  )}
                </a>
              </Link>

              {/* ---- 메뉴바 ---- */}
              {/* pc (O)  ,  mobile (X) */}
              {/* <nav id="gnb" className={`${s.gnb_nav} pc`}> */}
              {!isBottombar && (
                <nav id="gnb" className={`${s.gnb_nav}`}>
                  <ul>
                    <MenuLayout title="건강케어" link="/healthcare">
                      <SubmenuList title="AI 추천 식단" link="/surveyGuide" />
                      <SubmenuList title="진단기기" link="/healthcare/kit" />
                      <SubmenuList title="AI 수의사" link="/healthcare/vet" />
                    </MenuLayout>
                    <MenuLayout
                      title="스토어"
                      link={`/shop?itemType=${general_itemType.ALL}`}
                    >
                      <SubmenuList
                        title="ALL"
                        link={`/shop?itemType=${general_itemType.ALL}`}
                      />
                      <SubmenuList
                        title="생식"
                        link={`/shop?itemType=${general_itemType.RAW}`}
                      />
                      <SubmenuList
                        title="토퍼"
                        link={`/shop?itemType=${general_itemType.TOPPING}`}
                      />
                      {/* [추후간식] 링크수정  */}
                      <SubmenuList
                        title="간식"
                        link={`/shop?itemType=${general_itemType.TOPPING}`}
                      />
                      <SubmenuList
                        title="용품"
                        link={`/shop?itemType=${general_itemType.GOODS}`}
                      />
                    </MenuLayout>
                    <MenuLayout title="멤버십" link="/membership" />
                    <MenuLayout title="커뮤니티" link="/community/notice">
                      <SubmenuList title="공지사항" link="/community/notice" />
                      <SubmenuList title="블로그" link="/community/blog" />
                      <SubmenuList title="어바웃" link="/community/about" />
                    </MenuLayout>
                    <MenuLayout title="리뷰" link="/review" />
                  </ul>
                </nav>
              )}
            </section>

            {/* ----- MOBILE ----- */}
            {isMobile && (
              <div className={s.mob_sub_logout}>
                {/* Mobile - AI 추천식단 */}
                <PcGnb />
                {userData ? (
                  <button
                    type={'button'}
                    onClick={
                      userData.userType === userType.ADMIN
                        ? onAdminLogout
                        : onMemberLogout
                    }
                    data-desc={'admin-logout'}
                    className={s.admin_logout}
                  >
                    로그아웃
                  </button>
                ) : (
                  <Non_MemberMenu />
                )}
              </div>
            )}

            {/* {isMobile && mypageState.isMyPage ? (
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
            ) : ( */}

            {!isMobile && (
              <>
                <section className={`${s.gnb_area}`}>
                  {userData?.userType === userType.ADMIN && (
                    <MoveToAdminPageButton />
                  )}
                  <nav id="gnb" className={`${s.gnb_nav} pc`}>
                    <ul>
                      <PcGnb />
                    </ul>
                  </nav>

                  {/* 3. 회원가입, 로그인 */}
                  <section id="account" className={`${s.account_area} pc`}>
                    <ul>
                      {userData ? (
                        <button
                          type={'button'}
                          onClick={
                            userData.userType === userType.ADMIN
                              ? onAdminLogout
                              : onMemberLogout
                          }
                          data-desc={'admin-logout'}
                          className={s.admin_logout}
                        >
                          로그아웃
                        </button>
                      ) : (
                        <Non_MemberMenu />
                      )}

                      {/* {userData?.userType !== userType.ADMIN && <ServiceCenter data={{auth: userData}}/>} */}

                      {/* 4. 장바구니, 마이페이지 */}
                      <Gnb_my
                        isMobile={isMobile}
                        setSidrOpen={setIsSidrOpen}
                        authData={auth}
                      />
                    </ul>
                  </section>
                </section>
              </>
            )}
          </div>
        </Wrapper>
        <TopButton mobileDevice={mobileDevice} />
      </header>

      {/* 모바일 - 하단 고정바 */}
      {/* {isMobile && !mypageState.isMyPage && <MobileGnb />} */}
      {/* {isBottombar && !mypageState.isMyPage && <MobileGnb />} */}
      {isBottombar && <MobileGnb />}

      {/* [삭제예정] 모바일 - 사이드바  */}
      {/* {isMobile && (
        <MobileSidr isOpen={isSidrOpen} setSidrOpen={setIsSidrOpen} />
      )} */}
      <Modal_subscribeWidhSSR />
    </>
  );
}

// function TopButton ({mobileDevice}) {
function TopButton() {
  // const [showButton, setShowButton] = useState(false);
  const [pageY, setPageY] = useState(0);
  const [isBottombar, setIsBottombar] = useState(false);

  const auth = useSelector((state) => state.auth);
  const userData = auth.userInfo;

  // [일반유저] 너비 1080 이하 시, 하단바 생성
  // [관리자] 너비 1200 이하 시, 하단바 생성
  useEffect(() => {
    // 화면 크기를 체크하여 isMobile 상태를 업데이트하는 함수
    let size = userData?.userType === userType.ADMIN ? 1200 : 1080;

    const updateMobileStatus = () => {
      setIsBottombar(window.innerWidth < size);
    };

    // 컴포넌트 마운트 시 화면 크기를 체크
    updateMobileStatus();

    // 화면 크기 변경 시 isMobile 상태를 업데이트하기 위해 이벤트 리스너 등록
    window.addEventListener('resize', updateMobileStatus);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', updateMobileStatus);
    };
  }, []);

  // * 버튼 위치 변경으로 PC/모바일 구분만 필요하게 변경
  // * react-device-detect: 안드로이드 테블릿 미대응으로 삭제

  // // console.log( 'isMobileByWinWidth = ', DeviceDetect.isMobile )
  // // console.log( 'isMobileLib = ', isMobileDevice )
  // 스크롤 최상단 이동
  const scrollToTop = () => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  };

  // [24.03.31 - 기능 제거] ScrollYOffset > 200 이상일 경우 스크롤 올릴때 나타남
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const { pageYOffset } = window;
  //     //     const deltaY = pageYOffset - pageY;
  //     //     // const showButton = pageYOffset !== 0 && deltaY <= 0;
  //     //     const showButton = pageYOffset > 200 && deltaY <= 0;
  //     //     setShowButton(showButton);
  //     setPageY(pageYOffset);
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [pageY]);

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
        // [수정] 항상 보이게 설정
        // showButton && (
        <div className={s.toboxm}>
          <button
            className={s.topbuttonm}
            id="top"
            onClick={scrollToTop}
            type="button"
          >
            {/* <div className={s.image_wrap}>
              <Topbutton />
            </div> */}
            <div className={s.image_wrap}>
              <Image
                src="/img/icon/main-arrow.svg"
                alt="arrow"
                width={20}
                height={10}
                className={s.arrow_icon}
              />
            </div>
            <div className={s.text_top}>TOP</div>
          </button>
        </div>
      );
      // );
    }
    return (
      // [수정] 항상 보이게 설정
      // showButton && (
      <div
        className={s.tobox}
        // [수정] 항상 위치 고정
        // 하단바 생성 시, 최상단 버튼도 올라오게
        // style={isBottombar ? { marginBottom: '6rem' } : {}}
      >
        <button
          className={s.topbutton}
          id="top"
          onClick={scrollToTop}
          type="button"
        >
          {/* <div className={s.image_wrap}>
              <Topbutton width="100%" height="100%" viewBox="0 0 50 50" />
            </div> */}
          <div className={s.image_wrap}>
            <Image
              src="/img/icon/main-arrow.svg"
              alt="arrow"
              width={20}
              height={10}
              className={s.arrow_icon}
            />
          </div>
          <div className={s.text_top}>TOP</div>
        </button>
      </div>
    );
    // );
  };

  /*BrowserView, MobileView, isBrowser, isMobile*/
  return (
    // showButton && (
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
  );
  // );
}
