import Link from 'next/link';
import React from 'react';
import s from './header.module.scss';
import useDeviceState from '/util/hook/useDeviceState';
import popupWindow from '/util/func/popupWindow';

export const MemberMemu = ({ data }) => {
  const isAdmin = data.name === '관리자';
  const isMobile = useDeviceState().isMobile;
  
  const openGradePopupHandler = () => {
    const href = '/popup/gradePolicy';
    const options = {
      width: isMobile ? 320 : 1120,
      height: isMobile ? 517 : 730,
      left: 200,
      top: 100
    };
    popupWindow(href, options);
  };

  return (
    <li>
      {!isAdmin && <button type={'button'} onClick={openGradePopupHandler} className={s.userClass}>{data.grade}</button>}
      <Link href={'/mypage/orderHistory'} passHref>
        <a className={s.username}>
          <em>{data.name}</em>님
        </a>
      </Link>
    </li>
  );
};

export const Non_MemberMenu = () => {
  return (
    <>
      <li>
        <Link href="/account/signup" as="/account/signup">
          회원가입
        </Link>
      </li>
      <li>
        <Link href="/account/login" as="/account/login">
          로그인
        </Link>
      </li>
    </>
  );
};
