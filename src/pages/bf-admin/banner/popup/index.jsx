import React, { Component } from "react";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";


// ! ----------------- 메인배너 페이지에서 순서편집 기능 추가한 뒤에 , 작업 시작 --------- ! //
// ! ----------------- 메인배너 페이지에서 순서편집 기능 추가한 뒤에 , 작업 시작 --------- ! //
// ! ----------------- 메인배너 페이지에서 순서편집 기능 추가한 뒤에 , 작업 시작 --------- ! //
// ! ----------------- 메인배너 페이지에서 순서편집 기능 추가한 뒤에 , 작업 시작 --------- ! //
// ! ----------------- 메인배너 페이지에서 순서편집 기능 추가한 뒤에 , 작업 시작 --------- ! //
// ! ----------------- 메인배너 페이지에서 순서편집 기능 추가한 뒤에 , 작업 시작 --------- ! //



function Popup() {
  return (
    <>
      <MetaTitle title="팝업 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>팝업 리스트 페이지</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default Popup;
