import s from './popup.module.scss';
import React, {useState, useEffect, useCallback} from 'react';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import PopupList from './PopupList';
import AdminBtn_moveToPage from '/src/components/atoms/AdminBtn_moveToPage';
import {deleteData, getData, putObjData} from '/src/pages/api/reqData';
import AdminErrorMessage from '/src/components/atoms/AdminErrorMessage';
import Spinner from '/src/components/atoms/Spinner';
import sorting from "/util/func/sorting";
import {MirrorTextOnHoverEvent} from "/util/func/MirrorTextOnHoverEvent";
import {useModalContext} from "/store/modal-context";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";


function PopupIndexPage() {
  
  
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [orderEditMode, setOrderEditMode] = useState(false);

  
  useEffect( () => {
    MirrorTextOnHoverEvent(window);
  }, [itemList] );

  useEffect(() => {
    getItemList();
  }, []);
  
  
  const getItemList = useCallback( () => (async () => {
    setIsLoading( (prevState) => ({
      ...prevState,
      fetching: true,
    }) );
    try {
      const apiUrl = "/api/banners/popup";
      const res = await getData( apiUrl, "admin" );
      // // console.log( res );
      if ( res.status === 200 && res.data?._embedded ) {
        const data = res.data._embedded.popupBannerListResponseDtoList;
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
      // // console.log( res );
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
  
  
  
  const onDeleteItem = useCallback(async (apiUrl) => {
    try {
      setIsLoading((prevState)=>({
        ...prevState,
        fetching: true
      }));
      const res = await deleteData( apiUrl );
      // console.log( res )
      if ( res.isDone ) {
        mct.alertShow(`배너가 정상적으로 삭제되었습니다.`, onSuccessCallback);
      } else {
        mct.alertShow( '삭제에 실패하였습니다.' );
      }
    } catch (err) {
      mct.alertShow("서버 통신 장애 발생");
      console.error(err);
    } finally {
      setIsLoading((prevState)=>({
        ...prevState,
        fetching: false
      }));
    }
    
    
  },[] );
  
  const onSuccessCallback = () => {
    window.location.reload();
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  return (
    <>
      <MetaTitle title="팝업" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              팝업
            </h1>
          </div>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
              <div className="cont-right">
                <AdminBtn_moveToPage
                  text="팝업등록"
                  href="/banner/popup/create"
                  className="admin_btn confirm_m solid"
                  animation="show"
                />
              </div>
              <div className="controls cont-left">
                <button
                  type="button"
                  id="edit_order"
                  className="admin_btn line basic_m"
                  onClick={() => setOrderEditMode(true)}
                >
                  {isLoading.fetching ? <Spinner/> : "순서편집"}
                </button>
                {orderEditMode &&
                  <button
                  type="button"
                  id="set_order"
                  className="admin_btn line basic_m point"
                  onClick={() => setOrderEditMode(false)}
                >
                  닫기
                </button>}
              </div>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>순서</li>
                  <li className={s.table_th}>팝업이름</li>
                  <li className={s.table_th}>이미지</li>
                  <li className={s.table_th}>위치</li>
                  <li className={s.table_th}>등록일</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length
                  ? <PopupList
                    items={itemList}
                    orderEditMode={orderEditMode}
                    onEditLeakedOrder={updateLeakedOrderHandler}
                    onDeleteItem={onDeleteItem}
                  />
                  : isLoading.fetching
                  ? <AdminErrorMessage loading={<Spinner />} />
                  : <AdminErrorMessage text="조회된 데이터가 없습니다." />
                }
              </div>
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && <Modal_global_alert onClick={onClickModalButton} background/>}
    </>
  );
}

export default PopupIndexPage;
