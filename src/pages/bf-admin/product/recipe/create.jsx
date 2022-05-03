import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function CreateRecipePage() {
  return (
    <>
      <MetaTitle title="레시피 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>CreateRecipePage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreateRecipePage;
