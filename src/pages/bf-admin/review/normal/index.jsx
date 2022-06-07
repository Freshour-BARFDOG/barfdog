import s from "./review.module.scss";
import React, { useState, useEffect } from "react";
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import BestReviewList from "./ReviewList";
import axios from "axios";
import axiosConfig from "/api/axios.config";
import AmdinErrorMessage from "@src/components/atoms/AmdinErrorMessage";
import Checkbox from "@src/components/atoms/Checkbox";

import sorting from "@util/func/sorting";
import Pagination from "@src/components/atoms/Pagination";
import SearchBar from "@src/components/admin/form/searchBar";
import SearchTerm from '@src/components/admin/form/searchBar/SearchTerm';
import SearchRadio from "@src/components/admin/form/searchBar/SearchRadio";

 

const TEST_ITEM = [1,2,3,4,5]




const getDataWithSettingState = (url, callback) => {
  axios
    .get(url, axiosConfig())
    .then((res) => {
      const allData = res.data._embedded.mainBannerListResponseDtoList;
      const arrangedItems = sorting(allData, "leakedOrder");
      if (arrangedItems) callback(arrangedItems);
    })
    .catch((err) => {
      console.error(err);
    });
};




function ReviewPage(props) {
  const [modalMessage, setModalMessage] = useState("");
  const [itemList, setItemList] = useState(TEST_ITEM);
  const [searchValue, setSearchValue] = useState({});


  console.log(searchValue);

  useEffect(() => {
    getDataWithSettingState("/api/review", setItemList);
  }, []);


  const onDeleteItem = (url) => {
    axios
      .delete(url, axiosConfig())
      .then((res) => {
        console.log(res);
        getDataWithSettingState("/api/review", setItemList);
        setModalMessage("리뷰가 삭제되었습니다.");
      })
      .catch((err) => {
        setModalMessage("삭제 실패: ", err);
      });
  };
  
  const onResetSearchValues = (e) => {
    setSearchValue('');
    console.log('초기화 실행')
    
  }

  const onSearchHandler = (e) => {
      console.log('검색 실행')
      
  }


  return (
    <>
      <MetaTitle title="리뷰 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">리뷰 관리</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchTerm
                title={"조회기간"}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="처리상태"
                name="review-status"
                idList={["ALL", "REQUEST", "CONFIRM", "REJECT"]}
                labelList={["전체", "요청", "승인", "반려"]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
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
                  <BestReviewList
                    items={itemList}
                    onDeleteItem={onDeleteItem}
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

export default ReviewPage;
