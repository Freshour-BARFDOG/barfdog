import React, { useState, useEffect } from "react";
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";

import axios from "axios";
import s from "/styles/admin/mainBanner.module.scss";

import MainBannerList from './MainBannerList';
import AdminBtn_moveToPage from "@src/components/atoms/AdminBtn_moveToPage";

// import { getData, putData, deleteData } from "/api/reqData"; 
import { GetData, PutData, DeleteData } from "/api/reqData"; 
import AmdinErrorMessage from '@src/components/atoms/AmdinErrorMessage'





function MainBannerIndexPage(props) {



  const [itemList, setItemList] = useState([]);
  const [editListOrder, setEditListOrder] = useState(false);

  useEffect(() => {
    const getDataWithSettingState = (url, callback) => {
      const callbackWrapper = (res) => {
        const data = res.data._embedded.mainBannerListResponseDtoList;
        callback(data);
      };
      GetData(url, callbackWrapper);
    }

    getDataWithSettingState("/api/banners/main", setItemList);
  }, []);

  const onEditHandler = () => {
    setEditListOrder(true);
  };

  const onExitEditListOrderHandler = () => {
    setEditListOrder(false);
  };

  const onLeakedOrderUp = (apiURL) => {
    const data = ""; // ! PutData : 빈값 보내기
    PutData(apiURL, data);
    getDataWithSettingState("/api/banners/main", setItemList);
  };

  const onLeakedOrderDown = (apiURL) => {
    const data = ""; // ! PutData : 빈값 보내기
    PutData(apiURL, data);
    getDataWithSettingState("/api/banners/main", setItemList);
  };

  const onDeleteItem = (apiURL) => {
    DeleteData(apiURL);
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
              <p className="cont_title cont-left">목록</p>
              <div className="cont-right">
                <AdminBtn_moveToPage
                  text="배너등록"
                  href="/bf-admin/banner/main-banner/create"
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
                  <li className={s.table_th}>배너이름</li>
                  <li className={s.table_th}>이미지</li>
                  <li className={s.table_th}>노출대상</li>
                  <li className={s.table_th}>등록일</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
                  <MainBannerList
                    items_og={itemList}
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

export default MainBannerIndexPage;



MainBannerIndexPage.getInitialProps = async (ctx) => {
  console.log(ctx);
  // const token = localStorage.getItem('admin');
  // console.log(token);
  // const res = await axios
  //     .get("/api/banners/main", axiosConfig)
  //     .then((res) => {
  //       callback(res);
  //       return res;
  //     })
  //     .catch((err) => {
  //       console.log(err.response);
  //       console.log(err.request);
  //     });;
  // const json = await res.json();
  // console.log('SSR -> getInitialProps 테스트')
  // console.log(json)
  return { bannerlist: 'zzz' };
};