import React from 'react';
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";


function createPopup() {
 return (
   <AdminLayout>
     <AdminContentWrapper>팝업 생성 페이지 
     </AdminContentWrapper>
   </AdminLayout>
 );
}

export default createPopup