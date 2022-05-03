import React from "react";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";


function MypageBanner() {
  return (
    <>
      <MetaTitle title="마이페이지 배너 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>마이페이지 배너</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default MypageBanner;
