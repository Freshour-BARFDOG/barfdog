import React, { useCallback, useEffect, useState } from 'react';
import s from './singleItem.module.scss';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchSelect from '/src/components/admin/form/searchBar/SearchSelect';
import SingleList from './SingleItemList';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { MirrorTextOnHoverEvent } from '/util/func/MirrorTextOnHoverEvent';
import { deleteData } from '/src/pages/api/reqData';
import { useModalContext } from '/store/modal-context';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';

const initalSearchValue = {
  itemType: 'ALL',
  smallTitle: '',
};

function SingleItemPage() {
  const getListApiUrl = '/api/admin/items';
  const apiDataQueryString = 'queryItemsAdminDtoList';
  const initialQuery = `&itemType=ALL`;
  const searchPageSize = 10;

  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [urlQuery, setUrlQuery] = useState(initialQuery);
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState({});
  const [searchValue, setSearchValue] = useState(initalSearchValue);
  const [pageInfo, setPageInfo] = useState({});
  const [onSearch, setOnSearch] = useState(false);

  useEffect(() => {
    MirrorTextOnHoverEvent(window);
  }, [itemList]);

  const onResetSearchValues = () => {
    setSearchValue(initalSearchValue);
  };

  const pageInterceptor = useCallback((res, option = { itemQuery: null }) => {
    // res = DUMMY_RES; // ! TEST
    // console.log( res );
    return getDefaultPagenationInfo(res?.data, apiDataQueryString, {
      pageSize: searchPageSize,
    });
  }, []);

  const onSearchHandler = useCallback(() => {
    const tempUrlQuery = [];
    for (const key in searchValue) {
      const val = searchValue[key];
      if (val) {
        const tempString = `${key}=${val}`;
        tempUrlQuery.push(tempString);
      }
    }
    const resultSearchQuery = tempUrlQuery.join('&');
    setUrlQuery(resultSearchQuery);
    setOnSearch(!onSearch);
  }, [searchValue, onSearch]);

  const onDeleteItem = async (apiUrl, targetId) => {
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: {
          [targetId]: true,
        },
      }));
      const res = await deleteData(apiUrl);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow('일반상품을 삭제하였습니다.', onSuccessCallback);
      } else {
        const serverErrorMessage = res.error;
        mct.alertShow(serverErrorMessage || '삭제에 실패하였습니다.');
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
  const onSuccessCallback = () => {
    window.location.reload();
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  return (
    <>
      <MetaTitle title="일반상품 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              일반상품 관리
              {isLoading.fetching && <Spinner />}
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
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                상품목록 &#40;총
                <em className={s['product-count']}>
                  {pageInfo.totalItems || 0}
                </em>
                개&#41;
              </p>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
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
                  <li className={s.table_th}>구독순서</li>
                  <li className={s.table_th}>생성일</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
                  <SingleList
                    items={itemList}
                    onDeleteItem={onDeleteItem}
                    isLoading={isLoading}
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
                apiURL={getListApiUrl}
                size={searchPageSize}
                pageInterceptor={pageInterceptor}
                theme={'square'}
                setItemList={setItemList}
                setIsLoading={setIsLoading}
                urlQuery={urlQuery}
                setPageData={setPageInfo}
                onSearch={onSearch}
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

export default SingleItemPage;
