import Link from 'next/link';
import React from 'react';
import s from './header.module.scss';

export const MemberMemu = ({data}) => {
  const isAdmin = data.name === '관리자';
  return (
    <li>
      {!isAdmin && <span className={s.userClass}>{data.grade}</span>}
      <span className={s.username}>
        <em>{data.name}</em>님
      </span>
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