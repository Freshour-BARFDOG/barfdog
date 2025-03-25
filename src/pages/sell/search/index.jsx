import React, { useCallback, useState } from 'react';
import s from './search.module.scss';
import SearchResultList from './SearchResultList';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { productType } from '/store/TYPE/itemType';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import SearchSelect from '/src/components/admin/form/searchBar/SearchSelect';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import AdminErrorMessage from '/src/components/atoms/AdminErrorMessage';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { transformToday } from '/util/func/transformDate';
import Tooltip from '/src/components/atoms/Tooltip';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import enterKey from '/util/func/enterKey';
import { global_searchDateType } from '/store/TYPE/searchDateType';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import { postDataBlob } from '../../api/reqData';

const initialSearchValues = {
  from: global_searchDateType.oldestDate,
  to: transformToday(),
  merchantUid: null,
  memberName: null,
  memberEmail: null,
  recipientName: null,
  dogName: null,
  statusList: orderStatus.ALL,
  orderType: productType.ALL,
};

export default function SearchOnSellPage() {
  const searchApiUrl = `/api/admin/orders/searchAll`; // 모든 정보 조회 ('주문'단위 조회)
  // const searchApiUrl = `/api/admin/orders/search`; // '상품'단위 조회 // @derprecated
  const searchPageSize = 50;
  const [isLoading, setIsLoading] = useState({});
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchBody, setSearchBody] = useState(null);
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const searchOption = Object.keys(orderStatus)
    .filter((key) => key !== orderStatus.BEFORE_PAYMENT && key !== 'KOR')
    .map((key) => ({
      label: orderStatus.KOR[key],
      value: key,
    }));

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
      statusList:
        searchValues.statusList === 'ALL' ? null : [searchValues.statusList], // ! 배열로 전송 // '전체 상태' 검색 시 null or 빈배열
      orderType: searchValues.orderType,
    };
    setSearchBody(body);
  };

  const pageInterceptor = useCallback((res, option = { itemQuery: null }) => {
    // res = DUMMY__RESPONSE; // ! TEST
    // console.log(res);
    if (!res) return;
    return getDefaultPagenationInfo(
      res?.data,
      'queryAdminOrdersAllInfoDtoList',
      { pageSize: searchPageSize, setInitialize: setSearchQueryInitialize },
    );
  }, []);

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  // console.log('searchValues', searchValues);

  // export excel
  const downloadExcel = async () => {
    const url = `/api/admin/orders/searchAll/excel`;

    const body = {
      ...searchValues,
      statusList:
        searchValues.statusList === 'ALL' ? [] : [searchValues.statusList], // ! 배열로 전송 // '전체 상태' 검색 시 null or 빈배열
    };

    // console.log('body>>>', body);

    try {
      setIsExcelLoading(true);
      const res = await postDataBlob(url, body);
      // console.log('엑셀 파일 업로드 성공:', res);

      if (res && res.data instanceof Blob) {
        const downloadUrl = URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', '판매관리.xlsx');
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(downloadUrl);
        link.remove();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExcelLoading(false);
    }
  };

  // console.log(itemList);
  // console.log('searchValues', searchValues);

  return (
    <>
      <MetaTitle title="주문 통합검색" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">통합 검색</h1>
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
              <SearchSelect
                title="주문상태"
                name="statusList"
                id="statusList"
                options={searchOption}
                setSearchValue={setSearchValues}
                searchValue={searchValues}
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
              <p className="cont_title cont-left">
                목록 <Tooltip message={'주문 단위 리스트'} />
              </p>
              <div
                className={`controls cont-left ${
                  isExcelLoading && s.excel_button
                }`}
              >
                <ConfigProvider
                  theme={{
                    token: {
                      // Seed Token
                      colorPrimary: '#ca1011',
                    },
                  }}
                >
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={() => downloadExcel()}
                    disabled={searchValues.orderType === 'ALL'}
                  >
                    {isExcelLoading ? <Spinner /> : '엑셀 다운로드'}
                  </Button>
                </ConfigProvider>
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>번호</li>
                  <li className={s.table_th}>상세보기</li>
                  <li className={s.table_th}>주문번호</li>
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
