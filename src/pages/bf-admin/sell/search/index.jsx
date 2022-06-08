import React, { useState, useEffect } from "react";
import s from './search.module.scss';
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import SearchBar from "/src/components/admin/form/searchBar";
import SearchTerm from "/src/components/admin/form/searchBar/SearchTerm";
import SearchTextWithCategory from "/src/components/admin/form/searchBar/SearchTextWithCategory";
import SearchSelect from "/src/components/admin/form/searchBar/SearchSelect";
import SearchRadio from "/src/components/admin/form/searchBar/SearchRadio";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import Checkbox from "/src/components/atoms/Checkbox";
import SearchResultList from "./SearchResultList";
import Pagination from "/src/components/atoms/Pagination";

const TEST_ITEM = [1, 2, 3, 4, 5];

function SearchOnSellPage() {
  const [modalMessage, setModalMessage] = useState("");
  const [itemList, setItemList] = useState(TEST_ITEM);
  const [searchValue, setSearchValue] = useState({});

  console.log(searchValue);

  const onResetSearchValues = (e) => {
    setSearchValue("");
    console.log("초기화 실행");
  };

  const onSearchHandler = (e) => {
    console.log("검색 실행");
  };

  return (
    <>
      <MetaTitle title="주문 통합검색" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">통합 관리</h1>
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
                title="검색내용"
                name="content"
                id="content"
                options={[
                  { label: "주문번호", value: "orderIdx" },
                  { label: "구매자 이름", value: "buyerName" },
                  { label: "구매자 ID", value: "buyerId" },
                  { label: "수령자 이름", value: "receiverName" },
                ]}
              />
              <SearchSelect
                title="주문상태"
                name="status"
                id="status"
                options={[
                  { label: "전체", value: "ALL" },
                  { label: "구독보류", value: "HOLD" },
                  { label: "결제완료", value: "PAYMENT_DONE" },
                  { label: "생산 중", value: "PRUDUCING" },
                  { label: "배송준비 중", value: "DELIVERY_READY" },
                  { label: "배송시작", value: "DELIVERY_START" },
                  { label: "배송완료", value: "DELIVERY_DONE" },
                  { label: "판매취소", value: "SELLING_CANCLE" },
                  { label: "취소요청", value: "CANCEL_REQUEST " },
                  { label: "취소완료", value: "CANCEL_DONE" },
                  { label: "반품요청", value: "RETURN_REQUEST" },
                  { label: "반품완료", value: "RETURN_DONE" },
                  { label: "교환요청", value: "EXCHANGE_REQUEST" },
                  { label: "교환완료", value: "EXCHANGE_DONE" },
                  { label: "실패함", value: "FAILED" },
                  { label: "구매확정", value: "CONFIRM" },
                ]}
                onChange={setSearchValue}
                searchValue={searchValue}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="주문유형"
                name="orderType"
                idList={["ALL", "SINGLE", "SUBSCRIBE"]}
                labelList={["전체", "일반주문", "정기구독주문"]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
              <div className="controls cont-left">
                <button className="admin_btn line basic_m">주문확인</button>
                <button className="admin_btn line basic_m">발송처리</button>
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
                  <SearchResultList
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

export default SearchOnSellPage;
