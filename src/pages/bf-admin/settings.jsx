import React from 'react';
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";


function Settings() {
  return (
    <>
      <MetaTitle title="사이트 설정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>Settings</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default Settings;