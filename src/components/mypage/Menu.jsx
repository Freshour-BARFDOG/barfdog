import React, { useState, useEffect, useRef } from "react";
import s from "/styles/css/mypage/menu.module.scss";
import { IoIosArrowForward  } from "react-icons/io";
import { slideUp , slideDown } from "/util/func/slideToggle";
import Link from "next/link";
import siblings from "/util/func/siblings";



export const SubmenuTitle = ({ title, className }) => {
  return (
    <li className={`${s.submenu_title} ${s[className]}`}>
      <p>{title}</p>
    </li>
  );
};


export const SubmenuList = ({ link, title, className }) => {
  return (
    <li className={`${s.submenu_list} ${s[className]}`}>
      <Link href={link} passHref>
        {title}
      </Link>
    </li>
  );
};








export const List = ({ link, title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);
  const menuListRef = useRef(null);

  const onClickHandler = (e) => {
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };

  useEffect((e) => {
    if (!dropdownRef.current) return;
    isOpen ? slideDown(dropdownRef.current) : slideUp(dropdownRef.current);

    // * 메뉴 열었을 경우, 다른 메뉴는 닫히게 하는 기능 => 추후 업데이트
    // if(isOpen){
    //   slideDown(dropdownRef.current);
    //   const siblingsParent = siblings(menuListRef.current);
    //   siblingsParent.forEach((parent) => {
    //     const sibMenu = parent.querySelector("ul");
    //     if (sibMenu) {
    //       slideUp(sibMenu);
    //     }
    //   });
    // }else{
    //   slideUp(dropdownRef.current);
    // }
  }, [isOpen]);



 
  const menuTitle = link ? (
    <Link href={link} passHref>
      <a>
        {title}
        <IoIosArrowForward />
      </a>
    </Link>
  ) : (
    <p>
      {title}
      <IoIosArrowForward />
    </p>
  );

  const Submenu = children ? (
    <ul ref={dropdownRef} className={`${s.submenu} ${isOpen ? s.open : ''}`}>
      {children}{" "}
    </ul>
  ) : (
    ""
  );

  return (
    <li
      ref={menuListRef}
      onClick={onClickHandler}
      className={isOpen ? s.open : null}
    >
      {menuTitle}
      {Submenu}
    </li>
  );
};













function Menu({...props }) {

  return (
    <nav {...props}>
      <h2 className={s.title}>
        마이페이지
      </h2>
      <ul className={s.menu}>
        <List title="주문 내역" link="/mypage/order-history" />
        <List title="카드 관리" link="/mypage/card" />
        <List title="구독 관리" link="/mypage/subscribe" />
        <List title="배송 현황" link="/mypage/delivery" />
        <List title="반려견 정보" link="/mypage/dogs" />
        <List title="견주 계정 정보" link="">
          <SubmenuList title="회원정보 변경" link="/mypage/edit/user-info" />
          <SubmenuList title="비밀번호 변경" link="/mypage/edit/user-pw" />
          <SubmenuList title="SNS 연동" link="/mypage/edit/sns-connect" />
        </List>
        <List title="상품 후기" link="/mypage/review" />
        <List title="친구 초대" link="/mypage/invite" />
        <List title="적립금 조회" link="/mypage/point" />
        <List title="로그아웃" link="/logout" />
      </ul>
    </nav>
  );
}

export default Menu;