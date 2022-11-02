import s from '../../../pages/recipes/recipes.module.scss';
import React from 'react';

export const Modal_cont_ingredient_04 = () => {
  return (
    <div data-modal-type="lambAndBeef">
      <div className={s.modal_text_box2}>
        <div className={s.title}>등록 성분량 (200g기준)</div>
        
        <div className={s.grid_box}>
          <div className={s.left_side}>
            <div className={s.left_title4}>Nutrients Facts</div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>수분</div>
              <div className={s.last_text}>70% 이하</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조단백질</div>
              
              <div className={s.last_text}>15.7% 이상</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조지방</div>
              <div className={s.last_text}>8.5% 이상</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조섬유</div>
              <div className={s.last_text}>0.7% 이하</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조회분</div>
              <div className={s.last_text}>2.6% 이하</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>칼슘</div>
              <div className={s.last_text}>0.32% 이상</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>인</div>
              <div className={s.last_text}>0.26% 이상</div>
            </div>
          </div>
          
          <div className={s.right_side}>
            <div className={s.right_title4}>Dry Matter</div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>55.91</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>30.27</div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>2.49</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>9.26</div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>1.14</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>0.93</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};