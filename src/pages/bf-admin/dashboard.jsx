import React from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import Image from "next/image";

function Dashboard() {
  return (
    <>
      <MetaTitle title="관리자 페이지" />
      <AdminLayout>
        <AdminContentWrapper>
          DashBoard 페이지 DASHBARD PAGE DASHBARD PAGE DASHBARD PAGE DASHBARD
          PAGE
          <div className="img-wrap" style={{ width: 100, height: 100 }}>
            {/* <Image
              src="http://211.219.225.118:9999/display?filename=c75641b3-7a4c-43c0-9ae9-ceb24e25ccb3_bms_square.jpg"
              objectfit="contain"
              layout="fill"
              alt="테스트이미지"
            ></Image> */}
          </div>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default Dashboard