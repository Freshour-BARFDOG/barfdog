import React, { useEffect, useState } from 'react';
import s from '../coupon.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchPlainInput from '/src/components/admin/form/searchBar/SearchPlainInput';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import CouponList from './CouponList';
import enterKey from '/util/func/enterKey';
import Spinner from '/src/components/atoms/Spinner';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Tooltip from '/src/components/atoms/Tooltip';
import { global_couponType } from '/store/TYPE/couponType';

/*-  auto: '/api/admin/coupons/auto', // 자동발행쿠폰
  - direct: '/api/admin/coupons/direct', // 직접발행쿠폰
  - directOnCode: '/api/admin/coupons/publication/code', // 직접발행 && 쿠폰코드로 생성한 쿠폰
  - directOnGeneral: '/api/admin/coupons/publication/general', // 직접발행 && 쿠폰코드없이 (! 삭제된 기능)
* */


const initialSearchValue = {
  keyword: '',
  couponType: 'AUTO_PUBLISHED', // AUTO_PUBLISHED,  CODE_PUBLISHED
};

const initialApiUrlWithQuery = {
  keyword: '',
  url: '/api/admin/coupons/auto',
  query: 'keyword=',
};

function CouponListPage() {
  const apiDataQueryString = 'couponListResponseDtoList';

  const apiURL = {
    auto: '/api/admin/coupons/auto',
    direct: '/api/admin/coupons/direct',
  };
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [apiUrlWithQuery, setApiUrlWithQuery] = useState(initialApiUrlWithQuery);
  

  const onResetSearchValues = () => {
    setSearchValue(initialSearchValue);
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
          if (val === 'AUTO_PUBLISHED') {
            url = apiURL.auto;
          } else if (val === 'CODE_PUBLISHED') {
            url = apiURL.direct;
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
                idList={[global_couponType.AUTO_PUBLISHED, global_couponType.CODE_PUBLISHED]}
                labelList={['자동발행', '직접발행']}
                value={searchValue.couponType}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <div className="cont_title cont-left">
                쿠폰목록
                <Tooltip
                  message={`1. 자동발행쿠폰은 생성 및 삭제할 수 없습니다.\n2. 직접발행 쿠폰은 유저에게 쿠폰을 발행하고 유효기간이 존재할 경우, 목록에 나타납니다.`}
                  messagePosition={'left'}
                  wordBreaking={true}
                  width={'320px'}
                />
                {isLoading.fetching && <Spinner />}
              </div>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
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
                  <CouponList items={itemList} />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
              </div>
            </div>
            <div className={s['pagination-section']}>
              <PaginationWithAPI
                apiURL={apiUrlWithQuery.url}
                size={searchPageSize}
                setItemList={setItemList}
                queryItemList={apiDataQueryString}
                urlQuery={apiUrlWithQuery.query}
                setIsLoading={setIsLoading}
              />
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CouponListPage;
