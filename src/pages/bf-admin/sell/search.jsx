import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function SearchOnSellPage() {
  return (
    <>
      <MetaTitle title="주문 통합검색" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>SearchOnSellPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default SearchOnSellPage;
