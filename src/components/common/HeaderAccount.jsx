import React from 'react';
import SubmenuLayout, { SubmenuList } from "../SubmenuLayout";



function HeaderAccount() {
  return (
    <>
      <SubmenuLayout title="고객센터">
        <SubmenuList title="자주 묻는 질문" link="/faq" />
        <SubmenuList title="1:1문의" link=""/>
      </SubmenuLayout>
    </>
  )
}

export default HeaderAccount