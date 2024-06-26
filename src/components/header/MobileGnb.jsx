import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from './mobileGnb.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { useModalContext } from '/store/modal-context';
import useDeviceState from '/util/hook/useDeviceState';
import { IoIosArrowDown } from 'react-icons/io';
import { useRouter } from 'next/router';
import { general_itemType } from '/store/TYPE/itemType';
import MobileSidr from './MobileSidr';

const menuNameObj = {
  shop: 'shop',
  community: 'community',
};

export default function MobileGnb() {
  const auth = useSelector((state) => state.auth);
  const userData = auth.userInfo;

  const mcx = useModalContext();

  const deviceState = useDeviceState();
  const [activeMenuId, setActiveMenuId] = useState('');
  const [isWideMode, setIsWideMode] = useState(false);
  const [isSidrOpen, setIsSidrOpen] = useState(false);
  const deviceWidth = deviceState.deviceWidth;

  const router = useRouter();
  const curPath = router.asPath;
  const curMenuRef = useRef();

  const onActiveSubmenuHandler = (menuId) => {
    if (menuId) {
      setActiveMenuId(menuId);
    }
  };

  const onShowModal = () => {
    mcx.subscribe.onShow();
    mcx.event.setScrollY();
  };

  const onMenuWideMode = (e) => {
    setIsWideMode(!isWideMode);
  };

  const currentPageIndicator = (ref, curPath, setActivemenu) => {
    if (!ref) return;
    const nav = ref;
    const curPathArray = curPath.split('/');

    // '?' 앞에가 curPageDepth1 인데,
    // '/' 포함되어 있으면 제거
    const curPageDepth1 =
      curPath.indexOf('?') >= 0
        ? curPath?.split('?')[0].includes('/')
          ? curPath?.split('?')[0].replace('/', '')
          : curPath?.split('?')[0]
        : curPathArray[1];

    const curPageDepth2 = curPathArray[2];

    setActiveMenuId(curPageDepth1);

    const mainMenus = Array.from(
      nav.querySelectorAll(`.mobile-menu-wrap a, .mobile-menu-wrap button`),
    );

    mainMenus.forEach((mainmenu) => {
      const thisMenuId = mainmenu.id;
      const menuPath = mainmenu.pathname || mainmenu.dataset.link;
      if (!menuPath || !curPageDepth1) return;

      // console.log('thisMenuId', thisMenuId);
      // console.log('mainmenu', mainmenu);
      // console.log('curPageDepth1', curPageDepth1);

      if (menuPath.indexOf(curPageDepth1) >= 0) {
        mainmenu.dataset.currentPage = 'depth1';
        if (thisMenuId) setActivemenu(thisMenuId); // - submenu active -> 태그 id가 필요함.
      }
      // // console.log('curPageDepth1',curPageDepth1, 'menuPath',menuPath);
    });

    const subMenus = Array.from(
      nav.querySelectorAll(
        `.mobile-submenu-wrap a, .mobile-submenu-wrap button`,
      ),
    );
    subMenus.forEach((submenu) => {
      const menuPath = submenu.pathname || submenu.dataset.link;
      if (!menuPath && curPathArray) return;
      // // console.log(menuPath)
      // // console.log(curPageDepth2)
      submenu.dataset.currentPage =
        menuPath.indexOf(curPageDepth2) >= 0 && 'depth2';

      if (curPath.indexOf('/shop') >= 0) {
        const keyword = 'itemType=';
        let submenuSearch = submenu.search.split(keyword)[1];
        let curUrlSearch = window.location.search.split(keyword)[1];
        if (curUrlSearch?.indexOf('&') >= 0) {
          submenuSearch = curUrlSearch?.split('&')[0];
          curUrlSearch = curUrlSearch?.split('&')[0];
        }
        submenu.dataset.currentPage =
          curUrlSearch?.indexOf(submenuSearch) >= 0 && 'depth2';
      }
    });
  };

  useEffect(() => {
    if (!curMenuRef.current) return;
    currentPageIndicator(curMenuRef.current, curPath, setActiveMenuId);
  }, [curPath]);

  // useEffect(() => {
  //   console.log('activeMenuId >>>', activeMenuId);
  //   console.log(curPath);
  // }, [activeMenuId]);

  const onShowMobileSideMenu = (activeMenuId) => {
    setActiveMenuId(activeMenuId);
    setIsSidrOpen(!isSidrOpen);
  };

  const onActiveMenuId = (menuId) => {
    isSidrOpen && setIsSidrOpen(false);
    setActiveMenuId(menuId);
  };

  return (
    <>
      {/* [수정] mobile 클래스명 제거 - 모바일 600이 아닌, 1080 미만부터 보이게 변경 */}
      {/* <nav className={`${s.mobileNav} mobile`} ref={curMenuRef}> */}
      <nav className={`${s.mobileNav}`} ref={curMenuRef}>
        <section
          className={`${s['mobile-menu-wrap']} mobile-menu-wrap ${
            deviceWidth < 300 ? s['scroll-container'] : ''
          }`}
        >
          <ul className={`${s['mobile-menu']} `}>
            <li>
              <Link href="/" passHref>
                <a onClick={() => onActiveMenuId('홈')}>
                  <Image
                    src={
                      !isSidrOpen && (curPath === '/' || activeMenuId === '홈')
                        ? '/img/icon/home-active.jpg'
                        : '/img/icon/home.jpg'
                    }
                    alt="home"
                    width={35}
                    height={35}
                    style={{ fill: 'red' }}
                  />
                  <span
                    style={{
                      color:
                        !isSidrOpen &&
                        (curPath === '/' || activeMenuId === '홈')
                          ? '#be1a21'
                          : '#000',
                    }}
                  >
                    홈
                  </span>
                </a>
              </Link>
            </li>
            <li>
              <Link href={`/shop?itemType=${general_itemType.ALL}`} passHref>
                <a onClick={() => onActiveMenuId('스토어')}>
                  <Image
                    src={
                      !isSidrOpen &&
                      (activeMenuId === 'shop' ||
                        activeMenuId === '스토어' ||
                        curPath.startsWith('/shop'))
                        ? '/img/icon/store-active.jpg'
                        : '/img/icon/store.jpg'
                    }
                    alt="store"
                    width={35}
                    height={35}
                  />
                  <span
                    style={{
                      color:
                        !isSidrOpen &&
                        (activeMenuId === 'shop' ||
                          activeMenuId === '스토어' ||
                          curPath.startsWith('/shop'))
                          ? '#be1a21'
                          : '#000',
                    }}
                  >
                    스토어
                  </span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/surveyGuide" passHref>
                <a onClick={() => onActiveMenuId('surveyGuide')}>
                  <Image
                    src={
                      !isSidrOpen &&
                      (activeMenuId === 'surveyGuide' ||
                        activeMenuId === 'survey' ||
                        curPath === '/surveyGuide' ||
                        curPath === '/survey')
                        ? '/img/icon/ai-active.jpg'
                        : '/img/icon/ai.jpg'
                    }
                    alt="c"
                    width={40}
                    height={40}
                  />

                  <span
                    style={{
                      color:
                        !isSidrOpen &&
                        (activeMenuId === 'surveyGuide' ||
                          activeMenuId === 'survey' ||
                          curPath === '/surveyGuide' ||
                          curPath === '/survey')
                          ? '#be1a21'
                          : '#000',
                    }}
                  >
                    AI 추천 식단
                  </span>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/surveyGuide" passHref>
                <a onClick={() => onActiveMenuId('note')}>
                  <Image
                    src={
                      isSidrOpen
                        ? '/img/icon/note-active.jpg'
                        : '/img/icon/note.jpg'
                    }
                    alt="subscribe"
                    width={36}
                    height={36}
                  />
                  <span
                    style={{
                      color:
                        !isSidrOpen &&
                        (activeMenuId === 'surveyGuide' ||
                          activeMenuId === 'survey' ||
                          curPath === '/surveyGuide' ||
                          curPath === '/survey')
                          ? // ? '#be1a21'
                            '#000'
                          : '#000',
                    }}
                  >
                    건강수첩
                  </span>
                </a>
              </Link>
            </li>

            {/* 비로그인 > 로그인 페이지 */}
            {/* 로그인 > 마이 페이지 */}
            {/* <li>
         
              <Link
                href={userData ? '/mypage/orderHistory' : '/account/login'}
                passHref
              >
                <a
                  onClick={() =>
                    onActiveMenuId(userData ? 'mypage' : 'account')
                  }
                >
                  <Image
                    src={
                      !isSidrOpen &&
                      (activeMenuId === 'mypage' ||
                        curPath === '/mypage/orderHistory')
                        ? '/img/icon/mobile-mypage-active.svg'
                        : '/img/icon/mobile-mypage.svg'
                    }
                    alt="mypage"
                    width={35}
                    height={35}
                  />

                  <MobileMenu
                    title={'진단'}
                    link={userData ? '/mypage/orderHistory' : '/account/login'}
                    onClick={onActiveSubmenuHandler}
                    activeMenuId={activeMenuId}
                    color={
                      !isSidrOpen &&
                      (activeMenuId === 'mypage' ||
                        curPath === '/mypage/orderHistory')
                        ? true
                        : false
                    }
                  />
                </a>
              </Link>
            </li> */}

            {/* <MobileMenu
              title={'커뮤니티'}
              fakeLink="/community"
              id={menuNameObj.community}
              onClick={onActiveSubmenuHandler}
            /> */}
            {/* <MobileMenu title={'리뷰'} link="/review" /> */}
          </ul>
        </section>
        {/* 모바일 - 사이드바  */}
        {/* {isSidrOpen && (
          <MobileSidr isOpen={isSidrOpen} setSidrOpen={setIsSidrOpen} />
        )}
        <section
          className={`${s['mobile-submenu-wrap']} mobile-submenu-wrap ${
            activeMenuId ? s.active : ''
          } ${isWideMode ? s.widemode : ''} ${
            deviceWidth < 300 ? s['scroll-container'] : ''
          }`}
        >
          <ul
            className={`${s['mobile-submenu']}  ${
              activeMenuId === menuNameObj.shop ? s.active : ''
            }`}
          >
            <MobileMenu
              title="ALL"
              link={`/shop?itemType=${general_itemType.ALL}`}
            />
            <MobileMenu
              title="생식"
              link={`/shop?itemType=${general_itemType.RAW}`}
            />
            <MobileMenu
              title="토핑"
              link={`/shop?itemType=${general_itemType.TOPPING}`}
            />
            <MobileMenu
              title="굿즈"
              link={`/shop?itemType=${general_itemType.GOODS}`}
            />
          </ul>
          <ul
            className={`${s['mobile-submenu']} ${
              activeMenuId === menuNameObj.community ? s.active : ''
            }`}
          >
            <MobileMenu title="공지사항" link="/community/notice" />
            <MobileMenu title="이벤트" link="/community/event" />
            <MobileMenu title="블로그" link="/community/blog" />
            <MobileMenu title="어바웃" link="/community/about" />
          </ul>
          <button className={s.activeWidemodeButton} onClick={onMenuWideMode}>
            <IoIosArrowDown />
          </button>
        </section> */}
      </nav>
    </>
  );
}

const MobileMenu = ({
  onClick,
  link,
  fakeLink,
  id,
  title,
  color,
  activeMenuId,
}) => {
  const onClickHandler = () => {
    if (onClick && typeof onClick === 'function') {
      onClick(id);
    }
  };

  // useEffect(() => {
  //   console.log('activeMenuId >>>>', activeMenuId);
  //   console.log('title >>>>', title);
  //   console.log('color >>>>', color);
  // }, []);

  return (
    <li onClick={onClick && onClickHandler}>
      {link ? (
        <Link href={link} passHref>
          <a
            id={id}
            style={{
              color: activeMenuId === title || color ? '#cb1010' : '#535353',
            }}
          >
            {title}
          </a>
        </Link>
      ) : (
        <button
          id={id}
          data-link={fakeLink}
          type={'button'}
          style={{
            color: activeMenuId === title || color ? '#cb1010' : '#535353',
          }}
        >
          {title}
        </button>
      )}
    </li>
  );
};
