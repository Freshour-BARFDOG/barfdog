import React, { useState, useEffect } from "react";
import s from "/styles/admin/mainBanner.module.scss";
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import MainBannerList from './MainBannerList';
import AdminBtn_moveToPage from "@src/components/atoms/AdminBtn_moveToPage";
import rem from '@src/components/atoms/rem';
import MetaTitle from "@src/components/atoms/MetaTitle";
import { getData, putData, deleteData } from "/api/reqData";

// - [ ]  메인배너 리스트 > 순서 편집
// - [ ]  메인배너리스트 > 수정
// - [ ]  메인배너리스트 > 삭제



function MainBannerIndexPage() {
  const [itemList, setItemList] = useState([]);
  const [editListOrder, setEditListOrder] = useState(false);

  useEffect(() => {
    const getDataFromAPI = (res) => {
      const data = res.data._embedded.mainBannerListResponseDtoList;
      setItemList(data);
    };
    getData("/api/banners/main", getDataFromAPI);
  }, []);

  const onEditHandler = () => {
    setEditListOrder(true);
  };

  const onExitEditListOrderHandler = () => {
    setEditListOrder(false);
  };

  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  
  const onLeakedOrderUp = (id) => {
    putData(`api/banners/main/${id}/up`);
  };
  const onLeakedOrderDown = (id) => {
    putData(`api/banners/main/${id}/down`);
  };

  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */
  /* // ! ----- 순서변경기능 : CORS POLICY에 걸림 ---- ! */

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
      <MetaTitle title="메인 배너 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">메인배너</h1>
          <div className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left" style={{ height: rem(44) }}>
                목록
              </p>
              <div className="cont-right">
                <AdminBtn_moveToPage
                  text="배너등록"
                  href="/bf-admin/banner/main-banner/createMainBanner"
                  className="admin_btn confirm_m solid"
                  animation="show"
                />
              </div>
              <div className="controls cont-left">
                <BtnEditListOrder />
                {editListOrder && <BtnSave />}
              </div>
            </div>
            <div className={s.cont_viewer}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>순서</li>
                  <li className={s.table_th}>배너이름</li>
                  <li className={s.table_th}>이미지</li>
                  <li className={s.table_th}>노출대상</li>
                  <li className={s.table_th}>등록일</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                <MainBannerList
                  items={itemList}
                  setItemList={setItemList}
                  setEditListOrder={setEditListOrder}
                  editListOrder={editListOrder}
                  onLeakedOrderUp={onLeakedOrderUp}
                  onLeakedOrderDown={onLeakedOrderDown}
                  onDeleteItem={onDeleteItem}
                />
              </div>
            </div>
          </div>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default MainBannerIndexPage;