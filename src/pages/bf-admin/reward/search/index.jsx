import React, { useState } from "react";
import s from "../reward.module.scss";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import Pagination from "@src/components/atoms/Pagination";
import SearchBar from "@src/components/admin/form/searchBar";
import SearchTerm from "@src/components/admin/form/searchBar/SearchTerm";
import SearchTextWithCategory from "@src/components/admin/form/searchBar/SearchTextWithCategory";
import AmdinErrorMessage from "@src/components/atoms/AmdinErrorMessage";
import RewardList from "./RewardList";


const TEST_ITEM = [1, 2, 3, 4, 5];


function RewardListPage() {
  
  const getListApiUrl = '/api/admin/rewards?page=1&size=5&email="a"&name=""&from=2002-07-06&to=2022-07-06'
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
      <MetaTitle title="적립금 조회" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">적립금 조회</h1>
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
                  { label: "아이디", value: "userId" },
                  { label: "이름", value: "useName" },
                ]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">적립금 목록</p>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>적립일자</li>
                  <li className={s.table_th}>적립급명칭</li>
                  <li className={s.table_th}>금액</li>
                  <li className={s.table_th}>회원이름</li>
                  <li className={s.table_th}>아이디</li>
                </ul>
                {itemList.length ? (
                  <RewardList
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

export default RewardListPage;
