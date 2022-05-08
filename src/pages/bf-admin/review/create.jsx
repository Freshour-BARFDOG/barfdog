import React from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";


/* // ! -----------  client페이지 > format 동일 // + 유저이름 input 추가  ------------ */
function CreateRewardPage() {
  return (
    <>
      <MetaTitle title="리뷰 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>CreateRewardPage</AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreateRewardPage;
