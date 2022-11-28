import React, { useEffect, useState } from 'react';
import s from './mobileSidr.module.scss';
import CloseButton from '/src/components/atoms/CloseButton';
import ScrollContainer from '/src/components/atoms/ScrollContainer';
import Image from 'next/image';
// import Kakao from '/public/img/icon/kakao.png';
// import Naver from '/public/img/icon/naver.png';
import Kakao from '/public/img/icon/kakao.svg';
import Naver from '/public/img/icon/naver.svg';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { authAction } from '/store/auth-slice';
import { IoIosArrowForward } from 'react-icons/io';
import IconMypageOrderHIstory from '/public/img/icon/icon-mypage-orderHIstory.svg';
import IconMypageCard from '/public/img/icon/icon-mypage-card.svg';
import IconMypageSubscribe from '/public/img/icon/icon-mypage-subscribe.svg';
import IconMypageInvite from '/public/img/icon/icon-mypage-invite.svg';
import IconMypageDogs from '/public/img/icon/icon-mypage-dogs.svg';
import IconMypageUser from '/public/img/icon/icon-mypage-user.svg';
import IconMypageReview from '/public/img/icon/icon-mypage-review.svg';
import useDeviceState from '/util/hook/useDeviceState';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { userType } from '/store/TYPE/userAuthType';
import { useRouter } from 'next/router';
import MypageBanner from '../atoms/MypageBanner';
import popupWindow from "../../../util/func/popupWindow";


