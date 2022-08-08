import s from '../../../pages/recipes/recipes.module.scss';
import React from 'react';

export const Modal_cont_ingredient_01 = () => {
  return (
    <div data-modal-type="starterPremium">
      <div className={s.modal_text_box2}>
        <div className={s.title}>등록 성분량 (200g기준)</div>
        
        <div className={s.grid_box}>
          <div className={s.left_side}>
            <div className={s.left_title}>Nutrients Facts</div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>수분</div>
              <div className={s.last_text}>76% 이하</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조단백질</div>
              
              <div className={s.last_text}>16% 이상</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조지방</div>
              <div className={s.last_text}>4% 이상</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조섬유</div>
              <div className={s.last_text}>0.3% 이하</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조회분</div>
              <div className={s.last_text}>2% 이하</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>칼슘</div>
              <div className={s.last_text}>0.24% 이상</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>인</div>
              <div className={s.last_text}>0.19% 이상</div>
            </div>
          </div>
          
          <div className={s.right_side}>
            <div className={s.right_title}>Dry Matter</div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>76.45</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>19.11</div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>1.43</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>8.80</div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>1.15</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>0.91</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};