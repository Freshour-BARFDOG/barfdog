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
import Logo from '/public/img/white_logo.png';
import Topbutton from '/public/img/topbutton.svg';
import Icon_Home from '/public/img/icon/icon-home.svg';
// import { authAction } from '/store/auth-slice';
// import { userType } from '/store/TYPE/userAuthType';
import { MoveToAdminPageButton } from './MoveToAdminPageButton';
import { RxHamburgerMenu } from 'react-icons/rx';
import MobileSidr from './MobileSidr';

const Modal_subscribeWidhSSR = dynamic(() =>
  import('/src/components/modal/Modal_subscribe'),
);

export default function SurveyHeader() {
  // const auth = useSelector((state) => state.auth);
  // const userData = auth.userInfo;

  const router = useRouter();
  const dispatch = useDispatch();
  const curPath = router.asPath;
  const ds = useDeviceState();
  const isMobile = ds.isMobile;
  const mobileDevice = ds.mobileDevice; // # 채널톡 아이콘은 MobileDevice 여부를 판별하여, 크기가 조절된다.
  const pageInfo = useSelector((state) => state.page);
  const pageTitle = pageInfo.pageTitle;
  const [isSidrOpen, setIsSidrOpen] = useState(false);

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

  const onShowMobileSideMenu = () => {
    setIsSidrOpen(true);
  };

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
                    width={334 / 2}
                    height={59 / 2}
                    // className={s.logo_img}
                  />
                </a>
              </Link>
            </section>
            {/* 2. 사이드바 */}
            <button type={'button'} onClick={onShowMobileSideMenu}>
              <div className={s.category_wrap}>
                <RxHamburgerMenu />
              </div>
            </button>
          </div>
        </Wrapper>
        {/* 사이드바 */}
        <div className={s.block_sidebar}></div>
        {<MobileSidr isOpen={isSidrOpen} setSidrOpen={setIsSidrOpen} />}
      </header>

      <Modal_subscribeWidhSSR />
    </>
  );
}
