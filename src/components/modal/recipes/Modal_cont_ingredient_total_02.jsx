import s from '../../../pages/recipes/recipes.module.scss';
import React from 'react';

export const Modal_cont_ingredient_total_02 = () => {
  return (
    <div data-modal-type="turkeyAndBeef">
      <div className={s.modal_text_box4}>
        <p className={s.text_row_1}>
          칠면조가슴살(칠레산), 칠면조다리살(칠레산), 소보섭살(풀먹은 호주산 방목 유기농),
          소사태살(풀먹은 호주산 방목 유기농), 칠면조목뼈(칠레산), 소간(국내산), 소비장(국내산),
          소신장(국내산), 당근(유기농 국내산), 양배추(유기농 국내산), 콜리플라워(국내산),
          파프리카(국내산), 애호박(국내산), 케일(국내산), 사과(국내산 충주), 표고버섯(국내산),
          브로콜리(유기농 국내산), 블루베리(미국산), 단호박(유기농 국내산),
          커티지치즈(국내산),저염멸치(국내산), 대구간유(노르웨이산), 햄프씨드(USDA 유기농인증
          미국산), 치아씨드(USDA 유기농인증 미국산), 호박씨(USDA 유기농인증 미국산),
          해바라기씨유(NON-GMO 유기농 이탈리아산), 켈프(USDA 유기농인증 미국산), 스피루리나(USDA
          유기농인증 미국산), 코코넛오일(USDA 유기농인증 미국산)
        </p>

        <div className={s.text_row_2}>
          * 원재료 수급 사정에 따라 원산지가 일부 변동될 수 있으나 고품질의 재료로 대체하여
          사용됩니다
          <br/>
        </div>
        <div className={s.text_row_2_1}>* GMO 및 중국산 원료 등은 절대 사용하지 않습니다</div>
        
        <div className={s.text_row_3}>
          <div className={s.inner_text_row_1}>* 오메가-3는 추가 급여해 주세요</div>
          <div className={s.inner_text_row_2}>
            오메가-3는 공기 접촉 시 산패가 시작되어 레시피에 포함하지 않으니 추가 급여를 권장합니다
          </div>
        </div>
      </div>
    </div>
  );
};