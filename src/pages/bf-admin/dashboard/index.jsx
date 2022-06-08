import React from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import LineChart , {data} from "/src/components/admin/dashboard/LineChart";



function DashboardPage() {
  return (
    <>
      <MetaTitle title="대시보드" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          DashBoard 페이지
          <LineChart chartData={data}/>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default DashboardPage;