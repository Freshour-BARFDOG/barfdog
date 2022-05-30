import React, { useState, useEffect } from "react";
import s from "./return.module.scss";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import SearchBar from "@src/components/admin/form/SearchBar";
import SearchTerm from "@src/components/admin/form/SearchBar/SearchTerm";
import SearchTextWithCategory from "@src/components/admin/form/SearchBar/SearchTextWithCategory";
import SearchRadio from "@src/components/admin/form/SearchBar/SearchRadio";
import AmdinErrorMessage from "@src/components/atoms/AmdinErrorMessage";
import Checkbox from "@src/components/atoms/Checkbox";
import ReturnList from "./ReturnList";
import Pagination from "@src/components/atoms/Pagination";



const TEST_ITEM = [1, 2, 3, 4, 5];


function ReturnOnSellPage() {

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
      <MetaTitle title="반품 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">반품 관리</h1>
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
                idList={["RETURN ALL", "RETURN REQUEST", "RETURN DONE "]}
                labelList={["반품전체", "반품요청", "반품완료"]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
              <div className="controls cont-left">
                <button className="admin_btn line basic_m">
                  반품승인&#40;구매자&#41;
                </button>
                <button className="admin_btn line basic_m">
                  반품승인&#40;판매자&#41;
                </button>
                <button className="admin_btn line basic_m">반품불가</button>
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>
                    <Checkbox id="checkAll" onClick={""} />
                  </li>
                  <li className={s.table_th}>상세보기</li>
                  <li className={s.table_th}>주문번호</li>
                  <li className={s.table_th}>상품주문번호</li>
                  <li className={s.table_th}>주문상태</li>
                  <li className={s.table_th}>반품사유</li>
                  <li className={s.table_th}>구매자 ID</li>
                  <li className={s.table_th}>구매자</li>
                  <li className={s.table_th}>수령자</li>
                  <li className={s.table_th}>묶음배송 여부</li>
                </ul>
                {itemList.length ? (
                  <ReturnList
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

export default ReturnOnSellPage;
