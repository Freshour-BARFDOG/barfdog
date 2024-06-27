import s from './dog.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import DogList from './DogList';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import enterKey from '/util/func/enterKey';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import { MirrorTextOnHoverEvent } from '/util/func/MirrorTextOnHoverEvent';
import { Button, ConfigProvider } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { postDataBlob } from '../../api/reqData';

const initialSearchValues = {
  memberName: '',
  memberEmail: '',
  dogName: '',
  subscribeStatus: 'ALL',
  isDeleted: '',
};

function ManageDogPage() {
  const getListApiUrl = '/api/admin/dogs';
  const searchPageSize = 10;
  const apiDataQueryString = 'queryDogWithMemberAndSubscribeDtoList';

  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [onSearch, setOnSearch] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);

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

  // export excel
  const downloadExcel = async () => {
    const url = `/api/admin/dogs/excel-download`;

    try {
      setIsExcelLoading(true);
      const res = await postDataBlob(`${url}?${searchQuery}`);
      // console.log('엑셀 파일 업로드 성공:', res);

      if (res && res.data instanceof Blob) {
        const downloadUrl = URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', '반려견목록.xlsx');
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

  return (
    <>
      <MetaTitle title="반려견 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">반려견 관리</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchTextWithCategory
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="반려견검색"
                name="keyword"
                id="keyword"
                events={{ onKeydown: onSearchInputKeydown }}
                options={[
                  { label: '반려견명', value: 'dogName' },
                  { label: '견주 이름', value: 'memberName' },
                  { label: '견주 ID', value: 'memberEmail' },
                ]}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="구독상태"
                name="subscribeStatus"
                idList={['ALL', 'SUBSCRIBING', 'NONSUBSCRIBING']}
                labelList={['전체', '구독', '비구독']}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="삭제여부"
                name="isDeleted"
                idList={['ALL', 'TRUE', 'FALSE']}
                labelList={['전체', '삭제', '비삭제']}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">반려견목록</p>
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
                  >
                    {isExcelLoading ? <Spinner /> : '엑셀 다운로드'}
                  </Button>
                </ConfigProvider>
              </div>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>번호</li>
                  <li className={s.table_th}>삭제 여부</li>
                  <li className={s.table_th}>상세보기</li>
                  <li className={s.table_th}>견주 이름</li>
                  <li className={s.table_th}>견주 ID</li>
                  <li className={s.table_th}>반려견명</li>
                  <li className={s.table_th}>구독</li>
                  <li className={s.table_th}>품종</li>
                  <li className={s.table_th}>성별</li>
                  <li className={s.table_th}>생년월일</li>
                  <li className={s.table_th}>사이즈</li>
                  <li className={s.table_th}>몸무게</li>
                  <li className={s.table_th}>상태</li>
                  <li className={s.table_th}>중성화</li>
                  <li className={s.table_th}>대표견</li>
                </ul>
                {itemList.length ? (
                  <DogList items={itemList} currentPage={currentPage} />
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

export default ManageDogPage;
