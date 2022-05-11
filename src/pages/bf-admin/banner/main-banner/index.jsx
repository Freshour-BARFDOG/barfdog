import s from "/styles/admin/mainBanner.module.scss";
import React, { useState, useEffect } from "react";
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";

import Modal from "@src/components/modal/Modal";
import ModalAlert from "@src/components/modal/Modal_alert";
import MainBannerList from './MainBannerList';
import AdminBtn_moveToPage from "@src/components/atoms/AdminBtn_moveToPage";
import axios from "axios";
import axiosConfig from "/api/axios.config"; 
import AmdinErrorMessage from '@src/components/atoms/AmdinErrorMessage';
import sorting from '@util/func/sorting';




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
}





function MainBannerIndexPage(props) {

  const [modalMessage, setModalMessage] = useState('');
  const [itemList, setItemList] = useState([]);
  const [editListOrder, setEditListOrder] = useState(false);

  useEffect(() => {
    getDataWithSettingState("/api/banners/main", setItemList);
  }, []);





  const onEditHandler = () => {
    if (!itemList.length) return;
    setEditListOrder(true);
  };



  const onExitEditListOrderHandler = () => {
    setEditListOrder(false);
  };




  const onLeakedOrderUp = (url) => {
    const data = ""; // ! PutData : 빈값 보내기
    axios
      .put(url, data, axiosConfig())
      .then(() => {
        getDataWithSettingState("/api/banners/main", setItemList);
      })
      .catch((err) => {
        alert('전송실패: ',err)
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
  
  const onHideModalHandler = (isConfirm) => {
    setModalMessage(false);
  }




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
              </div>
            </div>
          </div>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
      {modalMessage && (
        <Modal onClick="" title="비밀번호 재설정">
          <ModalAlert text={modalMessage} isConfirm={onHideModalHandler} />
        </Modal>
      )}
    </>
  );
}

export default MainBannerIndexPage;








MainBannerIndexPage.getInitialProps = async (ctx) => {
  // console.log(ctx);
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
  return { bannerlist: 'test' };
};