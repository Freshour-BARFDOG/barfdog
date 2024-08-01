import React, { useEffect, useRef, useState } from 'react';
import s from '/src/components/common/menu.module.scss';
import { IoIosArrowForward } from 'react-icons/io';
import { slideDown, slideUp } from '/util/func/slideToggle';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { authAction } from '/store/auth-slice';
import { arrangeATagByURLPath } from '../../../util/func/arrage/arrangeATagByURLPath';

export default function MypageMenu({ ...props }) {
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(authAction.logout());
  };

  return (
    <nav {...props}>
      <h2 className={s.title}>마이페이지</h2>
      <ul className={s.menu}>
        <List title="주문 내역" link="/mypage/orderHistory" />
        <List title="카드 관리" link="/mypage/card" />
        <List title="구독 관리" link="/mypage/subscribe" />
        <List title="배송 현황" link="/mypage/delivery" />
        <List title="반려견 정보" link="/mypage/dogs" />
        <List title="견주 계정 정보" link="">
          <SubmenuList title="회원정보 변경" link="/mypage/user/info" />
          <SubmenuList
            title="비밀번호 변경"
            link="/mypage/user/changePassword"
          />
          <SubmenuList title="SNS 연동정보" link="/mypage/user/sns" />
        </List>
        <List title="상품 후기" link="/mypage/review" />
        <List title="친구 초대" link="/mypage/invite" />
        <List title="적립금 조회" link="/mypage/reward" />
        <List title="쿠폰함" link="/mypage/coupon" />
        <List title="프로모션" link="/mypage/promotion" />
        <List title="1:1 문의" link="/mypage/inquiry" />
        <List title="로그아웃" onFirstDepthClick={onLogout} />
      </ul>
    </nav>
  );
}

export const SubmenuTitle = ({ title, className }) => {
  return (
    <li className={`${s.submenu_title} ${s[className]}`}>
      <p>{title}</p>
    </li>
  );
};

export const SubmenuList = ({ link, title }) => {
  return (
    <li className={`${s.submenu_list}`}>
      <Link href={link} passHref>
        {title}
      </Link>
    </li>
  );
};

const Submenu = ({ children, dropdownRef, isOpen }) => {
  return (
    <ul ref={dropdownRef} className={`${s.submenu} ${isOpen ? s.open : ''}`}>
      {children}
    </ul>
  );
};

const MenuTitle = ({
  link,
  title,
  curMenuRef,
  onClick,
  iconOnLeftSide,
  iconOnRightSide,
}) => {
  return link ? (
    <Link href={link} passHref>
      <a ref={curMenuRef} onClick={onClick}>
        <span>
          {iconOnLeftSide}
          {title}
        </span>
        {iconOnRightSide || <IoIosArrowForward />}
      </a>
    </Link>
  ) : (
    <p ref={curMenuRef} onClick={onClick}>
      <span>
        {iconOnLeftSide}
        {title}
      </span>
      {iconOnRightSide || <IoIosArrowForward />}
    </p>
  );
};

export const List = ({
  link,
  title,
  children,
  onFirstDepthClick,
  iconOnLeftSide,
  iconOnRightSide,
}) => {
  const router = useRouter();
  const [curPath, setCurPath] = useState(router.pathname);
  const curMenuRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const dropdownRef = useRef();

  useEffect(() => {
    if (!dropdownRef.current || firstRender) return;
    slideUpAndDown(isOpen, dropdownRef.current);
  }, [isOpen, firstRender]);

  useEffect(() => {
    if (!curMenuRef.current) return;
    currentPageIndicator(curMenuRef.current, curPath, setIsOpen);
    setFirstRender(false);
  }, [curPath]);

  const slideUpAndDown = (isSubmenuOpen, targetRef) => {
    isSubmenuOpen ? slideDown(targetRef) : slideUp(targetRef);
  };

  const onClickHandler = (e) => {
    if (dropdownRef.current) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <li className={`${s.menu_title} ${isOpen ? s.open : ''}`}>
      <MenuTitle
        link={link}
        title={title}
        curMenuRef={curMenuRef}
        onClick={onFirstDepthClick || onClickHandler}
        iconOnLeftSide={iconOnLeftSide}
        iconOnRightSide={iconOnRightSide}
      />
      {children && (
        <Submenu dropdownRef={dropdownRef} isOpen={isOpen}>
          {children}
        </Submenu>
      )}
    </li>
  );
};

const currentPageIndicator = (ref, curPath, setThisMenuIsOpenWithDropdown) => {
  if (!ref) return;
  const thisMenu = ref;
  const menuPath = thisMenu.pathname;
  const depth1Path = curPath.indexOf(menuPath) >= 0 && thisMenu;

  const submenuList = Array.from(
    thisMenu
      .closest(`li.${[s.menu_title]}`)
      .querySelectorAll(`ul.${[s.submenu]} a`),
  );

  const depth2Path =
    submenuList.length &&
    submenuList.filter((submenu) => {
      return curPath.indexOf(submenu.pathname) >= 0;
    });

  if (depth1Path) {
    const activeMenu = thisMenu.closest('.' + `${s.menu_title}`);
    activeMenu.dataset.currentPage = true;
  } else if (depth2Path.length) {
    const arrangedDepth2Path = arrangeATagByURLPath(depth2Path, curPath); // submnenu
    arrangedDepth2Path[0].dataset.currentPage = true;
    const menuTitle = arrangedDepth2Path[0].closest('.' + `${s.menu_title}`); // parent menu
    menuTitle.dataset.currentPage = true;

    if (
      setThisMenuIsOpenWithDropdown &&
      typeof setThisMenuIsOpenWithDropdown === 'function'
    ) {
      setThisMenuIsOpenWithDropdown(true);
    }
  }
};
