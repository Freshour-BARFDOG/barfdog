import React, { useEffect, useState } from 'react';
import s from './mobileSidr.module.scss';
import CloseButton from '/src/components/atoms/CloseButton';
import ScrollContainer from '/src/components/atoms/ScrollContainer';
import Image from 'next/image';
import Kakao from '/public/img/icon/kakao.png';
import Naver from '/public/img/icon/naver.png';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { authAction } from '/store/auth-slice';
import { IoIosArrowForward } from 'react-icons/io';
import useUserData from '/util/hook/useUserData';
import IconMypageOrderHIstory from '/public/img/icon/icon-mypage-orderHIstory.svg';
import IconMypageCard from '/public/img/icon/icon-mypage-card.svg';
import IconMypageSubscribe from '/public/img/icon/icon-mypage-subscribe.svg';
import IconMypageInvite from '/public/img/icon/icon-mypage-invite.svg';
import IconMypageDogs from '/public/img/icon/icon-mypage-dogs.svg';
import IconMypageUser from '/public/img/icon/icon-mypage-user.svg';
import IconMypageReview from '/public/img/icon/icon-mypage-review.svg';

function kakaoLoginFunc() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
  router.push(KAKAO_AUTH_URL);
}

export default function MobileSidr({ isOpen, setSidrOpen }) {
  const dispatch = useDispatch();
  const userData = useUserData();
  const isLogin = !!userData ;

  const onCloseSidr = () => {
    setSidrOpen(false);
  };
  const onLogout = () => {
    dispatch(authAction.logout());
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        width:100%;
        // top : -${0}px;
      `;
    }
    return () => {
      document.body.style.cssText = ``;
      window?.scrollTo(0, parseInt(10 * -1));
    };
  }, [isOpen]);

  return (
    <>
      <div id={s.sidr} className={`${isOpen ? s.open : ''} ${isLogin ? s.member : s['non-member'] }`}>
        <main className={s.main}>
          <div className={s.row}>
            <div className={s['close-btn-section']}>
              <CloseButton lineColor={'#333'} onClick={onCloseSidr} />
            </div>
          </div>
          <ScrollContainer className={s['scroll-container']} scrollBarWidth={'0'}>
            {!isLogin && <div className={s.row}>
              <section className={s['login-section']}>
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
                  <button type={'button'} className={s.kakao} onClick={kakaoLoginFunc}>
                    <Image src={Kakao} width={72} height={72} alt="카카오톡 아이콘" />
                    <em className={s.desc}>
                      카카오로 <b> 3초만에 시작</b>하기
                    </em>
                  </button>
                  <button className={s.naver} type={'submit'}>
                    <Image src={Naver} width="72" height="72" alt="네이버 아이콘" />
                  </button>
                </div>
              </section>
            </div>}
            {isLogin && (
              <div className={s.row}>
                <section className={s['dashboard-section']}>
                  <div className={s.userInfo}>
                    <figure className={`${s['cont-left']} ${s.image}`}>
                      <Image
                        alt="대표견 이미지"
                        src="https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                        objectFit="cover"
                        layout="fill"
                      />
                    </figure>
                    <figcaption className={s['cont-right']}>
                      <p className={s.innerRow}>
                        <span className={s.dogName}>바둑이<em className={s.unit}>견주</em></span>
                      </p>
                      <p className={s.innerRow}>
                        <span className={s.userName}>홍길동<em className={s.unit}>님</em></span>
                        <i className={s.grade}>더바프</i>
                      </p>
                      <p className={s.innerRow}>
                        <span className={s.email}>barfdog2021@barfdog.com</span>
                      </p>
                    </figcaption>
                  </div>
                  <div className={s.dashboard}>
                    <ul>
                      <li>
                        <em className={s.num}>1</em>
                        <span className={s.text}>배송현황</span>
                      </li>
                      <li>
                        <em className={s.num}>3,000</em>
                        <span className={s.text}>적립금</span>
                      </li>
                      <li>
                        <em className={s.num}>3</em>
                        <span className={s.text}>쿠폰</span>
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            )}

            {isLogin && (
              <section className={s['mypage-section']}>
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
                    link={'/mypage/user/info'}
                    icon={<IconMypageUser />}
                  />
                  <MypageMenuList
                    title={'후기'}
                    link={'/mypage/review'}
                    icon={<IconMypageReview />}
                  />
                </ul>
              </section>
            )}

            {isLogin && (
              <section className={s['banner-section']}>
                <span>
                  친구초대할 때마다 <b> 5천원 무한적립!</b>
                </span>
                <span>
                  <IoIosArrowForward />
                </span>
              </section>
            )}
            <section className={s['bottom-menu-section']}>
              <ul>
                {isLogin && <MenuList title={'장바구니'} link={'/cart'} />}
                <MenuList title={'공지사항'} link={'/community/notice'} />
                <MenuList title={'이벤트'} link={'/community/event'} />
                <MenuList title={'자주묻는 질문'} link={'/faq'} />
                <MenuList title={'1:1 문의'} />
                {isLogin && <MenuList title={'로그아웃'} onClick={onLogout} />}
              </ul>
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
