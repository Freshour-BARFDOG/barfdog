import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";

function MessengerPage() {
  return (
    <>
      <MetaTitle title="메신저" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>MessengerPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default MessengerPage;
