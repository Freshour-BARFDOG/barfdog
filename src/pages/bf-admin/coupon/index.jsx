import React, { useState } from "react";
import s from "./coupon.module.scss";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import SearchBar from "@src/components/admin/form/SearchBar";
import Checkbox from "@src/components/atoms/Checkbox";
import Pagination from "@src/components/atoms/Pagination";
import SearchPlainInput from "@src/components/admin/form/SearchBar/SearchPlainInput";
import SearchRadio from "@src/components/admin/form/SearchBar/SearchRadio";



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
                idList={["ALL","AUTO", "MANUAL"]}
                labelList={['전체',"자동발행", "직접발행"]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                상품목록 &#40;총{" "}
                <em style={{ color: "var(--color-main)" }}>16</em>개&#41;
              </p>
              <div className="controls cont-left">
                <button className="admin_btn line basic_m">리뷰 승인</button>
                <button className="admin_btn line basic_m">
                  베스트 리뷰 선정
                </button>
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
                  <li className={s.table_th}>고유번호</li>
                  <li className={s.table_th}>처리상태</li>
                  <li className={s.table_th}>상품명</li>
                  <li className={`${s.table_th}`}>리뷰내용</li>
                  <li className={s.table_th}>평점</li>
                  <li className={s.table_th}>사용자 이름</li>
                  <li className={s.table_th}>사용자 ID</li>
                  <li className={s.table_th}>작성일</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
                  // <BestReviewList
                  //   items={itemList}
                  //   onDeleteItem={onDeleteItem}
                  // />
                  "아이템목록위치"
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
