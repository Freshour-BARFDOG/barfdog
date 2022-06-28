import s from "./member.module.scss";
import React, { useState, useEffect } from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import AmdinErrorMessage from "@src/components/atoms/AmdinErrorMessage";
import SearchBar from "@src/components/admin/form/searchBar";
import SearchTerm from "@src/components/admin/form/searchBar/SearchTerm";
import SearchTextWithCategory from "@src/components/admin/form/searchBar/SearchTextWithCategory";
import MemberList from './MemberList'
import ToolTip from '@src/components/atoms/Tooltip'
import {getData} from "/api/reqData";


// TODO >
// - 검색기능
// -  회원정보 조회기능 > 검색 시, 기본값으로 먼저 전달한다.


function ManageUserPage() {
  const getListApiUrl = '/api/admin/members';

  const [modalMessage, setModalMessage] = useState("");
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState({});
  const [searchValue, setSearchValue] = useState({});

  // console.log(searchValue);
  useEffect(() => {
    (async ()=>{
      const res = await getData(`/api/admin/members?page=1&size=5&email=&name=&from=2020-01-01&to=2022-06-24`);

    })()

  }, []);


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
            <div className={s['pagination-section']}>
              {/*<PaginationWithAPI*/}
              {/*  apiURL={getListApiUrl}*/}
              {/*  size={1}*/}
              {/*  theme={'square'}*/}
              {/*  setItemList={setItemList}*/}
              {/*  queryItemList={'queryBlogsAdminDtoList'}*/}
              {/*  setIsLoading={setIsLoading}*/}
              {/*/>*/}
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ManageUserPage;
