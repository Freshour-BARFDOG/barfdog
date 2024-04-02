import React, { useEffect, useRef, useState } from 'react';
import s from './mobileGnb.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { useModalContext } from '/store/modal-context';
import useDeviceState from '/util/hook/useDeviceState';
import { IoIosArrowDown } from 'react-icons/io';
import { useRouter } from 'next/router';
import { general_itemType } from '/store/TYPE/itemType';

const menuNameObj = {
  shop: 'shop',
  community: 'community',
};

export default function MobileGnb() {
  const mcx = useModalContext();

  const deviceState = useDeviceState();
  const [activeMenuId, setActiveMenuId] = useState('홈');
  const [isWideMode, setIsWideMode] = useState(false);
  const deviceWidth = deviceState.deviceWidth;

  const router = useRouter();
  const curPath = router.asPath;
  const curMenuRef = useRef();

  useEffect(() => {
    if (!curMenuRef.current) return;
    currentPageIndicator(curMenuRef.current, curPath, setActiveMenuId);
  }, [curPath]);

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

  useEffect(() => {
    console.log(setActiveMenuId);
  }, []);

  return (
    <>
      <nav className={`${s.mobileNav} mobile`} ref={curMenuRef}>
        <section
          className={`${s['mobile-menu-wrap']} mobile-menu-wrap ${
            deviceWidth < 300 ? s['scroll-container'] : ''
          }`}
        >
          <ul className={`${s['mobile-menu']} `}>
            <li>
              <Link href="/" passHref>
                <a onClick={() => setActiveMenuId('홈')}>
                  <Image
                    src={
                      activeMenuId === '홈'
                        ? '/img/icon/mobile-home-active.svg'
                        : '/img/icon/mobile-home.svg'
                    }
                    alt="home"
                    width={35}
                    height={35}
                  />
                  <MobileMenu
                    title={'홈'}
                    link="/"
                    activeMenuId={activeMenuId}
                  />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/survey" passHref>
                <a onClick={() => setActiveMenuId('AI 추천식단')}>
                  <Image
                    src={
                      activeMenuId === 'AI 추천식단'
                        ? '/img/icon/mobile-subscribe-active.svg'
                        : '/img/icon/mobile-subscribe.svg'
                    }
                    alt="subscribe"
                    width={50}
                    height={150}
                  />
                  <MobileMenu
                    title={'AI 추천식단'}
                    link="/survey"
                    activeMenuId={activeMenuId}
                  />
                </a>
              </Link>
            </li>
            <li>
              {/* <Link href="/survey" passHref> */}
              <a onClick={() => setActiveMenuId('카테고리')}>
                <Image
                  src={
                    activeMenuId === '카테고리'
                      ? '/img/icon/mobile-sidebar.svg'
                      : '/img/icon/mobile-sidebar.svg'
                  }
                  alt="subscribe"
                  width={30}
                  height={30}
                />
                <MobileMenu
                  title={'카테고리'}
                  link="/survey"
                  activeMenuId={activeMenuId}
                />
              </a>
              {/* </Link> */}
            </li>
            <li>
              <Link href={`/shop?itemType=${general_itemType.ALL}`} passHref>
                <a onClick={() => setActiveMenuId('스토어')}>
                  <Image
                    src={
                      activeMenuId === '스토어'
                        ? '/img/icon/mobile-store-active.svg'
                        : '/img/icon/mobile-store.svg'
                    }
                    alt="store"
                    width={35}
                    height={35}
                  />
                  <MobileMenu
                    title={'스토어'}
                    link={`/shop?itemType=${general_itemType.ALL}`}
                    // fakeLink="/shop"
                    // id={menuNameObj.shop}
                    onClick={onActiveSubmenuHandler}
                    activeMenuId={activeMenuId}
                  />
                </a>
              </Link>
            </li>
            <li>
              <Link href={'/mypage'} passHref>
                <a onClick={() => setActiveMenuId('MY')}>
                  <Image
                    src={
                      activeMenuId === 'MY'
                        ? '/img/icon/mobile-mypage-active.svg'
                        : '/img/icon/mobile-mypage.svg'
                    }
                    alt="mypage"
                    width={35}
                    height={35}
                  />

                  <MobileMenu
                    title={'MY'}
                    link="/mypage"
                    // fakeLink="/shop"
                    // id={menuNameObj.shop}
                    onClick={onActiveSubmenuHandler}
                    activeMenuId={activeMenuId}
                  />
                </a>
              </Link>
            </li>
            {/* <MobileMenu title={'레시피'} link={'/recipes'} /> */}
            {/* <MobileMenu
              title={'커뮤니티'}
              fakeLink="/community"
              id={menuNameObj.community}
              onClick={onActiveSubmenuHandler}
            /> */}
            {/* <MobileMenu title={'리뷰'} link="/review" /> */}
          </ul>
        </section>
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
        </section>
      </nav>
    </>
  );
}

const currentPageIndicator = (ref, curPath, setActivemenu) => {
  if (!ref) return;
  const nav = ref;
  const curPathArray = curPath.split('/');
  const curPageDepth1 =
    curPath.indexOf('?') >= 0 ? curPath?.split('?')[0] : curPathArray[1];
  const curPageDepth2 = curPathArray[2];

  const mainMenus = Array.from(
    nav.querySelectorAll(`.mobile-menu-wrap a, .mobile-menu-wrap button`),
  );

  mainMenus.forEach((mainmenu) => {
    const thisMenuId = mainmenu.id;
    const menuPath = mainmenu.pathname || mainmenu.dataset.link;
    if (!menuPath || !curPageDepth1) return;
    if (menuPath.indexOf(curPageDepth1) >= 0) {
      mainmenu.dataset.currentPage = 'depth1';
      if (thisMenuId) setActivemenu(thisMenuId); // - submenu active -> 태그 id가 필요함.
    }
    // // console.log('curPageDepth1',curPageDepth1, 'menuPath',menuPath);
  });

  const subMenus = Array.from(
    nav.querySelectorAll(`.mobile-submenu-wrap a, .mobile-submenu-wrap button`),
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

  useEffect(() => {
    console.log('activeMenuId', activeMenuId);
    console.log('title', title);
  }, []);

  return (
    <li onClick={onClick && onClickHandler}>
      {link ? (
        <Link href={link} passHref>
          <a
            id={id}
            style={{ color: activeMenuId === title ? '#cb1010' : '#535353' }}
          >
            {title}
          </a>
        </Link>
      ) : (
        <button id={id} data-link={fakeLink} type={'button'}>
          {title}
        </button>
      )}
    </li>
  );
};
