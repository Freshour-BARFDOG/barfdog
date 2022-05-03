import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function BlogPage() {
  return (
    <>
      <MetaTitle title="블로그 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>BlogPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default BlogPage;
