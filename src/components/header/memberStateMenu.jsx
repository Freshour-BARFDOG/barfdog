import Link from 'next/link';
import React from 'react';
import s from './header.module.scss';
import useDeviceState from '/util/hook/useDeviceState';
import { openGradePopupHandler } from '/src/pages/popup/gradePolicy';

export const Title = ({ children, link, className }) => {
  return link ? (
    <Link href={link}>
      <a className={`${s.submenu_title} flex-box ${className}`}>{children}</a>
    </Link>
  ) : (
    <p className={`${s.submenu_title} flex-box ${className}`}>{children}</p>
  );
};

// ! [수정] 리뉴얼에서 제외
// 로그인 시 - 성함
export const MemberMemu = ({ data }) => {
  const isAdmin = data.name === '관리자';
  const isMobile = useDeviceState().isMobile;

  return (
    <li>
      {/* {!isAdmin && <button type={'button'} onClick={() => openGradePopupHandler(isMobile)} className={s.userClass}>{data.grade}</button>}
      <Link href={'/mypage/orderHistory'} passHref>
        <a className={s.username}>
          <em>{data.name}</em>님
        </a>
      </Link> */}
    </li>
  );
};

// 비로그인 시 - 로그인 버튼
export const Non_MemberMenu = () => {
  return (
    <>
      <li>
        {/* <Title link={"/account/signup"} className="hover:text-bf-red">회원가입</Title> */}
        {/* <Link className="hover:text-bf-red" href="/account/signup" as="/account/signup">
          회원가입
        </Link> */}
      </li>
      <li className={s.login_btn}>
        <Title link={'/account/login'}>로그인</Title>
        {/* <Link href="/account/login" as="/account/login">
          로그인
        </Link> */}
      </li>
    </>
  );
};
