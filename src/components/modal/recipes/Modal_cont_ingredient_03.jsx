import s from '../../../pages/recipes/recipes.module.scss';
import React from 'react';

export const Modal_cont_ingredient_03 = () => {
  return (
    <div data-modal-type="duckAndLamb">
      <div className={s.modal_text_box2}>
        <div className={s.title}>등록 성분량 (200g기준)</div>
        
        <div className={s.grid_box}>
          <div className={s.left_side}>
            <div className={s.left_title}>Nutrients Facts</div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>수분</div>
              <div className={s.last_text}>77% 이하</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조단백질</div>
              
              <div className={s.last_text}>14% 이상</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조지방</div>
              <div className={s.last_text}>3.5% 이상</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조섬유</div>
              <div className={s.last_text}>0.26% 이하</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>조회분</div>
              <div className={s.last_text}>3% 이하</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>칼슘</div>
              <div className={s.last_text}>0.30% 이상</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.first_text}>인</div>
              <div className={s.last_text}>0.24% 이상</div>
            </div>
          </div>
          
          <div className={s.right_side}>
            <div className={s.right_title}>Dry Matter</div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>65.73</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>16.43</div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>1.22</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>14.08</div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>1.41</div>
            </div>
            
            <div className={s.flex_box}>
              <div className={s.last_text}>1.13</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};