import React from 'react';
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";


function createMainBannerPage() {
 return (
   <AdminLayout>
     <AdminContentWrapper>
       <div className="admin_title_main">배너등록</div>ddd

     </AdminContentWrapper>
   </AdminLayout>
 );
}

export default createMainBannerPage