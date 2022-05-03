import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function CreateBlogPage() {
  return (
    <>
      <MetaTitle title="블로그 작성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>CreateBlogPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreateBlogPage;
