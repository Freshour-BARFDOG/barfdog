import React, { useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import s from "./channelTalk.module.scss";
import Pagination from "/src/components/atoms/Pagination";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import ChannelTalkMemberList from "./ChannelTalkMemeberList";


const TEST_ITEM = [1,2,3,4,5];


function ChannelTalkPage() {
  const [searchValue, setSearchValue] = useState({});
  const [itemList, setItemList] = useState(TEST_ITEM);
  const onResetSearchValues = (e) => {
    setSearchValue("");
    console.log("초기화 실행");
  };

  const onSearchHandler = (e) => {
    console.log("검색 실행");
  };

  return (
    <>
      <MetaTitle title="친구톡" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">채널톡</h1>
          <section className="cont">
            <SearchTextWithCategory
              searchValue={searchValue}
              title="회원검색"
              name="content"
              className={'fullWidth'}
              id="content"
              options={[
                { label: '이름', value: 'name' },
                { label: '아이디', value: 'id' },
                { label: '휴대폰 번호', value: 'phone' },
              ]}
            />
            <div className={'btn_section mt-20'}>
              <button className="admin_btn solid confirm_m" onClick={onSearchHandler}>
                검색
              </button>
              <button className="admin_btn line confirm_m" onClick={onResetSearchValues}>
                초기화
              </button>
            </div>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">상담 고객 목록</p>
              <div className="controls cont-left">
                <button className="admin_btn line basic_m">목록새로고침</button>
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>이름</li>
                  <li className={s.table_th}>아이디</li>
                  <li className={s.table_th}>연락처</li>
                  <li className={s.table_th}>회원여부</li>
                  <li className={s.table_th}>회원가입일</li>
                  <li className={s.table_th}>주문여부</li>
                  <li className={s.table_th}>최초결제일</li>
                  <li className={s.table_th}>상세보기</li>
                </ul>
                {itemList.length ? (
                  <ChannelTalkMemberList
                    items={itemList}
                    // onDeleteItem={onDeleteItem}
                  />
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
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ChannelTalkPage;
