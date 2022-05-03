import React from 'react';
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";


function CouponListPage() {
  return (
    <>
      <MetaTitle title="쿠폰 조회" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>CouponListPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CouponListPage;