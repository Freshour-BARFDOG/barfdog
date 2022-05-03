import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function RecipePage() {
  return (
    <>
      <MetaTitle title="레시피 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>RecipePage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default RecipePage;
