import React from 'react';
import s from './header.module.scss';
import { useModalContext } from '@store/modal-context';
import MenuLayout, { SubmenuList } from '/src/components/header/MenuLayout';
import SVG_subscribe from '/public/img/icon/subscribe.svg';
import { general_itemType } from '../../../store/TYPE/itemType';
import DeadlineTimer from '../atoms/DeadlineTimer';
import Link from 'next/link';

const PcGnb = () => {
  return (
    <>
      {/* 정기구독 시작하기 버튼 */}
      <Gnb_survey />
    </>
  );
};

export default PcGnb;

const Gnb_survey = () => {
  const mcx = useModalContext();
  const onClickHandler = () => {
    mcx.subscribe.onShow();
    mcx.event.setScrollY();
  };
  return (
    <>
      <Link href="/surveyGuide" passHref>
        <a className={s.subscribe_btn}>AI 추천 식단</a>
      </Link>
      {/* ! [추후] 추가할 수도 있음 */}
      <i id={'DeadlineTimer-wrapper'}>
        <DeadlineTimer />
      </i>
      {/* [선택] 모바일에서 안보이길 원할경우 */}
      {/* <i id={'DeadlineTimer-wrapper'} className={'mobile'}> */}
    </>
  );
};
