import React from "react";
import ModalWrapper from "/src/components/modal/ModalWrapper";
import s from "./Modal_AdminRecommendArticle.module.scss";
import rem from '/util/func/rem';
import CloseButton from "/src/components/atoms/CloseButton";




function Modal_AdminRecommendArticle({ setActiveModal }) {
  const onHideRecommendArticleModal = () => {
    setActiveModal(false);
  };

  return (
    <ModalWrapper
      background
      label="추천아티클 설정"
      positionCenter
      style={{ padding: "0", width: "100%", maxWidth: `${rem(600)}` }}
    >
      <div className={s["title-section"]}>
        <h2>추천아티클 설정</h2>
        <CloseButton
          style={{ width: `${rem(32)}`, height: `${rem(32)}` }}
          lineColor={'#fff'}
          onClick={onHideRecommendArticleModal}
        />
      </div>
      <div className={s["body-section"]}>
        <div className={s["input-section"]}>
          <label className={s["input-row"]} htmlFor="recommend-1">
            <p className={s["input-title"]}>추천 아티클1</p>
            <select name="recommendArticle" id="recommend-1">
              <option value="blog-id-01">
                블로그 타이틀1블로그 타이틀1블로그 타이틀1 블로그 타이틀1 블로그
                타이틀1 블로그 타이틀1 블로그 타이틀1 블로그 타이틀1 블로그
                타이틀1
              </option>
              <option value="blog-id-02">블로그 타이틀2</option>
              <option value="blog-id-03">블로그 타이틀3</option>
              <option value="blog-id-04">블로그 타이틀4</option>
            </select>
          </label>
          <label className={s["input-row"]} htmlFor="recommend-1">
            <p className={s["input-title"]}>추천 아티클2</p>
            <select name="recommendArticle" id="recommend-1">
              <option value="blog-id-01">추천 블로그 타이틀1</option>
              <option value="blog-id-02">추천 블로그 타이틀2</option>
              <option value="blog-id-03">추천 블로그 타이틀3</option>
              <option value="blog-id-04">추천 블로그 타이틀4</option>
            </select>
          </label>
        </div>
        <div className={s["btn-section"]}>
          <button
            className="admin_btn line confirm_l"
            onClick={onHideRecommendArticleModal}
          >
            닫기
          </button>
          <button className="admin_btn line confirm_l point">저장</button>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default Modal_AdminRecommendArticle;
