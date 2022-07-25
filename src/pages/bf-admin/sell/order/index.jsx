import React, { useState, useEffect } from "react";
import s from "./order.module.scss";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import SearchBar from "/src/components/admin/form/searchBar";
import SearchTerm from "/src/components/admin/form/searchBar/SearchTerm";
import SearchTextWithCategory from "/src/components/admin/form/searchBar/SearchTextWithCategory";
import SearchRadio from "/src/components/admin/form/searchBar/SearchRadio";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import Checkbox from "/src/components/atoms/Checkbox";
import OrderList from "./OrderList";
import Pagination from "/src/components/atoms/Pagination";
import {getGoodsFlowOtp, postGoodsFlowOrder} from '/src/pages/api/goodsFlow/service';
import axios from "axios";
import Router from 'next/router';

const TEST_ITEM = [
  { id: "0", paymentType: "subscribe" },
  { id: "1", paymentType: "single" },
  { id: "2", paymentType: "subscribe" },
  { id: "3", paymentType: "single" },
  { id: "4", paymentType: "single" },
];


function OrderOnSellPage() {

  const [modalMessage, setModalMessage] = useState("");
  const [itemList, setItemList] = useState(TEST_ITEM);
  const [searchValue, setSearchValue] = useState({});

  const onResetSearchValues = (e) => {
    setSearchValue("");
    console.log("초기화 실행");
  };

  const onSearchHandler = (e) => {
    console.log("검색 실행");
  };    

  console.log(searchValue);

  // 발송처리
  const orderPrint = async() => {
    // GoodsFlow 서버에 주문 등록 후 운송장 출력
    // TODO: 주문 데이터 update
    const data = {
      data: {
        items: [
      {
      transUniqueCd: "t0001", 
      centerCode: "BARFDOG", 
      deliverCode: "CJGLS",
      sndName: "바프독",
      sndZipCode: "27352",
      sndAddr1:"충청북도 충주시 번영대로 208", 
      sndTel1: "0438554995",
      mallId:"BARFDOG",
      rcvName: "구매인",
      rcvZipCode:"48060",
      rcvAddr1:"부산시 해운대구 센텀2로19",
      rcvTel1:"0515550001",
      status: "O",
      boxSize: "02", 
      paymentTypeCode: "SH",
      msgToTrans: "경비실에 부탁합니다", 
      orderItems: [
      {
      uniqueCd: "o0001-01", 
      ordNo: "o0001", 
      ordLineNo: 1,
      itemName: "종합선물", itemQty: 1,
      ordDate: "20220105114300", 
      defCode1:"바프독"
      }, {
          uniqueCd: "o0001-02", ordNo: "o0002",
          ordLineNo: 2,
      itemName: "종합선물포장지", 
      itemQty: 1,
      ordDate: "20220105114300",
      defCode1:"바프독" }
      ] }]}
      };
    const otp = await getGoodsFlowOtp();
    const id = await postGoodsFlowOrder(data); 
    await axios
    .post(
    'http://localhost:4000/api/goodsFlow/print',
{
        otp:otp,
        id:id
    },
    {headers: {
      'Content-Type': 'application/json',}}
    
  )
   .then((res) => {
     console.log(
       '------------------------------------------------------------------ AXIOS > RESPONSE ------------------------------------------------------------------ ',
       res,
     );
     console.log(res.data.data);
     
     return res.data.data;
 }); 
    Router.push({
      // pathname: '/_test/print',
      pathname:'/bf-admin/sell/delivery/print',
      query: { otp: otp, id: id },
    });
    
  }

  return (
    <>
      <MetaTitle title="주문 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">주문 관리</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchTerm
                title={"조회기간"}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
              <SearchTextWithCategory
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="조건검색"
                name="content"
                id="content"
                options={[
                  { label: "주문번호", value: "orderIdx" },
                  { label: "구매자 이름", value: "buyerName" },
                  { label: "구매자 ID", value: "buyerId" },
                  { label: "수령자 이름", value: "receiverName" },
                ]}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="처리상태"
                name="status"
                idList={["PAYMENT DONE", "DELIVERY", "FAIL TO PAYMENT"]}
                labelList={["결제완료", "배송 준비/생산 중", "결제실패"]}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="주문유형"
                name="orderType"
                idList={["SINGLE", "SUBSCRIBE"]}
                labelList={["일반주문", "정기구독주문"]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
              <div className="controls cont-left">
                <button className="admin_btn line basic_m">주문확인</button>
                <button className="admin_btn line basic_m" onClick={orderPrint}>발송처리</button>
                <button className="admin_btn line basic_m">판매취소</button>
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>
                    <Checkbox
                      id="checkAll"
                      onClick={(e) => {
                        console.log(e);
                      }}
                    />
                  </li>
                  <li className={s.table_th}>상세보기</li>
                  <li className={s.table_th}>주문번호</li>
                  <li className={s.table_th}>상품주문번호</li>
                  <li className={s.table_th}>주문상태</li>
                  <li className={s.table_th}>구매자 ID</li>
                  <li className={s.table_th}>구매자</li>
                  <li className={s.table_th}>수령자</li>
                  <li className={s.table_th}>묶음배송 여부</li>
                </ul>
                {itemList.length ? (
                  <OrderList
                    items={itemList}
                    // onDeleteItem={onDeleteItem}
                  />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
              </div>
            </div>
            <div className={s["pagination-section"]}>
              <Pagination
                itemCountPerGroup={10}
                itemTotalCount={100}
                className={"square"}
              />
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default OrderOnSellPage;
