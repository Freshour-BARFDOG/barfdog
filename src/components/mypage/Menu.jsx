import React, { useState } from 'react';
import s from "/styles/css/mypage/Menu.module.scss";
import Link from "next/link";
import { IoIosArrowForward  } from "react-icons/io";
import slideToggle from '/util/func/slideToggle';



const SubmenuList = ({ link, title }) => {
  return (
    <li>
      <Link href={link} passHref>
        {title}
      </Link>
    </li>
  );
};


const List = ({link, title, children}) => {
  const [isOpen, setIsOpen] = useState(false);


  const Submenu = children ? (
    <ul className={`${s.submenu} isOpen ? ${s.open} : ""}`}>{children}</ul>
  ) : (
    ""
  );


  const onClickHandler = (e) => {
    const parent = e.currentTarget;
    const submenu = parent.querySelector("ul");
    slideToggle(submenu);
    isOpen ? setIsOpen(false) : setIsOpen(true);
  };
  
  const menuTitle = link ? (
    <Link href={link} passHref>
      <a>
        {title}
        <IoIosArrowForward />
      </a>
    </Link>
  ) : (
    <p className={isOpen ? s.open : ""}>
      {title}
      <IoIosArrowForward />
    </p>
  );


  return (
    <li onClick={onClickHandler}>
      {menuTitle}
      {Submenu}
    </li>
  );
}









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