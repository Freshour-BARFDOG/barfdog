import React, { useState } from "react";
import s from "./notice.module.scss";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import AdminBtn_moveToPage from "@src/components/atoms/AdminBtn_moveToPage";
import AmdinErrorMessage from "@src/components/atoms/AmdinErrorMessage";
import Pagination from "@src/components/atoms/Pagination";
import NoticeList from "./NoticeList";



const TEST_ITEM = [1, 2, 3];

function NoticeIndexPage() {
  const [itemList, setItemList] = useState(TEST_ITEM);
  return (
    <>
      <MetaTitle title="공지사항 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">공지사항 관리</h1>
          <div className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
              <div className="cont-right">
                <AdminBtn_moveToPage
                  text="공지사항 작성"
                  href="/bf-admin/community/notice/create"
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
                {itemList.length ? (
                  <NoticeList items={itemList} setItemList={setItemList} />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
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
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default NoticeIndexPage;
