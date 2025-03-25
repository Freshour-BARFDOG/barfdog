import s from './subscribes.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import AdminErrorMessage from '/src/components/atoms/AdminErrorMessage';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import SubscribesList from './SubscribesList';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import enterKey from '/util/func/enterKey';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import { MirrorTextOnHoverEvent } from '/util/func/MirrorTextOnHoverEvent';

const initialSearchValues = {
  memberName: '',
  email: '', // 견주 아이디(이메일)
  id: '',
  dogName: '',
};

function ManageSubscribePage() {
  const getListApiUrl = '/api/admin/subscribes';
  const searchPageSize = 10;
  const apiDataQueryString = 'querySubscribeHistoryDtoList';

  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [onSearch, setOnSearch] = useState(false);

  // console.log('searchValue>>>', searchValue);
  // console.log('searchQuery>>>', searchQuery);

  useEffect(() => {
    MirrorTextOnHoverEvent(window);
  }, [itemList]);

  const pageInterceptor = useCallback((res, option = { itemQuery: null }) => {
    return getDefaultPagenationInfo(res?.data, apiDataQueryString, {
      pageSize: searchPageSize,
      setInitialize: setSearchQueryInitialize,
    });
  }, []);

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
    setOnSearch(!onSearch);
  };

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  return (
    <>
      <MetaTitle title="구독 히스토리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">구독 히스토리</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchTextWithCategory
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="검색"
                name="keyword"
                id="keyword"
                events={{ onKeydown: onSearchInputKeydown }}
                options={[
                  { label: '반려견명', value: 'dogName' },
                  { label: '견주 이름', value: 'memberName' },
                  { label: '견주 ID', value: 'email' },
                  { label: '구독 ID', value: 'id' },
                ]}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">구독 히스토리</p>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>번호</li>
                  <li className={s.table_th}>삭제 여부</li>
                  <li className={s.table_th}>구독 ID</li>
                  <li className={s.table_th}>견주 이름</li>
                  <li className={s.table_th}>견주 ID</li>
                  <li className={s.table_th}>반려견명</li>
                  <li className={s.table_th}>구독 상태</li>
                  <li className={s.table_th}>최초 설문 완료일</li>
                  <li className={s.table_th}>구독 수정일</li>
                  <li className={s.table_th}>구독 수정 사유</li>
                  <li className={s.table_th}>구독 횟수</li>
                  <li className={s.table_th}>플랜</li>
                  <li className={s.table_th}>레시피 이름</li>
                  <li className={s.table_th}>한끼 급여량 (g)</li>
                  <li className={s.table_th}>다음결제 원금 (원)</li>
                  <li className={s.table_th}>다음결제일</li>
                  <li className={s.table_th}>건너뛰기 횟수 (1회)</li>
                  <li className={s.table_th}>건너뛰기 횟수 (1주)</li>
                  <li className={s.table_th}>사용한 쿠폰 이름</li>
                  <li className={s.table_th}>쿠폰 할인량</li>
                  <li className={s.table_th}>초과 할인금</li>
                  <li className={s.table_th}>등급 할인량</li>
                  <li className={s.table_th}>다음 결제 mid</li>
                  <li className={s.table_th}>구독 취소 신청일</li>
                  <li className={s.table_th}>구독 취소 예정일</li>
                  <li className={s.table_th}>구독 취소 사유</li>
                </ul>
                {itemList.length ? (
                  <SubscribesList items={itemList} currentPage={currentPage} />
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
                queryItemList={apiDataQueryString}
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

export default ManageSubscribePage;
