import React from 'react';
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";

function updateMainBannerPage() {
 return (
   <>
     <MetaTitle title="메인 배너" admin={true} />
     <AdminLayout>
       <AdminContentWrapper>메인배너 수정 페이지</AdminContentWrapper>
     </AdminLayout>
   </>
 );
}

export default updateMainBannerPage