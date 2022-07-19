import Styles from '../../pages/shop/item/[itemId].module.scss';
import React from 'react';

export const ShopTabMenus = ({activeIndex, setActiveIndex}) => {
  const navClickHandler = (e) => {
    const thisMenu = e.currentTarget;
    const children = Array.from( thisMenu.parentNode.children );
    const thisIdx = children.indexOf( thisMenu );
    setActiveIndex( thisIdx );
    
    children.forEach( (menu) => {
      const thisMenuIdx = children.indexOf( menu );
      if ( thisMenuIdx !== thisIdx ) {
        menu.classList.remove( `${Styles.active}` );
      } else {
        menu.classList.add( `${Styles.active}` );
      }
    } );
  };
  return (
    <div className={Styles.tab_menu}>
      <ul className={Styles.tab_menu_box}>
        <li
          className={`${Styles.left_box} ${activeIndex === 0 && Styles.active}`}
          onClick={navClickHandler}
        >
          <button type="button" className={Styles.no1}>
            상세정보
          </button>
        </li>
        <li className={Styles.mid_box} onClick={navClickHandler}>
          <button type="button" className={Styles.no2}>
            반품/교환정보
          </button>
        </li>
        <li className={Styles.right_box} onClick={navClickHandler}>
          <button type="button" className={Styles.no3}>
            리뷰
          </button>
        </li>
      </ul>
    </div>
  );
};