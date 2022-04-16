import React from 'react';
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";


function createMainBannerPage() {
 return (
   <AdminLayout>
     <AdminContentWrapper>
배너 생성 페이지 
     </AdminContentWrapper>
   </AdminLayout>
 );
}

export default createMainBannerPage