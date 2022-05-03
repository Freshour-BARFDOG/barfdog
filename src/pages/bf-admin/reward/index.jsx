import React from 'react';
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";


function RewardListPage() {
  return (
        <>
      <MetaTitle title='적립금 조회' />
      <AdminLayout>
        <AdminContentWrapper>RewardListPage</AdminContentWrapper>
      </AdminLayout>
    </>
  )
}

export default RewardListPage;