import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function ReleaseCouponPage() {
  return (
    <>
      <MetaTitle title="쿠폰 발행" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>ReleaseCouponPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ReleaseCouponPage;
