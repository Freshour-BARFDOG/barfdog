import React, {useCallback, useState} from 'react';
import s from '../reward.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import RewardList from './RewardList';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import {transformToday} from "/util/func/transformDate";
import Spinner from "/src/components/atoms/Spinner";
import enterKey from "/util/func/enterKey";
import {getDefaultPagenationInfo} from "/util/func/getDefaultPagenationInfo";
import {global_searchDateType} from "/store/TYPE/searchDateType";



const initialSearchValues = {
  email:'',
  name:'',
  from: global_searchDateType.oldestDate,
  to:transformToday(),
}


function RewardListPage() {
  const getListApiUrl = '/api/admin/rewards';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryInitialize, setSearchQueryInitialize] = useState( false );
  
  const pageInterceptor = useCallback((res, option={itemQuery: null}) => {
    // res = DUMMY__RESPONSE; // ! TEST
    console.log(res);
    return getDefaultPagenationInfo(res?.data, 'queryAdminRewardsDtoList', {pageSize: searchPageSize, setInitialize: setSearchQueryInitialize});
  },[]);
  
  
  const onResetSearchValues = () => {
    setSearchValues(initialSearchValues);
  };

  const onSearchHandler = () => {
    const queryArr = [];
    for (const key in searchValues) {
      const val = searchValues[key];
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
      <MetaTitle title="적립금 조회" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>적립금 조회</h1>
          </div>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchTerm
                title={'조회기간'}
                searchValue={searchValues || ''}
                setSearchValue={setSearchValues}
              />
              <SearchTextWithCategory
                searchValue={searchValues}
                setSearchValue={setSearchValues}
                title="조건검색"
                name="keyword"
                id="keyword"
                events={{onKeydown: onSearchInputKeydown}}
                options={[
                  { label: '아이디', value: 'email' },
                  { label: '이름', value: 'name' },
                ]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">적립금 목록</p>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>적립일자</li>
                  <li className={s.table_th}>적립급명칭</li>
                  <li className={s.table_th}>금액</li>
                  <li className={s.table_th}>회원이름</li>
                  <li className={s.table_th}>아이디</li>
                </ul>
                {itemList.length
                  ? <RewardList items={itemList}/>
                  : isLoading.fetching
                  ? <AmdinErrorMessage loading={<Spinner />} />
                  : <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                }
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
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default RewardListPage;
