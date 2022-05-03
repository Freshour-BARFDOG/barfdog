import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function CancelOnSellPage() {
  return (
    <>
      <MetaTitle title="취소 관리" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>CancelOnSellPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CancelOnSellPage;
