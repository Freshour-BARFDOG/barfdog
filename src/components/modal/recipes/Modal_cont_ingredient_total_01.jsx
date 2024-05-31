import s from '../../../pages/recipes/recipes.module.scss';
import React from 'react';

export const Modal_cont_ingredient_total_01 = () => {
  return (
    <div data-modal-type="starterPremium">
      <div className={s.modal_text_box4}>
        <p className={s.text_row_1}>
          통닭(국내산 무항생제), 칠면조가슴살(칠레산), 닭가슴살(국내산
          무항생제), 닭안심(국내산 무항생제), 닭간(국내산), 소비장(국내산),
          소신장(국내산), 단호박(국내산), 당근(국내산), 양배추(국내산),
          콜리플라워(국내산), 그린빈(벨기에산), 애호박(국내산), 사과(국내산),
          녹색바나나(필리핀), 난황(국내산), 표고버섯(국내산), 딸기(국내산),
          블루베리(미국산), 커티지치즈(국내산), 저염멸치(국내산), 밀싹(국내산),
          벌꿀(국내산), 햄프씨드(USDA 유기농 인증 미국산), 치아씨드(USDA 유기농
          인증 미국산), 아마씨드(USDA 유기농 인증 미국산), 대구간유(USDA 유기농
          인증 미국산), 코코넛오일(USDA 유기농 인증 미국산), 켈프(USDA 유기농
          인증 미국산), 난각분(국내산), 요오드화소금(미국산), 비타민E(미국산),
          망간(미국산), 아연(미국산), 비타민D(미국산), 비타민B-Complex(미국산)
        </p>

        <div className={s.text_row_2}>
          * 원재료 수급 사정에 따라 원산지가 일부 변동될 수 있으나 고품질의
          재료로 대체하여 사용됩니다
          <br />
        </div>
        <div className={s.text_row_2_1}>
          * GMO 및 중국산 원료 등은 절대 사용하지 않습니다
        </div>

        <div className={s.text_row_3}>
          <div className={s.inner_text_row_1}>
            * 오메가-3는 추가 급여해 주세요
          </div>
          <div className={s.inner_text_row_2}>
            오메가-3는 공기 접촉 시 산패가 시작되어 레시피에 포함하지 않으니
            추가 급여를 권장합니다
          </div>
        </div>
      </div>
    </div>
  );
};
