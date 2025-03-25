import s from './member.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import AdminErrorMessage from '/src/components/atoms/AdminErrorMessage';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import MemberList from './MemberList';
import ToolTip from '/src/components/atoms/Tooltip';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { transformToday } from '/util/func/transformDate';
import enterKey from '/util/func/enterKey';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import { global_searchDateType } from '/store/TYPE/searchDateType';
import { MirrorTextOnHoverEvent } from '/util/func/MirrorTextOnHoverEvent';
import SearchRadio from '../../../components/admin/form/searchBar/SearchRadio';

const initialSearchValues = {
  from: global_searchDateType.oldestDate,
  to: transformToday(),
  alliance: 'cb', // [default] 콕뱅크
};

function ManageMembersPage() {
  const getListApiUrl = '/api/admin/members';
  const searchPageSize = 10;

  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [onSearch, setOnSearch] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const initialValue = searchValue.gradeList || '';
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(initialValue);

  useEffect(() => {
    MirrorTextOnHoverEvent(window);
  }, [itemList]);

  const pageInterceptor = useCallback((res, option = { itemQuery: null }) => {
    // res = DUMMY__RESPONSE; // ! TEST
    // console.log(res);
    return getDefaultPagenationInfo(res?.data, 'queryMembersDtoList', {
      pageSize: searchPageSize,
      setInitialize: setSearchQueryInitialize,
    });
  }, []);

  const onResetSearchValues = () => {
    console.log(initialSearchValues);
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
    setOnSearch(!onSearch);
  };

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  console.log(searchValue);
  // console.log(itemList);

  return (
    <>
      <MetaTitle title="제휴사 통한 가입자" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">제휴사 통한 가입자</h1>
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
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="제휴사"
                name="alliance"
                idList={['cb']}
                labelList={['콕뱅크']}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">가입자목록</p>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>번호</li>
                  <li className={s.table_th}>상세보기</li>
                  <li className={s.table_th}>등급</li>
                  <li className={s.table_th}>이름</li>
                  <li className={s.table_th}>아이디</li>
                  <li className={s.table_th}>연락처</li>
                  <li className={s.table_th}>대표견명</li>
                  <li className={s.table_th}>정기구독여부</li>
                  <li className={s.table_th}>누적구매금액</li>
                  <li className={s.table_th}>장기미접속</li>
                </ul>
                {itemList.length ? (
                  <MemberList items={itemList} currentPage={currentPage} />
                ) : isLoading.fetching ? (
                  <AdminErrorMessage loading={<Spinner />} />
                ) : (
                  <AdminErrorMessage text="조회된 데이터가 없습니다." />
                )}
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
                option={{ apiMethod: 'GET', initialize: searchQueryInitialize }}
                setCurrentPage={setCurrentPage}
                onSearch={onSearch}
              />
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ManageMembersPage;
