import React from 'react';
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";


function AlgorithmPage() {
  return (
    <>
      <MetaTitle title="알고리즘 설정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>알고리즘 설정</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default AlgorithmPage;