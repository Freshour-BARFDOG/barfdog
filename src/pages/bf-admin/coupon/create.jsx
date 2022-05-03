import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function CreateCouponPage() {
  return (
    <>
      <MetaTitle title="쿠폰 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>CreateCouponPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreateCouponPage;
