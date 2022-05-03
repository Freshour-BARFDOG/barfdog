import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function BestReviewPage() {
  return (
    <>
      <MetaTitle title="베스트 리뷰" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>BestReviewPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default BestReviewPage;
