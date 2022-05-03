import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function ExchangeOnSellPage() {
  return (
    <>
      <MetaTitle title="교환 관리" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>ExchangeOnSellPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ExchangeOnSellPage;
