import React, { useState } from "react";
import s from "../coupon.module.scss";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import SearchBar from "@src/components/admin/form/searchBar";
import Pagination from "@src/components/atoms/Pagination";
import SearchPlainInput from "@src/components/admin/form/searchBar/SearchPlainInput";
import SearchRadio from "@src/components/admin/form/searchBar/SearchRadio";
import AmdinErrorMessage from "@src/components/atoms/AmdinErrorMessage";
import CouponList from "./CouponList";


const TEST_ITEM = [1, 2, 3, 4, 5];


function CouponListPage() {
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
      <MetaTitle title="쿠폰 조회" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">쿠폰 조회</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchPlainInput
                title="쿠폰이름"
                name={"coupon-name"}
                onChange={setSearchValue}
                searchValue={searchValue}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="종류"
                name="coupon-type"
                idList={["ALL", "AUTO", "MANUAL"]}
                labelList={["전체", "자동발행", "직접발행"]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                쿠폰목록
              </p>
              <div className="controls cont-left">
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>쿠폰코드</li>
                  <li className={s.table_th}>쿠폰종류</li>
                  <li className={s.table_th}>쿠폰이름</li>
                  <li className={s.table_th}>쿠폰설명</li>
                  <li className={s.table_th}>할인금액</li>
                  <li className={s.table_th}>사용처</li>
                  <li className={s.table_th}>사용한도</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
                  <CouponList
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
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CouponListPage;
