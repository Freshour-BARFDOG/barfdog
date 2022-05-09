import React from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import Image from "next/image";

function Dashboard() {
  return (
    <>
      <MetaTitle title="대시보드" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          DashBoard 페이지
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default Dashboard;