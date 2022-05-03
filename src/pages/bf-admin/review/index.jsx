import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function RewardPage() {
  return (
    <>
      <MetaTitle title="리뷰 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>RewardPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default RewardPage;
