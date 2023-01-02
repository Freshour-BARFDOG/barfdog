import s from './member.module.scss';
import React, {useCallback, useEffect, useState} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import MemberList from './MemberList';
import ToolTip from '/src/components/atoms/Tooltip';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { transformToday } from '/util/func/transformDate';
import enterKey from '/util/func/enterKey';
import {getDefaultPagenationInfo} from "/util/func/getDefaultPagenationInfo";
import {global_searchDateType} from "/store/TYPE/searchDateType";
import {MirroredTextOnHoverEvent} from "../../../../util/func/mirroredTextOnHoverEvent";




const initialSearchValues = {
  email: '',
  name: '',
  from: global_searchDateType.oldestDate,
  to: transformToday(),
};

const getListApiUrl = '/api/admin/members';
const searchPageSize = 10;

function ManageUserPage() {
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryInitialize, setSearchQueryInitialize] = useState( false );
  
  
  useEffect( () => {
    MirroredTextOnHoverEvent( window );
  }, [itemList] )
  
  const pageInterceptor = useCallback((res, option={itemQuery: null}) => {
    // res = DUMMY__RESPONSE; // ! TEST
    console.log(res);
    return getDefaultPagenationInfo(res?.data, 'queryMembersDtoList', {pageSize: searchPageSize, setInitialize: setSearchQueryInitialize});
  },[]);

  const onResetSearchValues = () => {
    setSearchValue(initialSearchValues);
  };

  const onSearchHandler = () => {
    const queryArr = [];
    for (const key in searchValue) {
      const val = searchValue[key];
      queryArr.push(`${key}=${val}`);
    }
    const query = `${queryArr.join('&')}`;
    setSearchQuery(query);
  };

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  return (
    <>
      <MetaTitle title="회원 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">회원 관리</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchTerm
                title={'조회기간'}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                tooltip={
                  <ToolTip
                    message={
                      '좌측 조회기간은 우측 조회기간보다 과거시점이어야 합니다.'
                    }
                    messagePosition={'left'}
                  />
                }
              />
              <SearchTextWithCategory
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="회원검색"
                name="keyword"
                id="keyword"
                events={{ onKeydown: onSearchInputKeydown }}
                options={[
                  { label: '아이디', value: 'email' },
                  { label: '이름', value: 'name' },
                ]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">회원목록</p>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>상세보기</li>
                  <li className={s.table_th}>등급</li>
                  <li className={s.table_th}>이름</li>
                  <li className={s.table_th}>아이디</li>
                  <li className={`${s.table_th}`}>연락처</li>
                  <li className={s.table_th}>대표견명</li>
                  <li className={s.table_th}>정기구독여부</li>
                  <li className={s.table_th}>누적구매금액</li>
                  <li className={s.table_th}>장기미접속</li>
                </ul>

                {(() => {
                  if (isLoading.fetching) {
                    return (
                      <>
                        <Spinner />
                      </>
                    );
                  } else if (!itemList.length) {
                    return (
                      <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                    );
                  } else {
                    return (
                      <MemberList
                        items={itemList}
                        // setSelectedItems={setSelectedItemList}
                        // selectedItems={selectedItemList}
                      />
                    );
                  }
                })()}
              </div>
            </div>
            <div className={s['pagination-section']}>
              <PaginationWithAPI
                apiURL={getListApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                urlQuery={searchQuery}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterceptor}
                option={{apiMethod: 'GET', initialize: searchQueryInitialize}}
              />
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ManageUserPage;
