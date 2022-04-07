import React from 'react';
import MenuLayout, { SubmenuList } from "/src/components/header/MenuLayout";


function ServiceCenter() {
  const IconInfo = {
    src: '/img/icon/triangle.svg',
    width: '12px',
    height: '12px'
  }
  return (
    <>
      <MenuLayout title="고객센터" className="service_center" addedIcon={IconInfo}>
        <SubmenuList title="자주 묻는 질문" link="/faq" />
        <SubmenuList title="1:1문의" link=""/>
      </MenuLayout>
    </>
  )
}

export default ServiceCenter