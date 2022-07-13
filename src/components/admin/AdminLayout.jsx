import React from 'react'
import AdminHeader from "./AdminHeader";
import AdminGnb from "./AdminGnb";
import { AdminBodyWrapper } from './AdminWrapper';
import {useSelector} from "react-redux";

function AdminLayout({children}) {
  const isFoldMenu = useSelector(state=> state.userState.foldMenu);
  return (
    <main id="admin_page">
      <AdminHeader folded={isFoldMenu} />
      <AdminBodyWrapper folded={isFoldMenu}>
        <AdminGnb />
        {children} {/* 콘텐츠 영역 */}
      </AdminBodyWrapper>
    </main>
  );
}

export default AdminLayout