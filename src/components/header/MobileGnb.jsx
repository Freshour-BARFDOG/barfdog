import React, { useEffect, useRef, useState } from 'react';
import s from './mobileGnb.module.scss';
import Link from 'next/link';
import { useModalContext } from '/store/modal-context';
import useDeviceState from '/util/hook/useDeviceState';
import { IoIosArrowDown } from 'react-icons/io';
import { useRouter } from 'next/router';
import { itemTypeOption } from '/store/TYPE/itemType';

const menuNameObj = {
  shop: 'shop',
  community: 'community',
};

const communityOptions = [
  {
    label: '공지사항',
    value: '/community/notice'
  },
  {
    label: '이벤트',
    value: '/community/event'
  },
  {
    label: '블로그',
    value: '/community/blog'
  },
  {
    label: '어바웃',
    value: '/community/about'
  },
]

export default function MobileGnb() {
  const mcx = useModalContext();

  const deviceState = useDeviceState();
  const [activeMenuId, setActiveMenuId] = useState('');
  const [isWideMode, setIsWideMode] = useState(false);
  const deviceWidth = deviceState.deviceWidth;

  const router = useRouter();
  const curPath = router.asPath;
  const curMenuRef = useRef();

  useEffect(() => {
    if (!curMenuRef.current) return;
    currentPageIndicator(curMenuRef.current, curPath, setActiveMenuId);
  }, [curPath]);

  const itemType = router.query.itemType;

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

  return (
    <>
      <nav className={`${s.mobileNav} mobile`} ref={curMenuRef}>
        <section
          className={`${s['mobile-menu-wrap']} mobile-menu-wrap ${
            deviceWidth < 300 ? s['scroll-container'] : ''
          }`}
        >
          <ul className={`${s['mobile-menu']} `}>
            <MobileMenu
              title={'정기구독'}
              fakeLink="/survey"
              onClick={onShowModal}
              className={'mobile-menu-survey-btn'}
            />
            <MobileMenu
              title={'샵'}
              fakeLink="/shop"
              id={menuNameObj.shop}
              onClick={onActiveSubmenuHandler}
            />
            <MobileMenu title={'레시피'} link={'/recipes'} />
            <MobileMenu
              title={'커뮤니티'}
              fakeLink="/community"
              id={menuNameObj.community}
              onClick={onActiveSubmenuHandler}
            />
            <MobileMenu title={'리뷰'} link="/review" />
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
            {itemTypeOption.map(option => (
              <MobileMenu
                key={option.value}
                title={option.label}
                id={option.value}
                link={`/shop?itemType=${option.value}`}
                activeValue={itemType}
              />
            ))}
          </ul>
          <ul
            className={`${s['mobile-submenu']} ${
              activeMenuId === menuNameObj.community ? s.active : ''
            }`}
          >
            {communityOptions.map(option => (
              <MobileMenu
                key={option.value}
                title={option.label}
                id={option.value}
                link={option.value}
                activeValue={router.pathname}
              />
            ))}
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

const MobileMenu = ({ onClick, link, fakeLink, id, title, className, activeValue }) => {
  const onClickHandler = () => {
    if (onClick && typeof onClick === 'function') {
      onClick(id);
    }
  };
  return (
    <li onClick={onClick && onClickHandler} className={activeValue === id ? s.active : ''}>
      {link ? (
        <Link href={link} passHref>
          <a id={id}>{title}</a>
        </Link>
      ) : (
        <button
          className={className}
          id={id}
          data-link={fakeLink}
          type={'button'}
        >
          {title}
        </button>
      )}
    </li>
  );
};
