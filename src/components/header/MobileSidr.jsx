import React, { useEffect, useState } from 'react';
import s from './mobileSidr.module.scss';
import CloseButton from '/src/components/atoms/CloseButton';
import ScrollContainer from '/src/components/atoms/ScrollContainer';
import Image from 'next/image';
import Logo from '/public/img/mobile_logo.svg';
import Icon_cart from '../../../public/img/icon/cart.svg';
import Icon_mypage from '../../../public/img/icon/mypage.svg';
// import Icon_cart from '../../../public/img/icon/icon-sidebar-cart.svg';
// import Kakao from '/public/img/icon/kakao.png';
// import Naver from '/public/img/icon/naver.png';
import Kakao from '/public/img/icon/kakao-login.svg';
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
import IconMypagePromotion from '/public/img/icon/icon-mypage-promotion.svg';
import useDeviceState from '/util/hook/useDeviceState';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { userType } from '/store/TYPE/userAuthType';
import { general_itemType } from '../../../store/TYPE/itemType';
import { useRouter } from 'next/router';
import MypageBanner from '../atoms/MypageBanner';
import { openGradePopupHandler } from '/src/pages/popup/gradePolicy';

export default function MobileSidr({ isOpen, setSidrOpen }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((s) => s.auth);
  const data = auth.userInfo;
  const cart = useSelector((s) => s.cart);
  const isMobile = useDeviceState().isMobile;
  const isLogin = data?.userType && data?.userType !== userType.NON_MEMBER;

  const [isArrowActive, setIsArrowActive] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

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

  // if (!isMobile) return;

  const onMovePage = async (e) => {
    e.preventDefault();
    const btn = e.currentTarget;
    const link = btn.dataset.link;
    if (!data) {
      return await router.push('/account/login');
    }

    await router.push(link);
  };

  return (
    <>
      <div
        id={s.sidr}
        className={`${isOpen ? s.open : ''} ${
          isLogin ? s.member : s['non-member']
        }`}
      >
        <main className={s.main}>
          <section className={s['close-btn-section']}>
            <div className={s.row}>
              <div className={s.logo_img}>
                <Image
                  src={'/img/logo.png'}
                  alt="사이트 로고"
                  width={140 * 1.3}
                  height={25 * 1.3}
                />
              </div>

              <ul className={s.top_menu_wrap}>
                <li>
                  <button
                    type={'button'}
                    data-link={'/mypage/orderHistory'}
                    onClick={(e) => onMovePage(e, '/mypage/orderHistory')}
                  >
                    <div className={s.mypage_wrap}>
                      <Icon_mypage />
                    </div>
                  </button>
                </li>
                <li>
                  <button
                    id="gnb_cart"
                    data-link={'/cart'}
                    onClick={(e) => onMovePage(e, '/cart')}
                  >
                    <div className={s.shop_wrap}>
                      {/* <Icon_cart /> */}
                      {cart.itemCount !== 0 && (
                        <span className={s.gnb_shop_count}>
                          {cart.itemCount}
                        </span>
                      )}
                    </div>
                  </button>
                </li>
                <li>
                  <CloseButton lineColor={'#636363'} onClick={onCloseSidr} />
                </li>
              </ul>

              {/* <div className={s.cart_close}>
                <button id="gnb_cart" data-link={'/cart'} onClick={onMovePage}>
                  <div className={s.shop_wrap}>
                    <Icon_cart className={s.icon_cart} />
                    <span className={s.gnb_shop_count}>
                      {cart.itemCount || 0}
                    </span>
                  </div>
                </button>
              </div> */}
            </div>
          </section>
          <ScrollContainer
            className={s['scroll-container']}
            scrollBarWidth={'0'}
          >
            <section className={s['bottom-menu-section']}>
              <div className={s.row}>
                <ul>
                  <li className={s.main_menu_title}>
                    <Link href={'/surveyGuide'} passHref>
                      <a>헬스케어</a>
                    </Link>
                  </li>

                  <ul className={s.menu_list_container}>
                    <li>
                      <Link href={'/surveyGuide'} passHref>
                        <a>AI 추천 식단</a>
                      </Link>
                    </li>

                    <MenuList
                      title={'건강수첩'}
                      isArrowActive={isArrowActive}
                      setIsArrowActive={setIsArrowActive}
                      index={0}
                      onClick={true}
                    ></MenuList>
                    <ul
                      className={`${s.submenu_container} ${
                        isArrowActive[0] ? s.active : ''
                      }`}
                    >
                      <li>
                        <Link href={'/surveyGuide'} passHref>
                          <a>내 반려견 기록</a>
                        </Link>
                      </li>
                      <li>
                        <Link href={'/healthcare/vet'} passHref>
                          <a>견종백과</a>
                        </Link>
                      </li>
                      <li>
                        <Link href={'/healthcare/vet'} passHref>
                          <a>건강문진</a>
                        </Link>
                      </li>
                      <li>
                        <Link href={'/healthcare/vet'} passHref>
                          <a>장내분석</a>
                        </Link>
                      </li>
                    </ul>
                  </ul>

                  <li className={s.main_menu_title}>
                    <Link href={'/surveyGuide'} passHref>
                      <a>제품</a>
                    </Link>
                  </li>
                  <ul className={s.menu_list_container}>
                    <li>
                      <Link
                        href={`/shop?itemType=${general_itemType.ALL}`}
                        passHref
                      >
                        <a>스토어</a>
                      </Link>
                    </li>

                    <li>
                      <Link href={'/review'} passHref>
                        <a>리뷰</a>
                      </Link>
                    </li>
                  </ul>

                  <li className={s.main_menu_title}>
                    <Link href={'/surveyGuide'} passHref>
                      <a>바프독</a>
                    </Link>
                  </li>
                  <ul className={s.menu_list_container}>
                    <li>
                      <Link href={'/community/notice'} passHref>
                        <a>공지사항</a>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/community/event'} passHref>
                        <a>어바웃</a>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/community/blog'} passHref>
                        <a>블로그</a>
                      </Link>
                    </li>
                    <li>
                      <Link href={'/community/about'} passHref>
                        <a>자주 묻는 질문</a>
                      </Link>
                    </li>
                  </ul>

                  {/* <MenuList title={'자주묻는 질문'} link={'/faq'} /> */}
                  {/* {isLogin && (
                    <MenuList
                      title={'1:1 문의'}
                      contClassName={'ch-open-button'}
                      //onClick={onCloseSidr}
                      link={'/mypage/inquiry'}
                    />
                  )}
                  {isLogin && (
                    <MenuList title={'로그아웃'} onClick={onLogout} />
                  )} */}
                </ul>
                <div className={s.menu_end_line}></div>
              </div>
            </section>

            <div className={s.sns_container}>
              <ul>
                <li>
                  <a
                    href="https://pf.kakao.com/_WixbrK"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Image
                      src={'/img/icon/sns-kakao.svg'}
                      alt="sns-kakao"
                      width={30}
                      height={30}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/barfdog_official/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Image
                      src={'/img/icon/sns-insta.svg'}
                      alt="sns-insta"
                      width={30}
                      height={30}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="https://blog.naver.com/barfdog"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Image
                      src={'/img/icon/sns-blog.svg'}
                      alt="sns-blog"
                      width={30}
                      height={30}
                    />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/channel/UCf_VpnXwfLu6wQ1ADcXSphA/featured"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Image
                      src={'/img/icon/sns-youtube.svg'}
                      alt="sns-youtube"
                      width={30}
                      height={30}
                    />
                  </a>
                </li>
              </ul>
            </div>

            {/* <div className={s.contact_container}>
              <div className={s.contact_top}>
                <p>소통가능 시간</p>
                <a
                  href="https://pf.kakao.com/_WixbrK"
                  rel="noreferrer"
                  target="_blank"
                >
                  실시간 상담
                </a>
              </div>
              <div className={s.contact_bottom}>
                <div className={s.contact_bottom_lt}>
                  <p>월-금요일</p>
                  <span className={s.contact_line}></span>
                  <p>오전 10시-오후 7시</p>
                </div>
                <div className={s.contact_bottom_rt}>
                  <p>점심시간</p>
                  <span className={s.contact_line}></span>
                  <p>오후 12시-오후 1시</p>
                </div>
              </div>
            </div> */}
          </ScrollContainer>
        </main>
      </div>
      {/* {isOpen && <i className={s.background} onClick={onCloseSidr}></i>} */}
      {isOpen && <div className={s.block_sidebar}></div>}
    </>
  );
}

