import React, { useState, useEffect } from "react";
import s from "./mainBanner.module.scss";
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import MainBannerList from './MainBannerList';
import AdminBtn_moveToPage from "@src/components/atoms/AdminBtn_moveToPage";
import rem from '@src/components/atoms/rem';
import MetaTitle from "@src/components/atoms/MetaTitle";


function MainBannerIndexPage() {

  const items = [
    {
      order: 1,
      name: "메인배너",
      link: "https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1",
      exp_target: "비회원",
      reg_date: "22/01/14",
    },
    {
      order: 2,
      name: "메인배너2",
      link: "https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1",
      exp_target: "회원",
      reg_date: "22/04/19",
    },
    {
      order: 3,
      name: "메인배너3",
      link: "https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1",
      exp_target: "전체",
      reg_date: "22/05/19",
    },
  ];




  const [itemList, setItemList] = useState(items);
  const [originItemList, setOriginItemList] = useState(items);
  const [editListOrder, setEditListOrder] = useState(false);
  const [confirmListOrder, setConfirmListOrder] = useState(false);

  const onEditHandler = () => {

    if (editListOrder) {
      // console.log("에딧: 활성 -> 비활성");
      setEditListOrder(false);
      if(confirmListOrder){
        // console.log('변경된 아이템리스트 저장');
        setItemList(itemList); // 현재 변경된 아이템리스트를 넣어야한다.
        setOriginItemList(itemList);
      }else{
        // console.log('아이템리스트 초기화');
        setItemList(originItemList); // 원래 아이템리스트로 초기화한다.
        setConfirmListOrder(false);
      }
    } else {
      // console.log("에딧: 비활성 -> 활성");
      setEditListOrder(true);
      setConfirmListOrder(false);
    }; 
  }


  const onSaveItemListOrderHandler = () => {
    setConfirmListOrder(true);
  }

  const onDeleteItemList = () => {
    // setConfirmListOrder(true);
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
      animation="show"
      onClick={onSaveItemListOrderHandler}
    >
      저장
    </button>
  );


  return (
    <>
      <MetaTitle title="메인 배너" />
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
                  editListOrder={editListOrder}
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