import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function ReleaseRewardPage() {
  return (
    <>
      <MetaTitle title="적립금 발행" />
      <AdminLayout>
        <AdminContentWrapper>ReleaseRewardPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ReleaseRewardPage;
