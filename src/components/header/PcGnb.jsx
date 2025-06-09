import React from 'react';
import s from './header.module.scss';
import { useRouter } from 'next/router';
import MenuLayout, { SubmenuList } from '/src/components/header/MenuLayout';
import { general_itemType, itemTypeOption } from '../../../store/TYPE/itemType';
import DeadlineTimer from '../atoms/DeadlineTimer';

const PcGnb = () => {
  return (
    <>
      <Gnb_survey />
      <MenuLayout title="샵" link={`/shop?itemType=${general_itemType.ALL}`}>
        {itemTypeOption.map(type => (
          <SubmenuList
            key={type.value}
            title={type.label}
            link={`/shop?itemType=${type.value}`}
          />
        ))}
      </MenuLayout>
      <MenuLayout title="레시피" link="/recipes" />
      <MenuLayout title="커뮤니티" link="/community/notice">
        <SubmenuList title="공지사항" link="/community/notice" />
        <SubmenuList title="이벤트" link="/community/event" />
        <SubmenuList title="블로그" link="/community/blog" />
        <SubmenuList title="어바웃" link="/community/about" />
      </MenuLayout>
      <MenuLayout title="리뷰" link="/review" />
    </>
  );
};

export default PcGnb;

const Gnb_survey = () => {
  const router = useRouter();
  // const mcx = useModalContext();
  const onClickHandler = () => {
    //! [이전] 팝업창
    // mcx.subscribe.onShow();
    // mcx.event.setScrollY();
    //! [수정] 설문조사 페이지로 이동
    router.push('/surveyGuide');
  };
  return (
    <>
      <li className={s.subscribe} onClick={onClickHandler}>
        <span>{/* <SVG_subscribe /> */}</span>
        <i id={'DeadlineTimer-wrapper'} className={'pc'}>
          <DeadlineTimer />
        </i>
      </li>
    </>
  );
};
