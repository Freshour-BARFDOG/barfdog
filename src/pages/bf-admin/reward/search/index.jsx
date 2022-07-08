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



const initialSearchValue = {
  keyword: '',
  email:'',
  name:'',
  from:'',
  to:'',
};
const initialSearchQuery = 'email=user%40gmail.com&name=&from=2020-01-11&to=2022-07-06';

function RewardListPage() {
  const getListApiUrl = '/api/admin/rewards';
  const apiDataQueryString = 'queryAdminRewardsDtoList';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState({});
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  console.log(searchValues)
  console.log(searchQuery);

  const onResetSearchValues = () => {
    setSearchValues(initialSearchValue);
  };

  const onSearchHandler = () => {
    const queryArr = [];
    let url = '';
    for (const key in searchValues) {
      const val = searchValues[key];
      const thisQuery = `${key}=${val}`;
      switch (key) {
        case 'keyword':
          queryArr.push(thisQuery);
          break;
        case 'term':
          queryArr.push(thisQuery)
          break;
      }
    }
    const query = `${queryArr.join('&')}`;
    setSearchQuery((prevState) => ({
      ...prevState,
      query,
      url,
    }));
  };

  return (
    <>
      <MetaTitle title="적립금 조회" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>적립금 조회
              <ToolTip message={'회원 이름을 기준으로 발급된 적립금 내역을 조회'} messagePosition={'left'} />
            </h1>
          </div>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchTerm
                title={'조회기간'}
                searchValue={searchValues}
                setSearchValue={setSearchValues}
              />
              <SearchTextWithCategory
                searchValue={searchValues}
                setSearchValue={setSearchValues}
                title="조건검색"
                name="content"
                id="content"
                options={[
                  { label: '아이디', value: 'userId' },
                  { label: '이름', value: 'useName' },
                ]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">적립금 목록</p>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>적립일자</li>
                  <li className={s.table_th}>적립급명칭</li>
                  <li className={s.table_th}>금액</li>
                  <li className={s.table_th}>회원이름</li>
                  <li className={s.table_th}>아이디</li>
                </ul>
                {itemList.length ? (
                  <RewardList
                    items={itemList}
                    // onDeleteItem={onDeleteItem}
                  />
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
