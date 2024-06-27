import s from './member.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
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
import { Button, ConfigProvider } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { postDataBlob } from '../../api/reqData';
import {
  global_gradeType,
  global_gradeType_ENG,
} from '../../../../store/TYPE/gradeType';
import SearchCheckbox from '../../../components/admin/form/searchBar/SearchCheckbox';

const initialSearchValues = {
  email: '',
  name: '',
  from: global_searchDateType.oldestDate,
  to: transformToday(),
  subscribing: '',
  gradeList: '',
};

function ManageUserPage() {
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
    const url = `/api/admin/members/excel-download`;

    try {
      setIsExcelLoading(true);
      const res = await postDataBlob(`${url}?${searchQuery}`);
      // console.log('엑셀 파일 업로드 성공:', res);

      if (res && res.data instanceof Blob) {
        const downloadUrl = URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', '회원목록.xlsx');
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
      <MetaTitle title="회원 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">회원 관리</h1>
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
              <SearchTextWithCategory
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="회원검색"
                name="keyword"
                id="keyword"
                events={{ onKeydown: onSearchInputKeydown }}
                options={[
                  { label: '아이디', value: 'email' },
                  { label: '이름', value: 'name' },
                ]}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="구독여부"
                name="subscribing"
                idList={['ALL', 'TRUE', 'FALSE']}
                labelList={['전체', '구독', '비구독']}
              />
              <SearchCheckbox
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="적립금 타입"
                name="gradeList"
                idList={global_gradeType}
                labelList={global_gradeType}
                value={searchValue.gradeList}
                selectedCheckboxes={selectedCheckboxes}
                setSelectedCheckboxes={setSelectedCheckboxes}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">회원목록</p>
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

export default ManageUserPage;
