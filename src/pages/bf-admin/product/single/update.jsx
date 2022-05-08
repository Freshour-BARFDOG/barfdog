import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";


function UpdateSingleItemPage() {

  
  return (
    <>
      <MetaTitle title="단품 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>UpdateSingleItemPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default UpdateSingleItemPage;
