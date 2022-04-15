import Link from 'next/link';
import React from 'react';
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import s from "/styles/admin/adminCommon.module.scss";
function MainBannerindex() {
  return (
    <AdminLayout>
      <AdminContentWrapper>
        <div className={s.cont_header}>
          <h1 className={s.title}>메인배너</h1>
          <h1 className={s.btn}>메인배너</h1>
        </div>
        <Link
          href="/bf-admin/banner/main-banner/createMainBannerPage"
          as="/bf-admin/banner/main-banner/create"
          passHref
        >
          <a href="">
            <button type="button">배너등록</button>
          </a>
        </Link>
        <div className="cont_body">

        </div>
        메인배너 리스트 페이지
        <br />
        메인배너 리스트 페이지
        <br />
        메인배너 리스트 페이지
        <br />
        메인배너 리스트 페이지
        <br />
        메인배너 리스트 페이지
        <br />
      </AdminContentWrapper>
    </AdminLayout>
  );
}

export default MainBannerindex;