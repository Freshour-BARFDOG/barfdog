import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function OrderOnSellPage() {
  return (
    <>
      <MetaTitle title="주문 관리" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>OrderOnSellPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default OrderOnSellPage;
