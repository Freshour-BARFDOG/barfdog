import React from "react";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";

function UpdatePopup() {
  return (
    <>
      <MetaTitle title="팝업 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>팝업 리스트 페이지</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default UpdatePopup;
