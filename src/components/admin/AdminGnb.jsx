import React, {useRef} from "react";
import s from "/src/components/common/menu.module.scss";
import {List, SubmenuList, SubmenuTitle} from "/src/components/mypage/MypageMenu";
import Icon_setting from "/public/img/icon/setting.svg";
import { IoMenuSharp  } from "react-icons/io5";


function AdminGnb() {

  const curMenuRef = useRef(null);

  return (
    <nav ref={curMenuRef} className={s.admin_nav}>
      <ul className={s.menu}>
        <List title="대시보드" link="/bf-admin/dashboard" />
        <List title="회원관리" link="/bf-admin/member" />
        <List title="혜택관리">
          <SubmenuTitle title="쿠폰 관리" noLink />
          <SubmenuList title="쿠폰 조회" link="/bf-admin/coupon/search" />
          <SubmenuList title="쿠폰 발행" link="/bf-admin/coupon/release" />
          <SubmenuList title="쿠폰 생성" link="/bf-admin/coupon/create" />
          <SubmenuTitle title="적립금 관리" noLink />
          <SubmenuList title="적립금 조회" link="/bf-admin/reward/search" />
          <SubmenuList title="적립금 발행" link="/bf-admin/reward/release" />
        </List>
        <List title="판매관리">
          <SubmenuList title="통합 검색" link="/bf-admin/sell/search" />
          <SubmenuList title="주문 관리" link="/bf-admin/sell/order" />
          <SubmenuList title="취소 관리" link="/bf-admin/sell/cancel" />
          <SubmenuList title="반품 관리" link="/bf-admin/sell/return" />
          <SubmenuList title="교환 관리" link="/bf-admin/sell/exchange" />
          <SubmenuList title="배송 현황" link="/bf-admin/sell/delivery" />
          <SubmenuList title="구매 확정" link="/bf-admin/sell/confirm" />
        </List>
        <List title="상품관리">
          <SubmenuList title="일반상품 관리" link="/bf-admin/product/single" />
          <SubmenuList title="일반상품 등록" link="/bf-admin/product/createSingle" />
          <SubmenuList title="레시피 관리" link="/bf-admin/product/recipe" />
          <SubmenuList title="레시피 등록" link="/bf-admin/product/createRecipe" />
        </List>
        <List title="배너관리">
          <SubmenuList title="메인 배너" link="/bf-admin/banner/main-banner" />
          <SubmenuList
            title="마이페이지 배너"
            link="/bf-admin/banner/mypage-banner"
          />
          <SubmenuList
            title="최상단 띠 배너"
            link="/bf-admin/banner/line-banner"
          />
          <SubmenuList title="팝업" link="/bf-admin/banner/popup" />
        </List>
        <List title="게시판관리">
          <SubmenuList title="공지사항" link="/bf-admin/community/notice" />
          <SubmenuList title="이벤트" link="/bf-admin/community/event" />
          <SubmenuList title="블로그" link="/bf-admin/community/blog" />
          <SubmenuList title="1:1문의" link="/bf-admin/community/inquiry" />
        </List>
        <List title="리뷰관리">
          <SubmenuList title="베스트 리뷰" link="/bf-admin/review/bestReview" />
          <SubmenuList title="리뷰" link="/bf-admin/review/normal" />
          <SubmenuList title="리뷰 생성" link="/bf-admin/review/create" />
        </List>
        <List title="메신저">
          <SubmenuList title="친구톡" link="/bf-admin/messenger/friendTalk" />
          <SubmenuList title="채널톡" link="/bf-admin/messenger/channelTalk" />
        </List>
      </ul>
      <div className={`${s.site_settings} ${s.menu_title} ${s['admin-site-setting']}`}>
        <List title="설정" iconOnLeftSide={<Icon_setting />}>
          <SubmenuList title="알고리즘" link="/bf-admin/settings/algorithm" />
          <SubmenuList title="배송정책" link="/bf-admin/settings/delivery" />
          <SubmenuList title="쿠폰정책" link="/bf-admin/settings/coupon" />
          <SubmenuList title="가격정책" link="/bf-admin/settings/price" />
        </List>
      </div>
    </nav>
  );
}

export default AdminGnb;
