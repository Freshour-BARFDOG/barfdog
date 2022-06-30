import React, { useState } from 'react';
import s from './single.module.scss';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchSelect from '/src/components/admin/form/searchBar/SearchSelect';
import SearchPlainInput from '/src/components/admin/form/searchBar/SearchPlainInput';
import SingleList from './SingleList';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';


const initalSearchValue = {
  itemType: 'ALL',
  smallTitle :''
}

function SingleItemPage() {
  const getListApiUrl = '/api/admin/items';
  const apiDataQueryString = 'queryItemsAdminDtoList';
  const initialQuery = `&itemType=ALL`;
  const [urlQuery, setUrlQuery] = useState(initialQuery);
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState({});
  const [searchValue, setSearchValue] = useState(initalSearchValue);
  const [pageInfo, setPageInfo] = useState({});

// -
// 카테고리
// 원가
// 상품옵션 존재여부




  const onResetSearchValues = () => {
    setSearchValue(initalSearchValue);
  };

  const onSearchHandler = () => {
    console.log(searchValue);
    const tempUrlQuery = [];
    for (const key in searchValue) {
      const val = searchValue[key];
      if(val){
        const tempString = `${key}=${val}`;
        tempUrlQuery.push(tempString);
      }
    }
    const separator = '&'
    const resultSearchQuery = separator + tempUrlQuery.join('&');
    setUrlQuery(resultSearchQuery);
    console.log('검색 실행', resultSearchQuery);
  };

  return (
    <>
      <MetaTitle title="단품 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              단품 관리
              {isLoading.fetching && <Spinner/>}
            </h1>
          </div>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchSelect
                title="카테고리"
                name="itemType"
                id="itemType"
                options={[
                  { label: '전체', value: 'ALL' },
                  { label: '생식', value: 'RAW' },
                  { label: '토핑', value: 'TOPPING' },
                  { label: '기타', value: 'GOODS' },
                ]}
                setSearchValue={setSearchValue}
                searchValue={searchValue}
              />
              <SearchPlainInput
                title="소항목 타이틀"
                name={'single-title'}
                onChange={setSearchValue}
                searchValue={searchValue}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                상품목록 &#40;총<em className={s['product-count']}>{pageInfo.totalPages || 0}</em>
                개&#41;
              </p>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>상품번호</li>
                  <li className={s.table_th}>카테고리</li>
                  <li className={s.table_th}>상품명</li>
                  <li className={s.table_th}>원가</li>
                  <li className={s.table_th}>판매가</li>
                  <li className={s.table_th}>재고수량</li>
                  <li className={s.table_th}>할인</li>
                  <li className={s.table_th}>노출여부</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
                  <SingleList
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
                size={1}
                theme={'square'}
                setItemList={setItemList}
                queryItemList={apiDataQueryString}
                setIsLoading={setIsLoading}
                urlQuery={urlQuery} setPageData={setPageInfo}/>
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default SingleItemPage;
