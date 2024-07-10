import s from './payment.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import PaymentList from './PaymentList';
import ToolTip from '/src/components/atoms/Tooltip';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { transformToday } from '/util/func/transformDate';
import enterKey from '/util/func/enterKey';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import { global_searchDateType } from '/store/TYPE/searchDateType';
import { MirrorTextOnHoverEvent } from '/util/func/MirrorTextOnHoverEvent';
import SearchTextWithCategory from '../../../../components/admin/form/searchBar/SearchTextWithCategory';
import { getData } from '../../../api/reqData';
import SearchRadio from '../../../../components/admin/form/searchBar/SearchRadio';

const initialSearchValues = {
  from: global_searchDateType.oldestDate,
  to: transformToday(),
  apiKey: 'SycrZhi9CuVrHei',
};

function ManagePaymentPage() {
  // const getListApiUrl = '/api/alliance/payment';
  // const searchPageSize = 10;

  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [onSearch, setOnSearch] = useState(false);
  const initialValue = searchValue.gradeList || '';
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(initialValue);

  useEffect(() => {
    MirrorTextOnHoverEvent(window);
  }, [itemList]);

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

  const fetchData = async () => {
    const queryArr = [];
    for (const key in searchValue) {
      const val = searchValue[key];
      queryArr.push(`${key}=${val}`);
    }
    const query = `${queryArr.join('&')}`;
    setSearchQuery(query);

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: true,
      }));
      const url = '/api/alliance/payment';
      let urlQueries = searchQuery ? searchQuery : query;
      const res = await getData(`${url}?${urlQueries}`);

      // const res = DUMMY_RESPONSE; // ! TEST
      // console.log(res.data);

      let itemList = [];
      if (res.data) {
        const DATA = res.data;
        itemList = DATA.map((data) => ({
          orderId: data.orderId,
          merchantUid: data.merchantUid,
          dtype: data.dtype,
          email: data.email,
          orderStatus: data.orderStatus,
          orderConfirmDate: data.orderConfirmDate,
          paymentDate: data.paymentDate,
          deliveryPrice: data.deliveryPrice,
          alliance: data.alliance,
          discountCoupon: data.discountCoupon,
          discountReward: data.discountReward,
          discountGrade: data.discountGrade,
          allianceDiscount: data.allianceDiscount,
          discountTotal: data.discountTotal,
          paymentPrice: data.paymentPrice,
          orderPrice: data.orderPrice,
        }));
      }
      setItemList(itemList);
    } catch (err) {
      console.error('Data Fetching Error: ', err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, onSearch]);

  return (
    <>
      <MetaTitle title="매출" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">매출</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchTerm
                title={'조회기간'}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                tooltip={
                  <ToolTip
                    message={`결제일 기준 조회 기간입니다. 좌측 조회기간은 우측 조회기간보다 과거시점이어야 합니다.`}
                    messagePosition={'left'}
                  />
                }
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="제휴사"
                name="apiKey"
                idList={['SycrZhi9CuVrHei']}
                labelList={['콕뱅크']}
              />

              {/* <div className={s.search_row}>
                <label>제휴사별 API 키</label>
                <div className={s.inp_wrap}>
                  <input
                    // id={'popup-searchUser-keyword'}
                    id={'apiKey'}
                    type="text"
                    onChange={onInputChangeHandler}
                    // onKeyDown={events.onKeydown}
                    value={searchValue.apiKey || ''}
                    // placeholder={placeholder}
                  />
                </div>
              </div> */}
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">매출목록</p>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>번호</li>
                  <li className={s.table_th}>주문유형</li>
                  <li className={s.table_th}>주문번호</li>
                  <li className={s.table_th}>구매자</li>
                  <li className={s.table_th}>주문상태</li>
                  <li className={s.table_th}>결제일</li>
                  <li className={s.table_th}>최종 결제금</li>
                  <li className={s.table_th}>제휴사</li>
                  <li className={s.table_th}>제휴 할인금</li>
                </ul>
                {itemList.length ? (
                  <PaymentList items={itemList} />
                ) : isLoading.fetching ? (
                  <AmdinErrorMessage loading={<Spinner />} />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
              </div>
            </div>
            {/* <div className={s['pagination-section']}>
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
            </div> */}
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default ManagePaymentPage;
