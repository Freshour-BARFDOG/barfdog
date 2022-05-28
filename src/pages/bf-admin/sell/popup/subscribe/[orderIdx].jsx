import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import s from "../popup_sell.module.scss";
import PopupWrapper from "@src/components/popup/PopupWrapper";
import {
  PopupCloseButton,
  PopupCloseButton_typeX,
} from "@src/components/popup/PopupCloseButton";
import ProductInfo_basicOrderInfo from "../ProductInfo_basicOrderInfo";
import ProductInfo_dog from "../ProductInfo_dog";
import ProductInfo_subscribe from "../ProductInfo_subscribe";
import ProductInfo_payment from "../ProductInfo_payment";
import ProductInfo_delivery from "../ProductInfo_delivery";









function Popup_MemeberDetailPage() {


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
                    <ProductInfo_basicOrderInfo data={{paymentType:'정기구독'}}/>
                  </li>
                  <li className={s["table-list"]}>
                    <ProductInfo_dog />
                  </li>
                  <li className={s["table-list"]}>
                    <ProductInfo_subscribe />
                    <ProductInfo_subscribe isChangedSubscribeInfo={true} />
                  </li>
                  <li className={s["table-list"]}>
                    <ProductInfo_payment />
                  </li>
                  <li className={s["table-list"]}>
                    <ProductInfo_delivery />
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
