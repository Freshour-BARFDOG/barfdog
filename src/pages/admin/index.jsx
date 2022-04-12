import React from 'react';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';


function index() {
  return (
    <AdminLayout>
      <AdminContentWrapper>
          어드민 인덱스 페이지내용넣기
      </AdminContentWrapper>
    </AdminLayout>
  )
}

export default index