import React, { useRef } from 'react';
import s from '/src/components/common/menu.module.scss';
import {
  List,
  SubmenuList,
  SubmenuTitle,
} from '/src/components/mypage/MypageMenu';
import Icon_setting from '/public/img/icon/setting.svg';
import { IoMenuSharp } from 'react-icons/io5';

function AdminGnb() {
  const curMenuRef = useRef(null);

  return (
    <nav ref={curMenuRef} className={s.admin_nav}>
      <ul className={s.menu}>
        <List title="대시보드" link="/dashboard" />
        <List title="회원관리" link="/member" />
        <List title="혜택관리">
          <SubmenuTitle title="쿠폰 관리" noLink />
          <SubmenuList title="쿠폰 조회" link="/coupon/search" />
          <SubmenuList title="쿠폰 발행" link="/coupon/release" />
          <SubmenuList title="쿠폰 생성" link="/coupon/create" />
          <SubmenuList title="쿠폰 사용 현황" link="/coupon/usage" />
          <SubmenuTitle title="적립금 관리" noLink />
          <SubmenuList title="적립금 조회" link="/reward/search" />
          <SubmenuList title="적립금 발행" link="/reward/release" />
          <SubmenuTitle title="프로모션" noLink />
          <SubmenuList title="프로모션 관리" link="/promotion" />
          <SubmenuList
            title="프로모션 생성"
            link="/promotion/create"
          />
        </List>
        <List title="판매관리">
          <SubmenuList title="통합 검색" link="/sell/search" />
          <SubmenuList title="주문 관리" link="/sell/order" />
          <SubmenuList title="취소 관리" link="/sell/cancel" />
          <SubmenuList title="반품 관리" link="/sell/return" />
          <SubmenuList title="교환 관리" link="/sell/exchange" />
          <SubmenuList title="배송 현황" link="/sell/delivery" />
          <SubmenuList title="구매 확정" link="/sell/confirm" />
        </List>
        <List title="상품관리">
          <SubmenuList title="일반상품 관리" link="/product/single" />
          <SubmenuList
            title="일반상품 등록"
            link="/product/createSingle"
          />
          <SubmenuList title="레시피 관리" link="/product/recipe" />
          <SubmenuList
            title="레시피 등록"
            link="/product/createRecipe"
          />
        </List>
        <List title="반려견 관리" link="/dog" />
        <List title="구독 히스토리" link="/subscribes" />
        <List title="배너관리">
          <SubmenuList title="메인 배너" link="/banner/main-banner" />
          <SubmenuList
            title="마이페이지 배너"
            link="/banner/mypage-banner"
          />
          <SubmenuList
            title="최상단 띠 배너"
            link="/banner/line-banner"
          />
          <SubmenuList title="팝업" link="/banner/popup" />
        </List>
        <List title="게시판관리">
          <SubmenuList title="공지사항" link="/community/notice" />
          <SubmenuList title="이벤트" link="/community/event" />
          <SubmenuList title="블로그" link="/community/blog" />
          <SubmenuList title="1:1 문의" link="/community/inquiry" />
        </List>
        <List title="리뷰관리">
          <SubmenuList title="베스트 리뷰" link="/review/bestReview" />
          <SubmenuList title="리뷰" link="/review/normal" />
          <SubmenuList title="리뷰 생성" link="/review/create" />
        </List>
        <List title="메신저">
          <SubmenuList title="친구톡" link="/messenger/friendTalk" />
          <SubmenuList title="채널톡" link="/messenger/channelTalk" />
        </List>
        <List title="제휴사 매출">
          <SubmenuList
            title="제휴사 통한 가입자"
            link="/alliance/members"
          />
          <SubmenuList title="매출" link="/alliance/payment" />
        </List>
        <List title="설정">
          <SubmenuList title="알고리즘" link="/settings/algorithm" />
          <SubmenuList title="배송정책" link="/settings/delivery" />
          <SubmenuList title="쿠폰정책" link="/settings/coupon" />
          <SubmenuList title="가격정책" link="/settings/price" />
          <SubmenuList
            title="주문마감일 변경"
            link="/settings/deadline"
          />
        </List>
      </ul>
    </nav>
  );
}

export default AdminGnb;
