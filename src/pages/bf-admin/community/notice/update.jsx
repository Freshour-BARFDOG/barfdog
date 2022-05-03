import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function UpdateNoticePage() {
  return (
    <>
      <MetaTitle title="공지사항 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>UpdateNoticePage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default UpdateNoticePage;
