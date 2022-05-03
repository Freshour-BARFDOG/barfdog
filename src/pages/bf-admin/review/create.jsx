import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function CreateRewardPage() {
  return (
    <>
      <MetaTitle title="리뷰 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>CreateRewardPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreateRewardPage;
