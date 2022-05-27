import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import s from "./popup_sell_order.module.scss";
import PopupWrapper from "@src/components/popup/PopupWrapper";
import {
  PopupCloseButton,
  PopupCloseButton_typeX,
} from "@src/components/popup/PopupCloseButton";





function Popup_MemeberDetailPage() {
  const router = useRouter();



  return (
    <>
      <div id={s.popup}>
        <PopupWrapper style={{ width: 1000 }}>
          <header className={s.header}>
            <div className={s.row}>
              <div className={s.cont}>
                <h1 className={s["popup-title"]}>주문상세정보</h1>
                <PopupCloseButton_typeX />
              </div>
            </div>
          </header>
          <main className={s.body}>
            <div className={s.row}>
              <section className={s.table}>
                <ul>
                  <li className={s["table-list"]}>
                    <div className={s["t-header"]}>
                      <h4 className={s.title}>기본 정보</h4>
                    </div>
                    <ul className={s["t-body"]}>
                      <li className={`${s["t-row"]}`}>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>이름</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>김바프</span>
                          </div>
                        </div>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>생일</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>
                            </span>
                            <span>
                              <button
                                className="admin_btn line point basic_s"
                              >
                                변경
                              </button>
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s["t-row"]}`}>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>아이디</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>testID</span>
                          </div>
                        </div>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>연락처</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>010-1234-5678</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>주소</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>서울 서대문구 독립문로1길 9-12 503호</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li className={s["table-list"]}>
                    <div className={s["t-header"]}>
                      <h4 className={s.title}>구매 현황</h4>
                    </div>
                    <ul className={s["t-body"]}>
                      <li className={`${s["t-row"]}`}>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>누적구매금액</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>1,324,200원</span>
                          </div>
                        </div>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>등급</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>다이아</span>
                            <span>
                              <button
                                className="admin_btn line point basic_s"
                              >
                                변경
                              </button>
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s["t-row"]}`}>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>정기구독여부</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>Y</span>
                            <span>
                              <button
                                className="admin_btn line point basic_s"
                              >
                                구독정보보기
                              </button>
                            </span>
                          </div>
                        </div>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>누적구독횟수</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>14번</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>반려견</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>(대표견)시호, 방울이, 영심이</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li className={s["table-list"]}>
                    <div className={s["t-header"]}>
                      <h4 className={s.title}>로그인 정보</h4>
                    </div>
                    <ul className={s["t-body"]}>
                      <li className={`${s["t-row"]}`}>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>장기미접속</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>N</span>
                          </div>
                        </div>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>마지막로그인</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>2022-05-26</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
                        <div className={s["t-box"]}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>탈퇴여부</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>N</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>
              <section className={s["btn-section"]}>
                <PopupCloseButton />
              </section>
            </div>
          </main>
        </PopupWrapper>
      </div>
    </>
  );
}

export default Popup_MemeberDetailPage;
