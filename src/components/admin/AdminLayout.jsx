import React from 'react'
import AdminHeader from "./AdminHeader";
import AdminGnb from "./AdminGnb";
import {AdminBodyWrapper} from './AdminWrapper';
import {useAdminMenuState} from "@util/hook/useAdminMenuState";


function AdminLayout ({children}) {
  
  
  
  const [{folded}, setToogleMenuState] = useAdminMenuState({folded: false});
  
  
  
  return (
    <main id="admin_page">
      <AdminHeader setToogleMenuState = {setToogleMenuState}/>
      <AdminBodyWrapper folded={folded}>
        <AdminGnb/>
        {children} {/* 콘텐츠 영역 */}
      </AdminBodyWrapper>
    </main>
  );
}

export default AdminLayout
