import Image from 'next/image';
import MetaTitle from '/src/components/atoms/MetaTitle';
import React from 'react';
import s from './gradePolicy.module.scss';
import useDeviceState from '/util/hook/useDeviceState';

export default function GradeInfoPopup() {
  const isMobile = useDeviceState().isMobile;

  const imageLink = require(isMobile
    ? '/public/img/mobile_popup_gradePolicy.png'
    : '/public/img/popup_gradePolicy.png');

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
