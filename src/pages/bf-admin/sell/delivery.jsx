import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function DeliveryOnSellPage() {
  return (
    <>
      <MetaTitle title="배송 관리" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>DeliveryOnSellPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default DeliveryOnSellPage;
