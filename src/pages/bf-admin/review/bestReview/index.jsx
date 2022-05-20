import s from "../adminReview.module.scss";
import React, { useState, useEffect } from "react";
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";

import BestReviewList from "./BestReviewList";
import axios from "axios";
import axiosConfig from "/api/axios.config";
import AmdinErrorMessage from "@src/components/atoms/AmdinErrorMessage";
import sorting from "@util/func/sorting";
import {
  Button_EditListOrder,
  Button_InactiveEditListOrder,
} from "@src/components/atoms/Button_EditListOrder";
import Pagination from "@src/components/atoms/Pagination";

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


const TEST_ITEM = [1,2,3,4,5]



function BestReviewPage(props) {
  const [modalMessage, setModalMessage] = useState("");
  const [itemList, setItemList] = useState(TEST_ITEM);
  const [editListOrder, setEditListOrder] = useState(false);

  useEffect(() => {
    getDataWithSettingState("/api/banners/main", setItemList);
  }, []);

  const onLeakedOrderUp = (url) => {
    const data = ""; // ! PutData : 빈값 보내기
    axios
      .put(url, data, axiosConfig())
      .then(() => {
        getDataWithSettingState("/api/banners/main", setItemList);
      })
      .catch((err) => {
        alert("전송실패: ", err);
      });
  };

  const onLeakedOrderDown = (url) => {
    const data = ""; // ! PutData : 빈값 보내기
    axios
      .put(url, data, axiosConfig())
      .then(() => {
        getDataWithSettingState("/api/banners/main", setItemList);
      })
      .catch((err) => {
        alert("전송실패: ", err);
      });
  };

  const onDeleteItem = (url) => {
    axios
      .delete(url, axiosConfig())
      .then((res) => {
        console.log(res);
        getDataWithSettingState("/api/banners/main", setItemList);
        setModalMessage("배너가 삭제되었습니다.");
      })
      .catch((err) => {
        setModalMessage("삭제 실패: ", err);
      });
  };


  return (
    <>
      <MetaTitle title="베스트리뷰 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">베스트리뷰 관리</h1>
          <div className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
              <div className="controls cont-left">
                <Button_EditListOrder
                  itemList={itemList}
                  setEditListOrder={setEditListOrder}
                />
                {editListOrder && (
                  <Button_InactiveEditListOrder
                    itemList={itemList}
                    setEditListOrder={setEditListOrder}
                  />
                )}
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>순서</li>
                  <li className={s.table_th}>고유번호</li>
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
                    setItemList={setItemList}
                    setEditListOrder={setEditListOrder}
                    editListOrder={editListOrder}
                    onLeakedOrderUp={onLeakedOrderUp}
                    onLeakedOrderDown={onLeakedOrderDown}
                    onDeleteItem={onDeleteItem}
                    getDataWithSettingState={getDataWithSettingState}
                  />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}

                {/* // * ---------------- 임시 ---------------- */}
                <ul className={s.table_body}>
                  <li
                    className={s.item}
                    key={`item-${"DATA.id"}`}
                    data-leaked-order={""}
                  >
                    {/* <SortHandle apiurl={'DATA.apiurl'} /> */}
                    <span>{"DATA.leakedOrder"}</span>

                    {/* // ! 베스트 리뷰 내용에 맞게 바꿔야함 */}
                    <span>{"DATA.reviewId"}</span>
                    <span>
                      <em className={`text-transform-ellipsis`}>
                        {
                          "상품명상품명상품명상품명상품명상품명상품명상품명상품명"
                        }
                      </em>
                    </span>
                    <span>
                      <button
                        data-review-id="리뷰고유값넣기"
                        className={"text-transform-ellipsis btn_link"}
                      >
                        {
                          "리뷰내용리뷰내용리뷰내용리뷰내용리뷰내용리뷰내용리뷰내용리뷰내용리뷰내용리뷰내용"
                        }
                      </button>
                    </span>
                    <span>{"DATA.rating"}</span>
                    <span>{"DATA.userName"}</span>
                    <span>{"DATA.userId"}</span>
                    <span>{"DATA.reg_date"}</span>
                    <span>
                      <button
                        className="admin_btn basic_s solid"
                        // onClick={onDeleteItemHandler}
                        // data-apiurl={'DATA.apiurl'.delete}
                      >
                        삭제
                      </button>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className={s["pagination-section"]}>
              <Pagination
                itemCountPerGroup={10}
                itemTotalCount={100}
                className={"square"}
              />
            </div>
          </div>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default BestReviewPage;
