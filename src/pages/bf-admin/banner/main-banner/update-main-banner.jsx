import React from 'react';
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";


function updateMainBannerPage() {
 return (
   <AdminLayout>
     <AdminContentWrapper>배너 업데이트 페이지 
     </AdminContentWrapper>
   </AdminLayout>
 );
}

export default updateMainBannerPage