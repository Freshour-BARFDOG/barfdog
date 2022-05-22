import React, { useState, useEffect } from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import Pagination from "@src/components/atoms/Pagination";
import SearchBar from "@src/components/admin/form/SearchBar";
import SearchTerm from "@src/components/admin/form/SearchBar/SearchTerm";
import SearchTextWithCategory from "@src/components/admin/form/SearchBar/SearchTextWithCategory";
import SearchSelect from "@src/components/admin/form/SearchBar/SearchSelect";
import SearchRadio from "@src/components/admin/form/SearchBar/SearchRadio";



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
          <h1 className="title_main">회원 관리</h1>
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
                  { label: "결제완료", value: "PAYMENT DONE" },
                  { label: "생산 중", value: "PRUDUCING" },
                  { label: "배송준비 중", value: "READY TO DELIVERY" },
                  { label: "배송시작", value: "START TO DELIVERY" },
                  { label: "판매취소", value: "SELLING CANCLE" },
                  { label: "취소요청", value: "CANCEL REQUEST " },
                  { label: "취소완료", value: "CANCEL DONE" },
                  { label: "반품요청", value: "RETURN REQUEST" },
                  { label: "반품완료", value: "RETURN DONE" },
                  { label: "교환요청", value: "EXCHANGE REQUEST" },
                  { label: "교환완료", value: "EXCHANGE DONE" },
                  { label: "실패함", value: "FAIL TO PAYMENT" },
                  { label: "구매확정", value: "CONFIRM PURCHASE" },
                ]}
                onChange={setSearchValue}
                searchValue={searchValue}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="종류"
                name="status"
                idList={["ALL", "SINGLE", "SUBSCRIBE"]}
                labelList={["전체", "일반주문", "정기구독주문"]}
              />
            </SearchBar>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default SearchOnSellPage;
