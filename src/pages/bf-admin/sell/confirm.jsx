import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function ConfirmOnSellPage() {
  return (
    <>
      <MetaTitle title="구매 확정" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>ConfirmOnSellPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ConfirmOnSellPage;
