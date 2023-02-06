import s from "./mainBanner.module.scss";
import React, {useState, useEffect, useCallback} from "react";
import AdminLayout from "/src/components/admin/AdminLayout";
import {AdminContentWrapper} from "/src/components/admin/AdminWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import MainBannerList from './MainBannerList';
import AdminBtn_moveToPage from "/src/components/atoms/AdminBtn_moveToPage";
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import sorting from '/util/func/sorting';
import {
  Button_EditListOrder,
  Button_InactiveEditListOrder,
} from "/src/components/atoms/Button_EditListOrder";
import {useModalContext} from "/store/modal-context";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import Spinner from "/src/components/atoms/Spinner";
import {MirrorTextOnHoverEvent} from "@util/func/MirrorTextOnHoverEvent";
import {deleteObjData, getData, putObjData} from "/src/pages/api/reqData";



function MainBannerIndexPage () {
  
  
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [itemList, setItemList] = useState( [] );
  const [editListOrder, setEditListOrder] = useState( false );
  const [isLoading, setIsLoading] = useState( {} );
  
  
  useEffect( () => {
    MirrorTextOnHoverEvent( window );
  }, [itemList] );
  
  useEffect( () => {
    getItemList();
  }, [] );
  
  const getItemList = useCallback( () => (async () => {
    setIsLoading( (prevState) => ({
      ...prevState,
      fetching: true,
    }) );
    try {
      const apiUrl = "/api/banners/main";
      const res = await getData( apiUrl, "admin" );
      // console.log( res );
      if ( res.status === 200 && res.data?._embedded ) {
        let data = res.data._embedded.mainBannerListResponseDtoList;
        const sortedList = data.length ? sorting( data, "leakedOrder" ) : [];
        setItemList( sortedList );
      }
    } catch (err) {
      mct.alertShow( "서버 통신장애 발생" );
      console.error( err );
    } finally {
      setIsLoading( (prevState) => ({
        ...prevState,
        fetching: false,
      }) );
    }
  })(), [] );
  
  
  const updateLeakedOrderHandler = useCallback( async (url) => {
    try {
      setIsLoading( (prevState) => ({
        ...prevState,
        editOrder: true
      }) );
      const data = ""; // ! PutData : 빈값 보내기
      const res = await putObjData( url, data );
      // console.log( res );
      if ( res.isDone ) {
        await getItemList();
      } else {
        mct.alertShow( "순서 변경에 실패하였습니다.\n" + err );
      }
    } catch (err) {
      mct.alertShow( "서버 통신장애 발생" );
      console.error( err )
    } finally {
      setIsLoading( (prevState) => ({
        ...prevState,
        editOrder: false
      }) );
    }
  }, [] );
  
  
  const onDeleteItem = useCallback(async (url) => {
    try {
      setIsLoading( (prevState) => ({
        ...prevState,
        delete: true
      }) );
      const res = await deleteObjData( url );
      // console.log( res );
      if ( res.isDone ) {
        mct.alertShow( "삭제가 완료되었습니다.", sucecessCallback );
      } else {
        mct.alertShow( "삭제에 실패하였습니다." );
      }
      
    } catch (err) {
      mct.alertShow( "서버 통신장애 발생" );
      console.error( err );
    } finally {
      setIsLoading( (prevState) => ({
        ...prevState,
        delete: false
      }) );
    }
  },[]);
  
  
  const sucecessCallback = () => {
    window.location.reload();
  };
  
  
  return (
    <>
      <MetaTitle title="메인배너" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">메인배너</h1>
          <section className="cont">
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
                <Button_EditListOrder
                  itemList={itemList}
                  setEditListOrder={setEditListOrder}
                  title={isLoading.editOrder ? <Spinner/> : "순서편집"}
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
                  <li className={s.table_th}>배너이름</li>
                  <li className={s.table_th}>이미지</li>
                  <li className={s.table_th}>노출대상</li>
                  <li className={s.table_th}>등록일</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length
                  ? <MainBannerList
                    items={itemList}
                    orderEditMode={editListOrder}
                    onEditLeakedOrder={updateLeakedOrderHandler}
                    onDeleteItem={onDeleteItem}
                  />
                  : isLoading.fetching
                  ? <AmdinErrorMessage loading={<Spinner/>}/>
                  : <AmdinErrorMessage text="조회된 데이터가 없습니다."/>
                }
              </div>
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && <Modal_global_alert background/>}
    </>
  );
}

export default MainBannerIndexPage;
