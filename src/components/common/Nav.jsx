import React from 'react'
import SubmenuLayout, { SubmenuList } from "../SubmenuLayout";



function Nav() {
  return (
    <>
      <SubmenuLayout title="샵">
        <SubmenuList title="ALL" link="/shop" />
        <SubmenuList title="생식" link="/shop/raw" />
        <SubmenuList title="토핑" link="/shop/topping" />
        <SubmenuList title="굿즈" link="/shop/goods" />
      </SubmenuLayout>
      <SubmenuLayout title="레시피">
        <SubmenuList title="스타터프리미엄" link="/recipe/starter" />
        <SubmenuList title="터키&amp;비프" link="/recipe/turkeyAndBeef" />
        <SubmenuList title="덕&amp;램" link="/recipe/duckAndLamb" />
        <SubmenuList title="램&amp;비프" link="/recipe/labmAndBeef" />
      </SubmenuLayout>
      <SubmenuLayout title="커뮤니티">
        <SubmenuList title="공지사항" link="/shop/goods" />
        <SubmenuList title="이벤트" link="/event" />
        <SubmenuList title="블로그" link="/blog" />
        <SubmenuList title="어바웃" link="/shop/topping" />
      </SubmenuLayout>
      <SubmenuLayout title="리뷰"></SubmenuLayout>      
    </>
  )
}

export default Nav;