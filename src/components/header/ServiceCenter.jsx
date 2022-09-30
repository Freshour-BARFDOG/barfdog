import React from 'react';
import MenuLayout, { SubmenuList } from "/src/components/header/MenuLayout";
import s from './header.module.scss';


export default function ServiceCenter() {
  const IconInfo = {
    src: '/img/icon/triangle.svg',
    width: '12px',
    height: '12px'
  }

  return (
    <>
      <MenuLayout title="고객센터" titleClassName={s['service-center']} icon={IconInfo}>
        <SubmenuList title="자주 묻는 질문" link="/faq" />
        <SubmenuList title="1:1 문의" className={'ch-open'} />
      </MenuLayout>
    </>
  );
}
