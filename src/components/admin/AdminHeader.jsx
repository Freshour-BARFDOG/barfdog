import React from 'react'
import AdminWrapper from '/src/components/admin/AdminWrapper';
import Image from 'next/image';
import s from "/styles/admin/adminHeader.module.scss";
import Link from 'next/link';

function AdminHeader() {

  const adminName = '관리자'; // * 정적인 이름 필요할 경우 변경
  return (
    <header id={s.admin_header} className={`${s.inner} flex-wrap`}>
      <AdminWrapper>
        <div className={`${s.inner} clearfix`}>
          <div className={s.logo}>
            <Link href="/" passHref>
              <a>
                <Image
                  src={require("/public/img/logo(admin).png")}
                  srcSet={require("/public/img/logo(admin)@2x.png")}
                  alt="어드민 로고"
                  layout="responsive"
                  objectfit="contains"
                  priority
                ></Image>
              </a>
            </Link>
          </div>
          <ul className={s.header_menus}>
            <li className={s.admin_info}>
              <b className={s.admin_name}>{adminName}</b>님 반갑습니다.
            </li>
            <li>
              <button type="button" id="logout" className={s.btn_logout}>
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      </AdminWrapper>
    </header>
  );
}

export default AdminHeader