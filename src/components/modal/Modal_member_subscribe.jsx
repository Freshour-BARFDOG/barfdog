import React, { useState } from "react";
import s from "./modal_member_subscribe.module.scss";
import ModalWrapper from "@src/components/modal/ModalWrapper";
import rem from "@src/components/atoms/rem";
import {
  PopupCloseButton,
} from "@src/components/popup/PopupCloseButton";




function Modal_member_class({ onClick }) {

  const onHideModalHandler = () => {
    onClick();
  };


  return (
    <ModalWrapper
      background
      label="회원정보 조회"
      onBackgroundClick={onHideModalHandler}
      style={{
        padding: `0 0 ${rem(30)}`,
        width: `calc(100% - ${rem(100)})`,
      }}
    >
      <header className={s.header}>
        <div className={s.row}>
          <div className={s.cont}>
            <h1 className={s["popup-title"]}>구독정보</h1>
          </div>
        </div>
      </header>
      <main className={s.body}>
        <div className={s.row}>
          <section className={s.table}>
            <ul>
              <li className={s["table-list"]}>
                <div className={s["t-header"]}>
                  <h4 className={s.title}>
                    구독 중:
                    <em className={s["subscribe-count"]}>2</em>
                  </h4>
                </div>
                <ul className={s["t-body"]}>
                  <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
                    <div className={s["t-box"]}>
                      <div className={`${s.innerBox} ${s.label}`}>
                        <span>견명</span>
                      </div>
                      <div className={`${s.innerBox} ${s.cont}`}>
                        <span>바둑이</span>
                      </div>
                    </div>
                  </li>
                  <li className={`${s["t-row"]}`}>
                    <div className={s["t-box"]}>
                      <div className={`${s.innerBox} ${s.label}`}>
                        <span>못먹는음식</span>
                      </div>
                      <div className={`${s.innerBox} ${s.cont}`}>
                        <span>Y</span>
                        <span>&#40;닭&#41;</span>
                      </div>
                    </div>
                    <div className={s["t-box"]}>
                      <div className={`${s.innerBox} ${s.label}`}>
                        <span>특이사항</span>
                      </div>
                      <div className={`${s.innerBox} ${s.cont}`}>
                        <span>Y</span>
                        <span>&#40;땅콩알러지 있어요&#41;</span>
                      </div>
                    </div>
                  </li>
                  <li className={`${s["t-row"]}`}>
                    <div className={s["t-box"]}>
                      <div className={`${s.innerBox} ${s.label}`}>
                        <span>플랜</span>
                      </div>
                      <div className={`${s.innerBox} ${s.cont}`}>
                        <span>풀플랜</span>
                      </div>
                    </div>
                    <div className={s["t-box"]}>
                      <div className={`${s.innerBox} ${s.label}`}>
                        <span>구독회차</span>
                      </div>
                      <div className={`${s.innerBox} ${s.cont}`}>
                        <span>12회차</span>
                      </div>
                    </div>
                  </li>
                  <li className={`${s["t-row"]}`}>
                    <div className={s["t-box"]}>
                      <div className={`${s.innerBox} ${s.label}`}>
                        <span>레시피</span>
                      </div>
                      <div className={`${s.innerBox} ${s.cont}`}>
                        <span>스타터프리미엄/덕&amp;램</span>
                      </div>
                    </div>
                    <div className={s["t-box"]}>
                      <div className={`${s.innerBox} ${s.label}`}>
                        <span>급여량</span>
                      </div>
                      <div className={`${s.innerBox} ${s.cont}`}>
                        <span>272g</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </section>
          <section className={s["btn-section"]}>
            <PopupCloseButton onClick={onHideModalHandler} />
          </section>
        </div>
      </main>
    </ModalWrapper>
  );
}

export default Modal_member_class;
