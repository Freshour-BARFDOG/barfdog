import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function CreateNoticePage() {
  return (
    <>
      <MetaTitle title="공지사항 작성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>CreateNoticePage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreateNoticePage;
