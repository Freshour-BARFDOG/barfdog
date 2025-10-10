import React from 'react';
import s from './header.module.scss';
import { useRouter } from 'next/router';
import MenuLayout, { SubmenuList } from '/src/components/header/MenuLayout';
import DeadlineTimer from '../atoms/DeadlineTimer';
import { menuList } from '../../../constants/menu';

const PcGnb = ({ currentPath }) => {

  const isPathMatch = (currentPath, menuLink) => {
    // URL에서 쿼리 파라미터 제거하여 경로만 추출
    const currentPathOnly = currentPath.split('?')[0];
    const menuPathOnly = menuLink.split('?')[0];

    
    // 커뮤니티, 샵 메뉴의 경우 하위 경로들도 모두 활성화
    if (currentPathOnly.startsWith('/community') && menuPathOnly.startsWith('/community')) {
      return true;
    }
    if (currentPathOnly.startsWith('/shop') && menuPathOnly.startsWith('/shop')) {
      return true;
    }
    
    // 경로가 정확히 일치하는지 확인
    if (currentPathOnly === menuPathOnly) {
      // 쿼리 파라미터가 없는 경우 바로 true 반환
      if (!currentPath.includes('?') && !menuLink.includes('?')) {
        return true;
      }

      if (!menuLink.includes('?')) {
        return true;
      }
    }
    
    return false;
  };
  
  return (
    <div className={s.gnb_nav_box}>
      <Gnb_survey />
      <div className={s.gnb_nav_list}>
        {menuList.map(menu => (
          <MenuLayout 
            key={menu.title} 
            title={menu.title} 
            link={menu.link}
            isActive={isPathMatch(currentPath, menu.link)}
          >
            {menu.subMenu && menu.subMenu.map(subMenu => (
              <SubmenuList
                key={subMenu.title} 
                title={subMenu.title}
                link={subMenu.link}
              />
            ))}
          </MenuLayout>
        ))}
      </div>
    </div>
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
    <div className={`${s.subscribe} ${s.gnb_nav_item}`} onClick={onClickHandler}>
      <span>{/* <SVG_subscribe /> */}</span>
      <i id={'DeadlineTimer-wrapper'} className={'pc'}>
        <DeadlineTimer />
      </i>
    </div>
  );
};
