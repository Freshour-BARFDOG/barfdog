import s from "./member.module.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosConfig from "/api/axios.config";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import AmdinErrorMessage from "@src/components/atoms/AmdinErrorMessage";
import Pagination from "@src/components/atoms/Pagination";
import SearchBar from "@src/components/admin/form/searchBar";
import SearchTerm from "@src/components/admin/form/searchBar/SearchTerm";
import SearchTextWithCategory from "@src/components/admin/form/searchBar/SearchTextWithCategory";
import MemberList from './MemberList'
import ToolTip from '@src/components/atoms/Tooltip'






const TEST_ITEM = [1,2,3,4,5];


function ManageUserPage() {
  const [modalMessage, setModalMessage] = useState("");
  const [itemList, setItemList] = useState(TEST_ITEM);
  const [searchValue, setSearchValue] = useState({});

  // console.log(searchValue);

  const onResetSearchValues = (e) => {
    setSearchValue("");
    console.log("초기화 실행");
  };

  const onSearchHandler = (e) => {
    console.log("검색 실행");
  };


  return (
    <>
      <MetaTitle title="회원 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">회원 관리</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchTerm
                title={"조회기간"}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                tooltip={<ToolTip message={"회원가입 시점"} />}
              />
              <SearchTextWithCategory
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="회원검색"
                name="search-category"
                id="search-category"
                options={[
                  { label: "아이디", value: "id" },
                  { label: "이름", value: "name" },
                ]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">회원목록</p>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>상세보기</li>
                  <li className={s.table_th}>등급</li>
                  <li className={s.table_th}>이름</li>
                  <li className={s.table_th}>아이디</li>
                  <li className={`${s.table_th}`}>연락처</li>
                  <li className={s.table_th}>대표견명</li>
                  <li className={s.table_th}>정기구독여부</li>
                  <li className={s.table_th}>누적구매금액</li>
                  <li className={s.table_th}>장기미접속</li>
                </ul>
                {itemList.length ? (
                  <MemberList items={itemList} />
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

export default ManageUserPage;
