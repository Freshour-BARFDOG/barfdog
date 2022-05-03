import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function NoticePage() {
  return (
    <>
      <MetaTitle title="공지사항 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>NoticePage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default NoticePage;
