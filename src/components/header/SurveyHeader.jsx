import React, { useEffect, useState } from 'react';
import s from './surveyHeader.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import Wrapper from '/src/components/common/Wrapper';
import useDeviceState from '/util/hook/useDeviceState';

import { IoIosArrowBack } from 'react-icons/io';
import Logo from '/public/img/logo_sidebar.png';
import Topbutton from '/public/img/topbutton.svg';
import Icon_Home from '/public/img/icon/icon-home.svg';
import { authAction } from '/store/auth-slice';
import { userType } from '/store/TYPE/userAuthType';
import { MoveToAdminPageButton } from './MoveToAdminPageButton';

const Modal_subscribeWidhSSR = dynamic(() =>
  import('/src/components/modal/Modal_subscribe'),
);

export default function SurveyHeader() {
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

  // // [일반유저] 너비 1080 이하 시, 하단바 생성
  // // [관리자] 너비 1200 이하 시, 하단바 생성
  // useEffect(() => {
  //   // 화면 크기를 체크하여 isMobile 상태를 업데이트하는 함수
  //   let size = userData?.userType === userType.ADMIN ? 1200 : 1080;

  //   const updateMobileStatus = () => {
  //     setIsBottombar(window.innerWidth < size);
  //   };

  //   // 컴포넌트 마운트 시 화면 크기를 체크
  //   updateMobileStatus();

  //   // 화면 크기 변경 시 isMobile 상태를 업데이트하기 위해 이벤트 리스너 등록
  //   window.addEventListener('resize', updateMobileStatus);

  //   // 컴포넌트 언마운트 시 이벤트 리스너 제거
  //   return () => {
  //     window.removeEventListener('resize', updateMobileStatus);
  //   };
  // }, []);

  // useEffect(() => {
  //   checkMypagePath(curPath);
  // }, [curPath]);

  // const checkMypagePath = () => {
  //   const isCurPathMypage = curPath.split('/')[1] === 'mypage';
  //   setMypageState((prevState) => ({
  //     ...prevState,
  //     isMyPage: isCurPathMypage,
  //   }));
  //   if (isCurPathMypage) {
  //     const mypageDepth1 = curPath.split('/')[2] && 1;
  //     const mypageDepth2 = curPath.split('/')[3] && 2;
  //     setMypageState((prevState) => ({
  //       ...prevState,
  //       depth: mypageDepth2 || mypageDepth1,
  //     }));
  //   }
  // };
  // // // console.log(userData)

  const returnToPrevPage = () => {
    router.back();
  };

  // ! 사용목적: isMobile상태로인해 , '랜더링 되었다가 사라지는 component'를 애초에 랜더링하지 않게하기 위함
  if (isMobile === null) return;

  return (
    <>
      <header id={s.site_header}>
        <Wrapper bgColor="#be1a21" fullWidth={true}>
          <div className={s.site_header_top}>
            {/* 1. Logo */}
            <section className={s.logo_area}>
              <Link href="/" passHref>
                <a>
                  <Image
                    src={Logo}
                    alt="사이트 로고"
                    priority
                    width={334 / 1.55}
                    height={59 / 1.55}
                    // className={s.logo_img}
                  />
                </a>
              </Link>
            </section>
          </div>
        </Wrapper>
        <TopButton mobileDevice={mobileDevice} />
      </header>

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
