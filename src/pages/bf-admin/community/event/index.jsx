import React, {useEffect, useState} from "react";
import s from "./event.module.scss";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import {AdminContentWrapper} from "/src/components/admin/AdminWrapper";
import AdminBtn_moveToPage from "/src/components/atoms/AdminBtn_moveToPage";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import EventList from "./EventList";
import PaginationWithAPI from "/src/components/atoms/PaginationWithAPI";
import Spinner from "/src/components/atoms/Spinner";
import {MirrorTextOnHoverEvent} from "/util/func/MirrorTextOnHoverEvent";


function EventNoticePage () {
  const getListApiUrl = '/api/admin/events';
  const [itemList, setItemList] = useState( [] );
  const [isLoading, setIsLoading] = useState( {} );
  useEffect( () => {
    MirrorTextOnHoverEvent( window );
  }, [itemList] );
  
  return (
    <>
      <MetaTitle title="이벤트 관리" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              이벤트 관리
            </h1>
          </div>
          <div className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
              <div className="cont-right">
                <AdminBtn_moveToPage
                  text="이벤트 작성"
                  href="/bf-admin/community/event/create"
                  className="admin_btn confirm_m solid"
                  animation="show"
                />
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>글번호</li>
                  <li className={s.table_th}>제목</li>
                  <li className={s.table_th}>작성일</li>
                  <li className={s.table_th}>노출여부</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length
                  ? <EventList items={itemList} setItemList={setItemList}/>
                  : isLoading.fetching
                    ? <AmdinErrorMessage loading={<Spinner/>}/>
                    : <AmdinErrorMessage text="조회된 데이터가 없습니다."/>
                }
              </div>
            </div>
            <div className={s["pagination-section"]}>
              <PaginationWithAPI apiURL={getListApiUrl} size={10} theme={'square'} setItemList={setItemList} queryItemList={'queryEventsAdminDtoList'} setIsLoading={setIsLoading}/>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default EventNoticePage;
