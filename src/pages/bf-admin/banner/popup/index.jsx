import s from './popup.module.scss';
import React, { useState, useEffect } from 'react';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import axios from 'axios';
import axiosConfig from '/api/axios.config';
import PopupList from './PopupList';
import AdminBtn_moveToPage from '@src/components/atoms/AdminBtn_moveToPage';
import { getData } from '/api/reqData';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import Spinner from '/src/components/atoms/Spinner';
import sorting from "/util/func/sorting";


function PopupIndexPage() {
  const getFormValuesApiUrl = `/api/banners/popup`;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [orderEditMode, setOrderEditMode] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  // useEffect(() => {
  //   let sortedList = sorting(itemList, 'leakedOrder');
  //   setItemList(sortedList)
  // }, [itemList]);


  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getFormValuesApiUrl);
        const DATA = res.data._embedded.popupBannerListResponseDtoList;
        let sortedList = sorting(DATA, 'leakedOrder');
        setItemList(sortedList)
        console.log(res);
      } catch (err) {
        console.error(err);
        alert('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [fetchingData]);


  const onStartEditMode = () => {
    setOrderEditMode(true);
  };

  const onEndEditMode = () => {
    setOrderEditMode(false);
  };



  const BtnEditListOrder = () => (
    <button
      type="button"
      id="edit_order"
      className="admin_btn line basic_m"
      onClick={onStartEditMode}
    >
      순서편집
    </button>
  );

  const BtnSave = () => (
    <button
      type="button"
      id="set_order"
      className="admin_btn line basic_m point"
      onClick={onEndEditMode}
    >
      닫기
    </button>
  );

  return (
    <>
      <MetaTitle title="팝업 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              팝업 관리
              {isLoading.fetching && (
                <Spinner
                  style={{ color: 'var(--color-main)', width: '20', height: '20' }}
                  speed={0.6}
                />
              )}
            </h1>
          </div>
          <section className="cont">
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
                {orderEditMode && <BtnSave />}
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>순서</li>
                  <li className={s.table_th}>팝업이름</li>
                  <li className={s.table_th}>이미지</li>
                  <li className={s.table_th}>등록일</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
                  <PopupList
                    items={itemList}
                    orderEditMode={orderEditMode}
                    onUpdateList={setFetchingData}
                  />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
              </div>
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default PopupIndexPage;
