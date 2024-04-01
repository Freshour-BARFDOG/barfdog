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

      {/* <MenuLayout title="샵" link={`/shop?itemType=${general_itemType.ALL}`}>
        <SubmenuList title="ALL" link={`/shop?itemType=${general_itemType.ALL}`} />
        <SubmenuList title="생식" link={`/shop?itemType=${general_itemType.RAW}`}/>
        <SubmenuList title="토핑" link={`/shop?itemType=${general_itemType.TOPPING}`}/>
        <SubmenuList title="굿즈" link={`/shop?itemType=${general_itemType.GOODS}`}/>
      </MenuLayout>
      <MenuLayout title="레시피" link="/recipes"/>
      <MenuLayout title="커뮤니티" link="/community/notice">
        <SubmenuList title="공지사항" link="/community/notice" />
        <SubmenuList title="이벤트" link="/community/event" />
        <SubmenuList title="블로그" link="/community/blog" />
        <SubmenuList title="어바웃" link="/community/about" />
      </MenuLayout>
      <MenuLayout title="리뷰" link="/review" /> */}
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
    </>
  );
};
