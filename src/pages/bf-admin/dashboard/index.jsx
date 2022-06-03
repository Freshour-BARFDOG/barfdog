import React from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import dynamic from "next/dynamic";
import LineChart , {data} from "./LineChart";



function Index() {
  return (
    <>
      <MetaTitle title="대시보드" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          DashBoard 페이지
          <LineChart data={data}/>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default Index;