import React, { useState } from "react";
import s from './single.module.scss';
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import axios from "axios";
import axiosConfig from "/api/axios.config";
import AmdinErrorMessage from "@src/components/atoms/AmdinErrorMessage";
import sorting from "@util/func/sorting";
import Pagination from "@src/components/atoms/Pagination";
import SearchBar from "@src/components/admin/form/searchBar";
import SearchSelect from "@src/components/admin/form/searchBar/SearchSelect";
import SearchPlainInput from "@src/components/admin/form/searchBar/SearchPlainInput";
import SingleList from "./SingleList";




const TEST_ITEM = [1, 2, 3, 4, 5];



function SingleItemPage() {

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
      <MetaTitle title="단품 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">단품 관리</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchSelect
                title="카테고리"
                name="category"
                id="category"
                options={[
                  { label: "전체", value: "ALL" },
                  { label: "생식", value: "RAW" },
                  { label: "토핑", value: "TOPPING" },
                  { label: "기타", value: "ETC" },
                ]}
                onChange={setSearchValue}
                searchValue={searchValue}
              />
              <SearchPlainInput
                title="소항목 타이틀"
                name={"single-title"}
                onChange={setSearchValue}
                searchValue={searchValue}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                상품목록 &#40;총<em className={s["product-count"]}>16</em>
                개&#41;
              </p>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>레시피명</li>
                  <li className={s.table_th}>카테고리</li>
                  <li className={s.table_th}>상품명</li>
                  <li className={s.table_th}>판매가</li>
                  <li className={s.table_th}>재고수량</li>
                  <li className={s.table_th}>할인률</li>
                  <li className={s.table_th}>노출여부</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
                  <SingleList
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

export default SingleItemPage;
