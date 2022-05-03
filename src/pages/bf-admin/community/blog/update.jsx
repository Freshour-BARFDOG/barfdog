import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function UpdateBlogPage() {
  return (
    <>
      <MetaTitle title="블로그 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>UpdateBlogPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default UpdateBlogPage;
