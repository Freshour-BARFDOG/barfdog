import React, { useEffect, useRef, useState } from 'react';
import s from './mobileGnb.module.scss';
import Link from 'next/link';
import { useModalContext } from '/store/modal-context';
import useDeviceState from '/util/hook/useDeviceState';
import { IoIosArrowDown } from 'react-icons/io';
import { useRouter } from 'next/router';
import {global_itemType} from "/store/TYPE/itemType";


const menuNameObj = {
  shop: 'shop',
  community: 'community',
};

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
      <nav className={`${s.mobileNav} mobile`}  ref={curMenuRef}>
        <section
          className={`${s['mobile-menu-wrap']} ${deviceWidth < 300 ? s['scroll-container'] : ''}`}
        >
          <ul className={`${s['mobile-menu']} `}>
            <MobileMenu title={'정기구독'} fakeLink="/survey" onClick={onShowModal} />
            <MobileMenu title={'샵'} fakeLink="/shop" id={menuNameObj.shop} onClick={onActiveSubmenuHandler} />
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
          className={`${s['mobile-submenu-wrap']} ${activeMenuId ? s.active : ''} ${
            isWideMode ? s.widemode : ''
          } ${deviceWidth < 300 ? s['scroll-container'] : ''}`}
        >
          <ul
            className={`${s['mobile-submenu']} ${activeMenuId === menuNameObj.shop ? s.active : ''}`}
          >
            <MobileMenu title="ALL" link={`/shop?itemType=${global_itemType.ALL}`}  />
            <MobileMenu title="생식" link={`/shop?itemType=${global_itemType.RAW}`} />
            <MobileMenu title="토핑" link={`/shop?itemType=${global_itemType.TOPPING}`} />
            <MobileMenu title="굿즈" link={`/shop?itemType=${global_itemType.GOODS}`} />
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
  const curPageDepth1 = curPathArray[1];
  const curPageDepth2 = curPathArray[2];

  const menuList = Array.from(nav.querySelectorAll('a, button'));
  menuList.forEach((thisMenu)=>{
    const menuPath = thisMenu.pathname || thisMenu.dataset.link;
    if (!menuPath) return;
    const menuQuery = thisMenu.search?.replace(/\?/g, "");
    const thisMenuId = thisMenu.id;


    menuPath.split('/').forEach((thisMenuPath, index)=>{
      const depth1 = index === 1;
      const depth2 = index === 2;
      // DEPTH 1
      if(depth1 && curPageDepth1.indexOf(thisMenuPath) >= 0){
        thisMenu.dataset.currentPage = 'depth1';
        if(thisMenuId) setActivemenu(thisMenuId) // - submenu active -> 태그 id가 필요함.

        // DEPTH 2: with query
        const hasMenuQuery = curPageDepth1.indexOf('?') >= 0;
        if(hasMenuQuery && menuQuery){
          thisMenu.dataset.currentPage = curPageDepth1.indexOf(menuQuery)>= 0 && 'depth2';
        }
      }
      // DEPTH 2
      if(depth2){
        thisMenu.dataset.currentPage = thisMenuPath === curPageDepth2 && 'depth2';

      }

    })
  })

};


const MobileMenu = ({ onClick, link, fakeLink, id, title }) => {

  const onClickHandler = () => {
    if (onClick && typeof onClick === 'function') {
      onClick(id);
    }
  };
  return (
    <li onClick={onClick && onClickHandler}>
      {link ? (
        <Link href={link} passHref>
          <a id={id} >{title}</a>
        </Link>
      ) : (
        <button id={id}  data-link={fakeLink} type={'button'}>
          {title}
        </button>
      )}
    </li>
  );
};