export default function MobileSidr({ isOpen, setSidrOpen }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((s) => s.auth);
  const data = auth.userInfo;
  const isMobile = useDeviceState().isMobile;
  const isLogin = data?.userType && data?.userType !== userType.NON_MEMBER;

  const kakaoLoginHandler = async () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    await router.push(KAKAO_AUTH_URL);
  };

  const naverLoginHandler = async () => {
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize`;
    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const redirUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;
    const state = 'tempString'; // 상태 유지를 위한 "임의의 문자열"
    await router.push(
      `${NAVER_AUTH_URL}?response_type=code&client_id=${clientId}&redirect_uri=${redirUri}&state=${state}`,
    );
  };

  useEffect(() => {
    // 모바일 sidr mount => 스크롤 기능: INACTIVE
    if (isOpen) {
      document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        width:100%;
        // top : -${0}px;
      `;
      // document.head.insertBefore('')
    }

    // unmount => 스크롤 기능: ACTIVE
    return () => {
      document.body.style.cssText = ``;
      window?.scrollTo(0, parseInt(10 * -1));
    };
  }, [isOpen]);

  const onCloseSidr = () => {
    setSidrOpen(false);
  };
  const onLogout = () => {
    dispatch(authAction.logout());
  };
  
  const openGradePopupHandler = () => {
    const href = '/popup/gradePolicy';
    const options = {
      width: isMobile ? 320 : 1120,
      height: isMobile ? 517 : 730,
      left: 200,
      top: 100
    };
    popupWindow( href, options );
  }
  
  if (!isMobile) return;

  return (
    <>
      <div
        id={s.sidr}
        className={`${isOpen ? s.open : ''} ${isLogin ? s.member : s['non-member']}`}
      >
        <main className={s.main}>
          <section className={s['close-btn-section']}>
            <div className={s.row}>
              <CloseButton lineColor={'#333'} onClick={onCloseSidr} />
            </div>
          </section>
          <ScrollContainer className={s['scroll-container']} scrollBarWidth={'0'}>
            {!isLogin && (
              <section className={s['login-section']}>
                <div className={s.row}>
                  <MenuList
                    contClassName={`${s.btn} ${s.solid}`}
                    title={'로그인'}
                    link={'/account/login'}
                    removeIcon={true}
                  />
                  <MenuList
                    contClassName={`${s.btn} ${s.line}`}
                    title={'회원가입'}
                    link={'/account/signup'}
                    removeIcon={true}
                  />
                  <div className={s.divider}>
                    <i />
                    <span className={s.text}>간편 로그인</span>
                    <i />
                  </div>
                  <div className={s['sns']}>
                    <button type={'button'} className={s.kakao} onClick={kakaoLoginHandler}>
                      {/* <Image src={Kakao} width={72} height={72} alt="카카오톡 아이콘" /> */}
                      <Kakao />
                      <em className={s.desc}>
                        카카오로 <b> 3초만에 시작</b>하기
                      </em>
                    </button>
                    <button type={'button'} className={s.naver} onClick={naverLoginHandler}>
                      {/* <Image src={Naver} width="72" height="72" alt="네이버 아이콘" /> */}
                      <Naver />
                    </button>
                  </div>
                </div>
              </section>
            )}
            {isLogin && (
              <section className={s['dashboard-section']}>
                <div className={s.row}>
                  <div className={s.userInfo}>
                    <figure className={`${s['cont-left']} ${s.image}`}>
                      {data.dog.thumbnailUrl && (
                        <Image
                          alt="반려견 대표 이미지"
                          src={data.dog.thumbnailUrl}
                          objectFit="cover"
                          layout="fill"
                        />
                      )}
                    </figure>
                    <figcaption className={s['cont-right']}>
                      <p className={s.innerRow}>
                        <span className={s.dogName}>
                          {data.dog.dogName}
                          <em className={s.unit}>견주</em>
                        </span>
                      </p>
                      <p className={s.innerRow}>
                        <button type={'button'} className={s.userName} onClick={openGradePopupHandler}>
                          {data.name}
                          <em className={s.unit}>님</em>
                        </button>
                        {/*<Link href={'/popup/gradePolicy'} passHref>*/}
                          {/*<a className={s.userName}>*/}
                          {/*  {data.name}*/}
                          {/*  <em className={s.unit}>님</em>*/}
                          {/*</a>*/}
                        {/*</Link>*/}
                        <i className={s.grade} onClick={openGradePopupHandler}>{data.grade}</i>
                      </p>
                      <p className={s.innerRow}>
                        <span className={s.email}>{data.email}</span>
                      </p>
                    </figcaption>
                  </div>
                  <div className={s.dashboard}>
                    <ul>
                      <li>
                        <Link href="/mypage/delivery" passHref>
                          <a>
                            <em className={s.num}>{data.deliveryCount}</em>
                            <span className={s.text}>배송현황</span>
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/mypage/reward" passHref>
                          <a>
                            <em className={s.num}>{transformLocalCurrency(data.reward)}</em>
                            <span className={s.text}>적립금</span>
                          </a>
                        </Link>
                      </li>
                      <li>
                        <Link href="/mypage/coupon" passHref>
                          <a>
                            <em className={s.num}>{data.couponCount}</em>
                            <span className={s.text}>쿠폰</span>
                          </a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {isLogin && (
              <section className={s['mypage-section']}>
                <div className={s.row}>
                  <ul>
                    <MypageMenuList
                      title={'주문내역'}
                      link={'/mypage/orderHistory'}
                      icon={<IconMypageOrderHIstory />}
                    />
                    <MypageMenuList
                      title={'카드관리'}
                      link={'/mypage/card'}
                      icon={<IconMypageCard />}
                    />
                    <MypageMenuList
                      title={'구독관리'}
                      link={'/mypage/subscribe'}
                      icon={<IconMypageSubscribe />}
                    />
                    <MypageMenuList
                      title={'친구초대'}
                      link={'/mypage/invite'}
                      icon={<IconMypageInvite />}
                    />
                    <MypageMenuList
                      title={'반려견정보'}
                      link={'/mypage/dogs'}
                      icon={<IconMypageDogs />}
                    />
                    <MypageMenuList
                      title={'계정정보'}
                      link={'/mypage/user'}
                      icon={<IconMypageUser />}
                    />
                    <MypageMenuList
                      title={'후기'}
                      link={'/mypage/review'}
                      icon={<IconMypageReview />}
                    />
                  </ul>
                </div>
              </section>
            )}
            {isLogin && <MypageBanner />}
            <section className={s['bottom-menu-section']}>
              <div className={s.row}>
                <ul>
                  {isLogin && <MenuList title={'장바구니'} link={'/cart'} />}
                  <MenuList title={'공지사항'} link={'/community/notice'} />
                  <MenuList title={'이벤트'} link={'/community/event'} />
                  <MenuList title={'자주묻는 질문'} link={'/faq'} />
                  <MenuList
                    title={'1:1 문의'}
                    contClassName={'ch-open-button'}
                    //onClick={onCloseSidr}
                    link={'/mypage/inquiry'}
                  />
                  {isLogin && <MenuList title={'로그아웃'} onClick={onLogout} />}
                  <MenuList  />
                </ul>
              </div>
            </section>
          </ScrollContainer>
        </main>
      </div>
      {isOpen && <i className={s.background} onClick={onCloseSidr}></i>}
    </>
  );
}

const MenuList = ({ title, link, onClick, contClassName, removeIcon }) => {
  const onClickHandler = () => {
    if (onClick && typeof onClick === 'function') onClick();
  };
  return (
    <li>
      {link ? (
        <Link href={link} passHref>
          <a className={contClassName || ''}>{title}</a>
        </Link>
      ) : (
        <button className={contClassName || ''} type={'button'} onClick={onClickHandler}>
          {title}
        </button>
      )}
      {!removeIcon && <IoIosArrowForward />}
    </li>
  );
};

const MypageMenuList = ({ title, link, icon }) => {
  return (
    <li>
      <Link href={link} passHref>
        <a>
          <i>{icon}</i>
          <span className={s.text}>{title}</span>
        </a>
      </Link>
    </li>
  );
};

// const DUMMY_DATA = {
//   data: {
//     mypageMemberDto: {
//       id: 10,
//       memberName: '김회원',
//       grade: '더바프',
//       myRecommendationCode: '2BngT6yMM',
//       reward: 50000,
//     },
//     mypageDogDto: {
//       thumbnailUrl:
//         'https://images.unsplash.com/photo-1422565096762-bdb997a56a84?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
//       dogName: '강아지1',
//     },
//     deliveryCount: 4,
//     couponCount: 4,
//     _links: {
//       self: {
//         href: 'http://localhost:8080/api/mypage',
//       },
//       profile: {
//         href: '/docs/index.html#resources-my-page',
//       },
//     },
//   },
// };
