import Image from 'next/image';
import MetaTitle from '/src/components/atoms/MetaTitle';
import React from 'react';
import s from './gradePolicy.module.scss';
import useDeviceState from '/util/hook/useDeviceState';
import popupWindow from "/util/func/popupWindow";

export default function GradeInfoPopup() {
  const isMobile = useDeviceState().isMobile;

  const imageLink = require(isMobile
    ? '/public/img/gradePolicy_mobile.jpg'
    : '/public/img/gradePolicy_pc.jpg');

  return (
    <>
      <MetaTitle title="등급정책" />
      <main className={s.main}>
        <figure>
          <Image alt={'등급정책'} objectFit={'contain'} layout={'fill'} src={imageLink} />
        </figure>
      </main>
    </>
  );
}

export const openGradePopupHandler = (isMobile) => {
  const href = '/popup/gradePolicy';
  const options = {
    width: isMobile ? 320 : 1000,
    height: isMobile ? 737 : 860,
    left: 200,
    top: 100,
  };
  popupWindow( href, options );
};