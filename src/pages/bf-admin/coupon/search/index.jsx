import React, { useEffect, useState } from 'react';
import s from '../coupon.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import Pagination from '/src/components/atoms/Pagination';
import SearchPlainInput from '/src/components/admin/form/searchBar/SearchPlainInput';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import CouponList from './CouponList';
import enterKey from '/util/func/enterKey';
import { getData } from '/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import PaginationWithAPI from "/src/components/atoms/PaginationWithAPI";

// /delivery/:path:*
// someURL/:path:

/*-  auto: '/api/admin/coupons/auto', // 자동발행쿠폰
  - direct: '/api/admin/coupons/direct', // 직접발행쿠폰
  - directOnCode: '/api/admin/coupons/publication/code', // 직접발행 && 쿠폰코드로 생성한 쿠폰
  - directOnGeneral: '/api/admin/coupons/publication/general', // 직접발행 && 쿠폰코드없이 (! 삭제된 기능)
* */


const initialApiUrlWithQuery = {
  keyword: '',
  url: '/api/admin/coupons/auto',
  query: 'keyword='
};

const initialSearchValue = {
  keyword: '',
  couponType: 'AUTO_PUBLISHED', // AUTO_PUBLISHED,  CODE_PUBLISHED
};



function CouponListPage() {
  
  const apiDataQueryString = 'couponListResponseDtoList';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList ] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [apiUrlWithQuery, setApiUrlWithQuery] = useState(initialApiUrlWithQuery);

  // useEffect(() => {
  //   if(!apiUrlWithQuery.url.length) return;
  //   const query = apiUrlWithQuery.query || '?keyword=';
  //   const url = apiUrlWithQuery.url;
  //
  //   const apiUrl = `${url}${query}`
  //   if(!apiUrl) return;
  //   (async () => {
  //     try {
  //       setIsLoading((prevState) => ({
  //         ...prevState,
  //         fetching: true,
  //       }));
  //       const res = await getData(apiUrl);
  //       const data = res.data?._embedded[apiDataQueryString];
  //       console.log(res);
  //       // console.log(data)
  //       setItemList(data);
  //     } catch (err) {
  //       console.error(err);
  //       console.error('데이터를 가져올 수 없습니다.');
  //       setItemList('')
  //     }
  //     await setIsLoading((prevState) => ({
  //       ...prevState,
  //       fetching: false,
  //     }));
  //   })();
  // }, [apiUrlWithQuery]);

  const onResetSearchValues = () => {
    setSearchValue('');
  };

  const onSearchHandler = () => {
    const queryArr = [];
    let url = '';
    for (const key in searchValue) {
      const val = searchValue[key];
      switch (key) {
        case 'keyword':
          queryArr.push(`${key}=${val}`);
          break;
        case 'couponType':
          if(val === 'AUTO_PUBLISHED'){
            url = '/api/admin/coupons/auto';
          } else if(val === 'CODE_PUBLISHED') {
            url = '/api/admin/coupons/direct';
          }
          break;
      }
    }
    const query = `${queryArr.join('&')}`;
    setApiUrlWithQuery((prevState) => ({
      ...prevState,
      query,
      url,
    }));
  };

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  return (
    <>
      <MetaTitle title="쿠폰 조회" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">쿠폰 조회</h1>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearchHandler}>
              <SearchPlainInput
                title="쿠폰이름"
                name={'keyword'}
                onChange={setSearchValue}
                searchValue={searchValue || ''}
                onKeydown={onSearchInputKeydown}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="종류"
                name="couponType"
                idList={['AUTO_PUBLISHED', 'CODE_PUBLISHED']}
                labelList={[ '자동발행', '직접발행']}
                value={searchValue.type}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">쿠폰목록 {isLoading.fetching && <Spinner />}</p>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>쿠폰종류</li>
                  <li className={s.table_th}>쿠폰코드</li>
                  <li className={s.table_th}>쿠폰이름</li>
                  <li className={s.table_th}>쿠폰설명</li>
                  <li className={s.table_th}>할인금액</li>
                  <li className={s.table_th}>사용처</li>
                  <li className={s.table_th}>사용한도</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
                  <CouponList
                    items={itemList}
                  />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
              </div>
            </div>
            <div className={s["pagination-section"]}>
              <PaginationWithAPI apiURL={apiUrlWithQuery.url} size={searchPageSize} setItemList={setItemList} queryItemList={apiDataQueryString} urlQuery={apiUrlWithQuery.query} setIsLoading={setIsLoading}/>
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CouponListPage;
