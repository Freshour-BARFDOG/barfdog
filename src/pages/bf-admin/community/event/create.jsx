import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function CreateEventPage() {
  return (
    <>
      <MetaTitle title="이벤트 작성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>CreateEventPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreateEventPage;
