import React from 'react';
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";


function createPopup() {
 return (
   <>
     <MetaTitle title="팝업 생성" admin={true} />
     <AdminLayout>
       <AdminContentWrapper>팝업 생성 페이지</AdminContentWrapper>
     </AdminLayout>
   </>
 );
}

export default createPopup