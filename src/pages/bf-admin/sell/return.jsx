import React, { useState, useEffect } from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import SearchBar from "@src/components/admin/form/SearchBar";
import SearchTerm from "@src/components/admin/form/SearchBar/SearchTerm";
import SearchTextWithCategory from "@src/components/admin/form/SearchBar/SearchTextWithCategory";
import SearchRadio from "@src/components/admin/form/SearchBar/SearchRadio";




function ReturnOnSellPage() {


  const [modalMessage, setModalMessage] = useState("");
  const [itemList, setItemList] = useState("");
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
          {" "}
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
                title="종류"
                name="status"
                idList={["ALL", "RETURN REQUEST", "RETURN DONE"]}
                labelList={["전체", "반품요청", "반품완료"]}
              />
            </SearchBar>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ReturnOnSellPage;
