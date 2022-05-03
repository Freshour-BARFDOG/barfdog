import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function EventPage() {
  return (
    <>
      <MetaTitle title="이벤트 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>EventPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default EventPage;
