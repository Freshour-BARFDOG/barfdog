import React from "react";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";

function LineBanner() {
  return (
    <>
      <MetaTitle title="최상단 띠 배너 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>띠 배너 페이지</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default LineBanner;
