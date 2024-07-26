import React, { useEffect, useRef, useState } from 'react';
import s from '/src/components/common/menu.module.scss';
import { IoIosArrowForward } from 'react-icons/io';
import { slideDown, slideUp } from '/util/func/slideToggle';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { authAction } from '/store/auth-slice';
import { arrangeATagByURLPath } from '../../../util/func/arrage/arrangeATagByURLPath';
import Image from 'next/image';

export default function BottomMenu({ ...props }) {
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(authAction.logout());
  };

  return (
    <>
      <ul className={s.menu}>
        <List
          title="주문 내역"
          link="/mypage/orderHistory"
          src="/img/mypage/menu_order.png"
          alt="menu_order"
        />
        <List
          title="쿠폰함"
          link="/mypage/coupon"
          src="/img/mypage/menu_coupon.png"
          alt="menu_coupon"
        />
        <List
          title="적립금"
          link="/mypage/reward"
          src="/img/mypage/menu_reward.png"
          alt="menu_order"
        />
        <List
          title="카드 관리"
          link="/mypage/card"
          src="/img/mypage/menu_card.png"
          alt="menu_card"
        />
        <List
          title="친구 초대"
          link="/mypage/invite"
          src="/img/mypage/menu_invite.png"
          alt="menu_invite"
        />
        <List
          title="리뷰"
          link="/mypage/review"
          src="/img/mypage/menu_review.png"
          alt="menu_review"
        />

        {/* ! [삭제예정] */}
        {/* <List
        title="구독 관리"
        link="/mypage/subscribe"
        src="/img/mypage/menu_order.png"
        alt="menu_order"
      /> */}
        {/* <List
        title="배송 현황"
        link="/mypage/delivery"
        src="/img/mypage/menu_order.png"
        alt="menu_order"
      /> */}
        {/* <List
        title="반려견 정보"
        link="/mypage/dogs"
        src="/img/mypage/menu_order.png"
        alt="menu_order"
      /> */}

        {/* <List
        title="프로모션"
        link="/mypage/promotion"
        src="/img/mypage/menu_order.png"
        alt="menu_order"
      /> */}
        {/* <List
        title="1:1 문의"
        link="/mypage/inquiry"
        src="/img/mypage/menu_order.png"
        alt="menu_order"
      /> */}
      </ul>
      <ul className={s.sub_menu}>
        <List title="전 성분 보기" link="/recipes" />
        <List title="계정 정보" link="/mypage/user" textAlign="right" />
        <List title="로그아웃" onFirstDepthClick={onLogout} textAlign="right" />
      </ul>
    </>
  );
}

const MenuTitle = ({
  link,
  title,
  curMenuRef,
  onClick,
  iconOnLeftSide,
  iconOnRightSide,
  src,
  alt,
  textAlign,
}) => {
  return src ? (
    <Link href={link} passHref>
      <a ref={curMenuRef} onClick={onClick}>
        <Image
          src={src}
          alt={alt}
          width={80}
          height={80}
          style={{ cursor: 'pointer' }}
        />
        <span>
          {iconOnLeftSide}
          {title}
        </span>
      </a>
    </Link>
  ) : link ? (
    <Link href={link} passHref>
      <a ref={curMenuRef} onClick={onClick}>
        <span style={{ textAlign: textAlign }}>
          {iconOnLeftSide}
          {title}
        </span>
      </a>
    </Link>
  ) : (
    <p
      ref={curMenuRef}
      onClick={onClick}
      style={{ textAlign: textAlign, cursor: 'pointer' }}
    >
      <span>
        {iconOnLeftSide}
        {title}
      </span>
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
  src,
  alt,
  textAlign,
}) => {
  const router = useRouter();
  const [curPath, setCurPath] = useState(router.pathname);
  const curMenuRef = useRef();

  // const [isOpen, setIsOpen] = useState(false);
  // const [firstRender, setFirstRender] = useState(true);
  // const dropdownRef = useRef();

  // useEffect(() => {
  //   if (!dropdownRef.current || firstRender) return;
  //   slideUpAndDown(isOpen, dropdownRef.current);
  // }, [isOpen, firstRender]);

  // useEffect(() => {
  //   if (!curMenuRef.current) return;
  //   currentPageIndicator(curMenuRef.current, curPath, setIsOpen);
  //   setFirstRender(false);
  // }, [curPath]);

  // const slideUpAndDown = (isSubmenuOpen, targetRef) => {
  //   isSubmenuOpen ? slideDown(targetRef) : slideUp(targetRef);
  // };

  // const onClickHandler = (e) => {
  //   if (dropdownRef.current) {
  //     setIsOpen(!isOpen);
  //   }
  // };

  return (
    <li className={`${s.menu_title}`}>
      <MenuTitle
        link={link}
        title={title}
        curMenuRef={curMenuRef}
        onClick={onFirstDepthClick}
        iconOnLeftSide={iconOnLeftSide}
        iconOnRightSide={iconOnRightSide}
        src={src}
        alt={alt}
        textAlign={textAlign}
      />
    </li>
  );
};

// const currentPageIndicator = (ref, curPath, setThisMenuIsOpenWithDropdown) => {
//   if (!ref) return;
//   const thisMenu = ref;
//   const menuPath = thisMenu.pathname;
//   const depth1Path = curPath.indexOf(menuPath) >= 0 && thisMenu;

//   const submenuList = Array.from(
//     thisMenu
//       .closest(`li.${[s.menu_title]}`)
//       .querySelectorAll(`ul.${[s.submenu]} a`),
//   );

//   const depth2Path =
//     submenuList.length &&
//     submenuList.filter((submenu) => {
//       return curPath.indexOf(submenu.pathname) >= 0;
//     });

//   if (depth1Path) {
//     const activeMenu = thisMenu.closest('.' + `${s.menu_title}`);
//     activeMenu.dataset.currentPage = true;
//   } else if (depth2Path.length) {
//     const arrangedDepth2Path = arrangeATagByURLPath(depth2Path, curPath); // submnenu
//     arrangedDepth2Path[0].dataset.currentPage = true;
//     const menuTitle = arrangedDepth2Path[0].closest('.' + `${s.menu_title}`); // parent menu
//     menuTitle.dataset.currentPage = true;

//     if (
//       setThisMenuIsOpenWithDropdown &&
//       typeof setThisMenuIsOpenWithDropdown === 'function'
//     ) {
//       setThisMenuIsOpenWithDropdown(true);
//     }
//   }
// };
