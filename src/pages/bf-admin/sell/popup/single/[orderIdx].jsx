import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import s from "../popup_sell.module.scss";
import PopupWrapper from "@src/components/popup/PopupWrapper";
import {
  PopupCloseButton,
  PopupCloseButton_typeX,
} from "@src/components/popup/PopupCloseButton";
import ProductInfo_basicOrderInfo from "../ProductInfo_basicOrderInfo";
import ProductInfo_orderStatusInfo from "../ProductInfo_orderStatusInfo";
import ProductInfo_normItem from "../ProductInfo_normalItem";
import ProductInfo_payment from "../ProductInfo_payment";
import ProductInfo_delivery from "../ProductInfo_delivery";

/*
  // MEMO : 전체 주문 Status (단품 / 정기구독상품 포함)
  { label: "전체", value: "ALL" },
  { label: "구독보류", value: "HOLD" }, // MEMO 구독상품
  { label: "결제완료", value: "PAYMENT_DONE" },
  { label: "생산 중", value: "PRUDUCING" }, // MEMO 구독상품
  { label: "배송준비 중", value: "DELIVERY_READY" }, // MEMO 단품
  { label: "배송시작", value: "DELIVERY_START" },
  { label: "배송완료", value: "DELIVERY_DONE" },
  { label: "판매취소", value: "SELLING_CANCLE" },
  { label: "취소요청", value: "CANCEL_REQUEST " },
  { label: "취소완료", value: "CANCEL_DONE" },
  { label: "반품요청", value: "RETURN_REQUEST" }, // MEMO 생식상품 제외하고 가능
  { label: "반품완료", value: "RETURN_DONE" }, // MEMO 생식상품 제외하고 가능
  { label: "교환요청", value: "EXCHANGE_REQUEST" }, // MEMO 생식상품 제외하고 가능
  { label: "교환완료", value: "EXCHANGE_DONE" }, // MEMO 생식상품 제외하고 가능
  { label: "실패함", value: "FAILED" },
  { label: "구매확정", value: "CONFIRM" }, // MEMO 구독상품: 배송완료후 / 단품: 사용자 구매확정 또는 배송완료 후 7일 경과후
*/

const TEST_DATA = { orderStatus: "EXCHANGE_REQUEST", itemList: [1, 2, 3] , paymentType:"일반주문"};

function Popup_MemeberDetailPage() {
  const router = useRouter();
  const orderIdx = router.query.orderIdx;

  const allData = TEST_DATA;
  const canceldOrderStatusList = [
    { boxLabel: "취소", value: "CANCEL_REQUEST" },
    { boxLabel: "취소", value: "CANCEL_DONE" },
    { boxLabel: "반품", value: "RETURN_REQUEST" },
    { boxLabel: "반품", value: "RETURN_DONE" },
    { boxLabel: "교환", value: "EXCHANGE_REQUEST" },
    { boxLabel: "교환", value: "EXCHANGE_DONE" },
  ];

  let isCanceledOrderStatus = false;
  let canceledOrderStatusLabel = "주문";
  for (let i = 0; i < canceldOrderStatusList.length; i++) {
    if (allData.orderStatus === canceldOrderStatusList[i].value) {
      isCanceledOrderStatus = true;
      canceledOrderStatusLabel = canceldOrderStatusList[i].boxLabel;
      break
    }
  }



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
                    <ProductInfo_basicOrderInfo
                      data={allData.paymentType}
                    />
                  </li>
                  {isCanceledOrderStatus && (
                    <li className={s["table-list"]}>
                      <ProductInfo_orderStatusInfo
                        data={allData}
                        boxLabel={canceledOrderStatusLabel}
                      />
                    </li>
                  )}
                  <li className={s["table-list"]}>
                    <div className={s["t-header"]}>
                      <h4 className={s.title}>
                        <span>{canceledOrderStatusLabel || "주문"}</span>상품
                      </h4>
                    </div>
                    {allData.itemList.map((data, index) => (
                      <ProductInfo_normItem
                        key={`product-items-list-${index}`}
                      />
                    ))}
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
