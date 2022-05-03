import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function CreateSingleItemPage() {
  return (
    <>
      <MetaTitle title="단품 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>CreateSingleItemPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreateSingleItemPage;
