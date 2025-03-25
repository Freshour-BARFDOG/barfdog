import React, { useCallback, useState } from 'react';
import s from '../search/search.module.scss';
import SearchResultList from '../search/SearchResultList';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import AdminErrorMessage from '/src/components/atoms/AdminErrorMessage';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import { transformToday } from '/util/func/transformDate';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { productType } from '/store/TYPE/itemType';
import Spinner from '/src/components/atoms/Spinner';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import enterKey from '/util/func/enterKey';
import { global_searchDateType } from '/store/TYPE/searchDateType';

const initialSearchValues = {
  from: global_searchDateType.oldestDate,
  to: transformToday(),
  merchantUid: null,
  memberName: null,
  memberEmail: null,
  recipientName: null,
  dogName: null,
  statusList: orderStatus.CONFIRM, // 구매확정 상태만 조회함
  orderType: productType.ALL,
};

export default function ConfirmOnSellPage() {
  const searchApiUrl = `/api/admin/orders/searchAll`;
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchBody, setSearchBody] = useState(null);
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const onResetSearchValues = () => {
    setSearchValues(initialSearchValues);
  };

  const onSearchHandler = () => {
    const body = {
      from: searchValues.from,
      to: searchValues.to,
      merchantUid: searchValues.merchantUid,
      memberName: searchValues.memberName,
      memberEmail: searchValues.memberEmail,
      recipientName: searchValues.recipientName,
      dogName: searchValues.dogName,
      statusList: [searchValues.statusList], // ! 배열로 전송
      orderType: searchValues.orderType,
    };
    setSearchBody(body);
  };

  const pageInterceptor = useCallback((res, option = { itemQuery: null }) => {
    // console.log(res);
    return getDefaultPagenationInfo(
      res?.data,
      'queryAdminOrdersAllInfoDtoList',
      { pageSize: searchPageSize, setInitialize: setSearchQueryInitialize },
    );
  }, []);

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  return (
    <>
      <MetaTitle title="구매확정 내역" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">구매확정 내역</h1>
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
                events={{ onKeydown: onSearchInputKeydown }}
                title="조건검색"
                name="detail"
                id="detail"
                options={[
                  { label: '주문번호', value: 'merchantUid' },
                  { label: '구매자 이름', value: 'memberName' },
                  { label: '구매자 ID', value: 'memberEmail' },
                  { label: '수령자 이름', value: 'recipientName' },
                  { label: '반려견명', value: 'dogName' },
                ]}
              />
              <SearchRadio
                searchValue={searchValues}
                setSearchValue={setSearchValues}
                title="주문유형"
                name="orderType"
                idList={[
                  productType.ALL,
                  productType.GENERAL,
                  productType.SUBSCRIBE,
                ]}
                labelList={[
                  productType.KOR.ALL,
                  productType.KOR.GENERAL,
                  productType.KOR.SUBSCRIBE,
                ]}
                value={searchValues.orderType}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>번호</li>
                  <li className={s.table_th}>상세보기</li>
                  <li className={s.table_th}>주문번호</li>
                  {/*<li className={s.table_th}>상품주문번호</li>*/}{' '}
                  {/* ! 개별 상품 취소 기능 삭제로 인하여, 해당 column 미노출*/}
                  <li className={s.table_th}>주문상태</li>
                  <li className={s.table_th}>구매자 ID</li>
                  <li className={s.table_th}>구매자</li>
                  <li className={s.table_th}>수령자</li>
                  <li className={s.table_th}>반려견명</li>
                  <li className={s.table_th}>묶음배송 여부</li>
                </ul>
                {isLoading.fetching ? (
                  <AdminErrorMessage loading={<Spinner />} />
                ) : itemList.length === 0 ? (
                  <AdminErrorMessage text="조회된 데이터가 없습니다." />
                ) : (
                  <SearchResultList
                    items={itemList}
                    currentPage={currentPage}
                  />
                )}
              </div>
            </div>
            <div className={s['pagination-section']}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                pageInterceptor={pageInterceptor}
                queryItemList={'queryAdminOrdersDtoList'}
                setItemList={setItemList}
                setIsLoading={setIsLoading}
                option={{
                  apiMethod: 'POST',
                  body: searchBody,
                  initialize: searchQueryInitialize,
                }}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}
