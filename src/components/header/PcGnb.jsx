import React from 'react';
import s from './header.module.scss';
import { useModalContext } from '@store/modal-context';
import MenuLayout, { SubmenuList } from '/src/components/header/MenuLayout';
import SVG_subscribe from '/public/img/icon/subscribe.svg';


const PcGnb = () => {
  return (
    <>
      <Gnb_survey/>
      <MenuLayout title="샵">
        <SubmenuList title="ALL" link="/shop?category=all" />
        <SubmenuList title="생식" link="/shop?category=raw" />
        <SubmenuList title="토핑" link="/shop?category=topping" />
        <SubmenuList title="굿즈" link="/shop?category=goods" />
      </MenuLayout>
      <MenuLayout title="레시피" link="/recipes"/>
      <MenuLayout title="커뮤니티">
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
  const mcx = useModalContext();
  const onClickHandler = () => {
    mcx.subscribe.onShow();
    mcx.event.setScrollY();
  };
  return (
    <>
      <li className={s.subscribe} onClick={onClickHandler}>
        <span>
          <SVG_subscribe />
        </span>
      </li>
    </>
  );
};

