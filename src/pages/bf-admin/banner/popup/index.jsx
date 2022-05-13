import s from "./mainBanner.module.scss";
import React, { useState, useEffect } from "react";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";

import PopupList from "./PopupList";
import AdminBtn_moveToPage from "@src/components/atoms/AdminBtn_moveToPage";
import { getData, putData, deleteData } from "/api/reqData";
import AmdinErrorMessage from "@src/components/atoms/AmdinErrorMessage";




function PopupIndexPage() {
  const [itemList, setItemList] = useState([]);
  const [editListOrder, setEditListOrder] = useState(false);

  useEffect(() => {
    const getDataFromAPI = (res) => {
      console.log(res);
      const data = res.data._embedded.popupBannerListResponseDtoList;
      setItemList(data);
    };
     getData("/api/banners/popup", getDataFromAPI);

  }, []);


  const onEditHandler = () => {
    setEditListOrder(true);
  };

  const onExitEditListOrderHandler = () => {
    setEditListOrder(false);
  };

  const onLeakedOrderUp = (id) => {
    const data = '';
    putData(`api/banners/main/${id}/up`, data);
  };
  const onLeakedOrderDown = (id) => {
     const data = '';
    putData(`api/banners/main/${id}/down`, data);
  };

  const onDeleteItem = (id) => {
    deleteData(`api/banners/main/${id}`);
  };

  const BtnEditListOrder = () => (
    <button
      type="button"
      id="edit_order"
      className="admin_btn line basic_m"
      onClick={onEditHandler}
    >
      순서편집
    </button>
  );

  const BtnSave = () => (
    <button
      type="button"
      id="set_order"
      className="admin_btn line basic_m point"
      onClick={onExitEditListOrderHandler}
    >
      닫기
    </button>
  );



  return (
    <>
      <MetaTitle title="팝업 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">팝업 관리</h1>
          <div className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
              <div className="cont-right">
                <AdminBtn_moveToPage
                  text="팝업등록"
                  href="/bf-admin/banner/popup/create"
                  className="admin_btn confirm_m solid"
                  animation="show"
                />
              </div>
              <div className="controls cont-left">
                <BtnEditListOrder />
                {editListOrder && <BtnSave />}
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>순서</li>
                  <li className={s.table_th}>팝업이름</li>
                  <li className={s.table_th}>이미지</li>
                  <li className={s.table_th}>노출대상</li>
                  <li className={s.table_th}>등록일</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
                  <PopupList
                    items={itemList}
                    setItemList={setItemList}
                    setEditListOrder={setEditListOrder}
                    editListOrder={editListOrder}
                    onLeakedOrderUp={onLeakedOrderUp}
                    onLeakedOrderDown={onLeakedOrderDown}
                    onDeleteItem={onDeleteItem}
                  />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
              </div>
            </div>
          </div>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default PopupIndexPage;
