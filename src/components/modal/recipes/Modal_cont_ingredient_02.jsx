import s from '../../../pages/recipes/recipes.module.scss';
import React from 'react';

export const Modal_cont_ingredient_02 = () => {
  return (
    <div data-modal-type="turkeyAndBeef">
      <div className={s.modal_text_box2}>
        <div className={s.title}>등록 성분량 (200g기준)</div>
        
        <div className={s.grid_box}>
          <div className={s.left_side}>
            <div className={s.left_title2}>Nutrients Facts</div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>수분</div>
              <div className={s.last_text}>76% 이하</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조단백질</div>
              
              <div className={s.last_text}>15.7% 이상</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조지방</div>
              <div className={s.last_text}>5.0% 이상</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조섬유</div>
              <div className={s.last_text}>0.7% 이하</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조회분</div>
              <div className={s.last_text}>2.2% 이하</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>칼슘</div>
              <div className={s.last_text}>0.33% 이상</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>인</div>
              <div className={s.last_text}>0.26% 이상</div>
            </div>
          </div>
          
          <div className={s.right_side}>
            <div className={s.right_title2}>Dry Matter</div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>64.90</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>20.67</div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>2.89</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>9.09</div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>1.36</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>1.07</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};