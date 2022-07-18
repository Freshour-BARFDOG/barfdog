import React, { useState } from 'react';
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
import ToolTip from "/src/components/atoms/Tooltip";
import {transformToday} from "/util/func/transformDate";
import Spinner from "/src/components/atoms/Spinner";
import enterKey from "/util/func/enterKey";



const initialSearchValues = {
  email:'',
  name:'',
  from: transformToday(),
  to:transformToday(),
}


function RewardListPage() {
  const getListApiUrl = '/api/admin/rewards';
  const apiDataQueryString = 'queryAdminRewardsDtoList';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');


  const onResetSearchValues = () => {
    setSearchValues(initialSearchValue);
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
                onSearch={onSearchInputKeydown}
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
  
                {(() => {
                  if (isLoading.fetching) {
                    return (<><Spinner/></>);
                  } else if (!itemList.length) {
                    return <AmdinErrorMessage text="조회된 데이터가 없습니다." />;
                  } else {
                    return (
                      <RewardList
                        items={itemList}
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
                queryItemList={apiDataQueryString}
                urlQuery={searchQuery}
                setIsLoading={setIsLoading}
              />
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default RewardListPage;
