import React, { useRef, useEffect, useState } from "react";
import s from "/styles/css/mypage/menu.module.scss";
import { SubmenuList, List, SubmenuTitle } from "/src/components/mypage/Menu";
import Link from 'next/link';
import Icon_setting from "/public/img/icon/setting.svg";
import { useRouter } from "next/router";



function AdminGnb() {

  const router = useRouter();
  const [curPath, setCurPath] = useState(router.pathname);
  const curMenuRef = useRef(null);

  
  useEffect(() => {

    // const adminRootPath = '/bf-admin';
    // const redirPath = adminRootPath; + '/dashboard';
    // if (curPath === adminRootPath) {
    //   router.push(redirPath);
    //   // setCurPath(redirPath);
    //   return;
    // }



    const allMenus = curMenuRef.current.querySelectorAll('a');

    allMenus.forEach((menu) => {
      const thisMenuLink = menu.href;
      const pathStartOrder = thisMenuLink.indexOf(curPath);
      const menuPath = thisMenuLink.slice(pathStartOrder, -1);
      const isCurPath = thisMenuLink.indexOf(menuPath) > 0 ? true : false;
      if(isCurPath){
        const activeMenu = menu.closest('.' + `${s.menu_title}`);
        activeMenu.classList.add(`${s.active}`);
      }
    });

  }, [curPath]);

  return (
    <nav ref={curMenuRef} className={s.admin_nav}>
      <ul className={s.menu}>
        <List title="대시보드" link="/bf-admin/dashboard" />
        <List title="회원관리" link="/bf-admin/manage-user" />
        <List title="혜택관리">
          <SubmenuTitle title="쿠폰 관리" noLink />
          <SubmenuList title="쿠폰 조회" link="/bf-admin/coupon" />
          <SubmenuList title="쿠폰 발행" link="/" />
          <SubmenuList title="쿠폰 생성" link="/" />
          <SubmenuTitle title="적립금 관리" noLink />
          <SubmenuList title="적립금 조회" link="/" />
          <SubmenuList title="적립금 발행" link="/" />
        </List>
        <List title="판매관리">
          <SubmenuList title="통합 검색" link="/" />
          <SubmenuList title="주문 관리" link="/" />
          <SubmenuList title="취소 관리" link="/" />
          <SubmenuList title="반품 관리" link="/" />
          <SubmenuList title="교환 관리" link="/" />
          <SubmenuList title="배송현황" link="/" />
          <SubmenuList title="구매확정" link="/" />
        </List>
        <List title="상품관리">
          <SubmenuList title="단품 관리" link="/" />
          <SubmenuList title="단품 등록" link="/" />
          <SubmenuList title="레시피 관리" link="/" />
          <SubmenuList title="레시피 등록" link="/" />
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
          <SubmenuList title="공지사항" link="/bf-admin/notice" />
          <SubmenuList title="이벤트" link="/bf-admin/event" />
          <SubmenuList title="블로그" link="/bf-admin/blog" />
        </List>
        <List title="리뷰관리">
          <SubmenuList title="리뷰" link="/bf-admin/review" />
          <SubmenuList title="베스트 리뷰" link="/bf-admin/best-review" />
        </List>
        <List title="등급정책" link="/class-policy" />
        <List title="메신저" link="/bf-admin/messanger" />
      </ul>
      <div className={s.site_settings}>
        <Link href="/bf-admin/settings" passHref>
          <a>
            <Icon_setting />
            설정
          </a>
        </Link>
      </div>
    </nav>
  );
}

export default AdminGnb;