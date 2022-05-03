import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function SingleItemPage() {
  return (
    <>
      <MetaTitle title="단품 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>SingleItemPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default SingleItemPage;
