import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import { MirrorTextOnHoverEvent } from '/util/func/MirrorTextOnHoverEvent';
import { useModalContext } from '/store/modal-context';
import { putObjData } from '/src/pages/api/reqData';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';

const initialSearchValue = {
  keyword: '',
  couponType: global_couponType.AUTO_PUBLISHED,
};

const initialApiUrlWithQuery = {
  couponType: global_couponType.AUTO_PUBLISHED,
  query: `keyword=&couponType=${global_couponType.AUTO_PUBLISHED}`,
};

export default function CouponListPage() {
  const searchApiUrl = '/api/admin/coupons/search';
  const searchPageSize = 10;

  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const [apiUrlWithQuery, setApiUrlWithQuery] = useState(
    initialApiUrlWithQuery,
  );
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    MirrorTextOnHoverEvent(window);
  }, [itemList]);

  const onResetSearchValues = useCallback(() => {
    setSearchValue(initialSearchValue);
  }, []);

  const onSearchHandler = useCallback(() => {
    const queryArr = [];
    let couponType = '';
    for (const key in searchValue) {
      const val = searchValue[key];
      switch (key) {
        case 'keyword':
          queryArr.push(`${key}=${val}`);
          break;
        case 'couponType':
          queryArr.push(`${key}=${val}`);
          couponType = val;
          break;
      }
    }
    const query = `${queryArr.join('&')}`;
    setApiUrlWithQuery((prevState) => ({
      ...prevState,
      query,
      couponType,
    }));
  }, [searchValue]);

  const pageInterceptor = useCallback((res, option = { itemQuery: null }) => {
    return getDefaultPagenationInfo(res?.data, 'couponListResponseDtoList', {
      pageSize: searchPageSize,
      setInitialize: setSearchQueryInitialize,
    });
  }, []);

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  const onDeleteItem = async (apiUrl, targetId) => {
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: {
          [targetId]: true,
        },
      }));
      const body = {
        id: targetId,
      };
      const res = await putObjData(apiUrl, body);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow('쿠폰이 성공적으로 삭제되었습니다.', onSubmitCallback);
      } else if (res.status === 422) {
        const message = res.data.data;
        mct.alertShow(
          `삭제할 수 없는 쿠폰입니다.\n(${message})`,
          onSubmitCallback,
        );
      } else {
        const serverErrorMessage = res.error;
        mct.alertShow(
          serverErrorMessage || '삭제에 실패하였습니다.',
          onSubmitCallback,
        );
      }
    } catch (err) {
      mct.alertShow('삭제 요청 중 에러가 발생하였습니다.');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: {
          [targetId]: false,
        },
      }));
    }
  };

  const onSubmitCallback = () => {
    window.location.reload();
  };

  const onClickModalButton = () => {
    mct.alertHide();
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
                title="쿠폰 이름"
                name={'keyword'}
                onChange={setSearchValue}
                searchValue={searchValue || ''}
                onKeydown={onSearchInputKeydown}
              />
              <SearchRadio
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                title="쿠폰 타입"
                name="couponType"
                idList={Object.keys(global_couponType).filter(
                  (key) => key != 'KOR',
                )}
                labelList={Object.values(global_couponType.KOR)}
                value={searchValue.couponType}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <div className="cont_title cont-left">
                쿠폰 목록
                <Tooltip
                  message={`1. 자동발행쿠폰은 생성 및 삭제할 수 없습니다.\n2. 자동발행쿠폰 중 등급별 쿠폰은 매달 1일, 생일 쿠폰은 해당 월 1일에 자동발급됩니다.\n3. 직접발행 쿠폰은 유효기간이 존재하는 항목만 목록에 나타납니다.\n4. 직접발행 쿠폰의 만료일자는 동일한 쿠폰을 2회 이상 발급했을 시,\n    가장 늦은 만료일자를 기준으로 표기됩니다.`}
                  messagePosition={'left'}
                  wordBreaking={true}
                  width={'480px'}
                />
              </div>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
              {/*<div className={`${s.table} ${apiUrlWithQuery.url === apiURL.direct ? s.directCoupon : s.autoCoupon}`}>*/}
              <div className={`${s.table} ${s[apiUrlWithQuery.couponType]}`}>
                <ul className={`${s.table_header}`}>
                  <li className={s.table_th}>번호</li>
                  <li className={s.table_th}>쿠폰종류</li>
                  {apiUrlWithQuery.couponType !==
                    global_couponType.AUTO_PUBLISHED && (
                    <li className={s.table_th}>쿠폰코드</li>
                  )}
                  {apiUrlWithQuery.couponType !==
                    global_couponType.AUTO_PUBLISHED && (
                    <li className={s.table_th}>만료일자</li>
                  )}
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
                    onDeleteItem={onDeleteItem}
                    isLoading={isLoading}
                    currentPage={currentPage}
                  />
                ) : isLoading.fetching ? (
                  <AmdinErrorMessage loading={<Spinner />} />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
              </div>
            </div>
            <div className={s['pagination-section']}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                urlQuery={apiUrlWithQuery.query}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterceptor}
                option={{ apiMethod: 'GET', initialize: searchQueryInitialize }}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}
    </>
  );
}
