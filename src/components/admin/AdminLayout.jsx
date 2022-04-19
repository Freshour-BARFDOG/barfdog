import React from 'react'
import AdminHeader from "./AdminHeader";
import AdminGnb from "./AdminGnb";
import { AdminBodyWrapper } from './AdminWrapper';

function AdminLayout({children}) {
  return (
    <main id="admin_page">
      <AdminHeader />
      <AdminBodyWrapper>
        <AdminGnb />
        {children} {/* 콘텐츠 영역 */}
      </AdminBodyWrapper>
    </main>
  );
}

export default AdminLayout