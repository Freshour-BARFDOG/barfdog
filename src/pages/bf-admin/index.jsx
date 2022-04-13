import React from 'react';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';


function index() {
  return (
    <AdminLayout >
      <AdminContentWrapper>
          DashBoard 페이지
      </AdminContentWrapper>
    </AdminLayout>
  )
}

export default index