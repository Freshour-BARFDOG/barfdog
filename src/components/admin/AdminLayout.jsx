import React, {useState} from 'react'
import AdminHeader from "./AdminHeader";
import AdminGnb from "./AdminGnb";
import { AdminBodyWrapper } from './AdminWrapper';

function AdminLayout({children}) {
  const [folded, setFolded] = useState( false );
  return (
    <main id="admin_page">
      <AdminHeader setFolded={setFolded} />
      <AdminBodyWrapper folded={folded}>
        <AdminGnb />
        {children} {/* 콘텐츠 영역 */}
      </AdminBodyWrapper>
    </main>
  );
}

export default AdminLayout