const MenuList = ({
  title,
  link,
  onClick,
  contClassName,
  removeIcon,
  isArrowActive,
  setIsArrowActive,
  index,
  noArrow,
}) => {
  const [rotation, setRotation] = useState(0);

  const onClickHandler = (e) => {
    e.preventDefault();
    if (onClick && typeof onClick === 'function') onClick();
  };

  // 펼침 토글
  const onClickArrowIcon = (index, e) => {
    e.preventDefault();
    // setIsArrowActive(!isArrowActive);

    const updatedList = isArrowActive.map((item, idx) =>
      idx === index ? !item : false,
    );
    setIsArrowActive(updatedList);
    setRotation((prevRotation) => (prevRotation + 180) % 360);
  };

  return (
    <li onClick={(e) => onClickArrowIcon(index, e)}>
      {link ? (
        <Link href={link} passHref>
          <a className={contClassName || ''}>{title}</a>
        </Link>
      ) : (
        <button
          className={contClassName || ''}
          type={'button'}
          onClick={(e) => onClickHandler(e)}
        >
          {title}
        </button>
      )}
      {/* {!removeIcon && <IoIosArrowForward />}
       */}
      {!removeIcon && (
        <Image
          src="/img/icon/sidebar-arrow.svg"
          alt="arrow"
          width={10}
          height={10}
          className={s.arrow_icon}
          onClick={(e) => onClickArrowIcon(index, e)}
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      )}
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
