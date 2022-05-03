import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function UpdateEventPage() {
  return (
    <>
      <MetaTitle title="이벤트 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>UpdateEventPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default UpdateEventPage;
