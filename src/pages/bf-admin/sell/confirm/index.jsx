import React, { useState, useEffect } from "react";
import s from "./confirm.module.scss";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import SearchBar from "@src/components/admin/form/searchBar";
import SearchTerm from "@src/components/admin/form/searchBar/SearchTerm";
import SearchTextWithCategory from "@src/components/admin/form/searchBar/SearchTextWithCategory";
import SearchRadio from "@src/components/admin/form/searchBar/SearchRadio";
import AmdinErrorMessage from "@src/components/atoms/AmdinErrorMessage";
import ConfirmList from "./ConfirmList";
import Pagination from "@src/components/atoms/Pagination";



const TEST_ITEM = [1, 2, 3, 4, 5];


function ConfirmOnSellPage() {

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

  return (
    <>
      <MetaTitle title="구매확정 내역" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">구매확정 내역</h1>
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
                title="주문유형"
                name="orderType"
                idList={["ALL", "SINGLE", "SUBSCRIBE"]}
                labelList={["전체", "일반주문", "정기구독주문"]}
              />
              <div className="hide">
                <SearchRadio
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  title="구매확정"
                  name="status"
                  idList={["CONFIRM"]}
                  labelList={["구매확정"]}
                />
              </div>
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>상세보기</li>
                  <li className={s.table_th}>주문번호</li>
                  <li className={s.table_th}>상품주문번호</li>
                  <li className={s.table_th}>주문상태</li>
                  <li className={s.table_th}>배송상태</li>
                  <li className={s.table_th}>구매자 ID</li>
                  <li className={s.table_th}>구매자</li>
                  <li className={s.table_th}>수령자</li>
                  <li className={s.table_th}>묶음배송 여부</li>
                </ul>
                {itemList.length ? (
                  <ConfirmList
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

export default ConfirmOnSellPage;
