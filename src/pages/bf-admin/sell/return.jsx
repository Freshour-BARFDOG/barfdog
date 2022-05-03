import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function ReturnOnSellPage() {
  return (
    <>
      <MetaTitle title="반품 관리" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>ReturnOnSellPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ReturnOnSellPage;
