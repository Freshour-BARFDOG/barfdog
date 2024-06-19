import React, { useCallback, useState } from 'react';
import s from '../reward.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchCheckbox from '/src/components/admin/form/searchBar/SearchCheckbox';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import RewardList from './RewardList';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import { transformToday } from '/util/func/transformDate';
import Spinner from '/src/components/atoms/Spinner';
import enterKey from '/util/func/enterKey';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import { global_searchDateType } from '/store/TYPE/searchDateType';
import { rewardType } from '/store/TYPE/rewardType';

const initialSearchValues = {
  email: '',
  name: '',
  from: global_searchDateType.oldestDate,
  to: transformToday(),
  rewardTypeList: '',
};

function RewardListPage() {
  const getListApiUrl = '/api/admin/rewards';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [onSearch, setOnSearch] = useState(false);

  const initialValue = searchValues.rewardType || '';
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(initialValue);

  const pageInterceptor = useCallback((res, option = { itemQuery: null }) => {
    // res = DUMMY__RESPONSE; // ! TEST
    // console.log(res);
    return getDefaultPagenationInfo(res?.data, 'queryAdminRewardsDtoList', {
      pageSize: searchPageSize,
      setInitialize: setSearchQueryInitialize,
    });
  }, []);

  // 초기화
  const onResetSearchValues = () => {
    setSearchValues(initialSearchValues);
    setSelectedCheckboxes([]);
    // 전체 선택
    // setSelectedCheckboxes(
    //   Object.keys(rewardType).filter((key) => key != 'KOR'),
    // );
  };

  const onSearchHandler = () => {
    const queryArr = [];
    for (const key in searchValues) {
      const val = searchValues[key];
      // 선택 안함
      // if (key === 'rewardTypeList' && Array.isArray(val) && val.length === 0) {
      //   return setIsNone(true);
      // }
      queryArr.push(`${key}=${val}`);
    }

    const query = `${queryArr.join('&')}`;
    setSearchQuery(query);
    setOnSearch(!onSearch);
  };

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  // console.log('itemList', itemList);
  // console.log('searchValues', searchValues);

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
                events={{ onKeydown: onSearchInputKeydown }}
                options={[
                  { label: '아이디', value: 'email' },
                  { label: '이름', value: 'name' },
                ]}
              />
              <SearchCheckbox
                searchValue={searchValues}
                setSearchValue={setSearchValues}
                title="적립금 타입"
                name="rewardTypeList"
                idList={Object.keys(rewardType).filter((key) => key != 'KOR')}
                labelList={Object.values(rewardType.KOR)}
                value={searchValues.rewardType}
                selectedCheckboxes={selectedCheckboxes}
                setSelectedCheckboxes={setSelectedCheckboxes}
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
                  <li className={s.table_th}>번호</li>
                  <li className={s.table_th}>적립일자</li>
                  <li className={s.table_th}>적립급 명칭</li>
                  <li className={s.table_th}>적립금 타입</li>
                  <li className={s.table_th}>금액</li>
                  <li className={s.table_th}>적립금 수령자</li>
                  <li className={s.table_th}>수령자 아이디</li>
                  <li className={s.table_th}>적립금 발급자</li>
                  <li className={s.table_th}>발급자 아이디</li>
                </ul>
                {itemList.length ? (
                  <RewardList items={itemList} currentPage={currentPage} />
                ) : isLoading.fetching ? (
                  <AmdinErrorMessage loading={<Spinner />} />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
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
                option={{
                  apiMethod: 'GET',
                  initialize: searchQueryInitialize,
                }}
                setCurrentPage={setCurrentPage}
                onSearch={onSearch}
              />
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default RewardListPage;
