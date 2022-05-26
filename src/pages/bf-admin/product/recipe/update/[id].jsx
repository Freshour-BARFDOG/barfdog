import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function UpdateRecipePage() {
  return (
    <>
      <MetaTitle title="레시피 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>UpdateRecipePage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default UpdateRecipePage;
