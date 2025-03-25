import React, { useCallback, useState } from 'react';
import s from '../order/order.module.scss';
import OrderList from '../order/OrderList';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import AdminErrorMessage from '/src/components/atoms/AdminErrorMessage';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { productType } from '/store/TYPE/itemType';
import { transformToday } from '/util/func/transformDate';
import { postObjData } from '/src/pages/api/reqData';
import { valid_isTheSameArray } from '/util/func/validation/validationPackage';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import Spinner from '/src/components/atoms/Spinner';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Tooltip from '/src/components/atoms/Tooltip';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import enterKey from '/util/func/enterKey';
import { global_searchDateType } from '/store/TYPE/searchDateType';
import { postPaymentDataToApiServer } from '../../api/postPaymentDataToApiServer';
import { useRouter } from 'next/router';

const initialSearchValues = {
  from: global_searchDateType.oldestDate,
  to: transformToday(),
  merchantUid: null,
  memberName: null,
  memberEmail: null,
  recipientName: null,
  dogName: null,
  statusList: 'ALL',
  orderType: productType.ALL,
};

export default function CancelOnSellPage() {
  const searchApiUrl = `/api/admin/orders/searchAll`;
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchBody, setSearchBody] = useState(null);
  const [selectedOrderIdList, setSelectedOrderIdList] = useState([]);
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const allItemIdList = itemList.map((item) => item.id); // 주문 id
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { pathname } = router;

  const searchOption = Object.keys(orderStatus)
    .filter(
      (key) =>
        key === orderStatus.CANCEL_REQUEST ||
        key === orderStatus.CANCEL_DONE_SELLER ||
        key === orderStatus.CANCEL_DONE_BUYER,
    )
    .map((key) => ({
      id: key,
      label: orderStatus.KOR[key],
    }));
  searchOption.unshift({ id: 'ALL', label: '취소 전체' }); // 검색에서만 사용하는 TYPE

  const onResetSearchValues = () => {
    setSearchValues(initialSearchValues);
  };

  const onSearchHandler = () => {
    const searchStatusList =
      searchValues.statusList === 'ALL'
        ? searchOption.filter((op) => op.id !== 'ALL').map((op) => op.id)
        : [searchValues.statusList];
    const body = {
      from: searchValues.from,
      to: searchValues.to,
      merchantUid: searchValues.merchantUid,
      memberName: searchValues.memberName,
      memberEmail: searchValues.memberEmail,
      recipientName: searchValues.recipientName,
      dogName: searchValues.dogName,
      statusList: searchStatusList, // ! 배열로 전송
      orderType: searchValues.orderType,
    };
    setSearchBody(body);
  };

  const pageInterceptor = useCallback((res, option = { itemQuery: null }) => {
    // res = searchValues.orderType === productType.GENERAL ? DUMMY__ADMIN_ORDER_ITEMS_GENERAL_RESPONSE :  DUMMY__ADMIN_ORDER_ITEMS_SUBSCRIBE_RESPONSE; //  ! TEST RESPONSE
    // console.log(res);
    return getDefaultPagenationInfo(
      res?.data,
      'queryAdminOrdersAllInfoDtoList',
      { pageSize: searchPageSize, setInitialize: setSearchQueryInitialize },
    );
  }, []);

  const onSelectedItem = (id, checked) => {
    const seletedId = Number(id);
    if (checked) {
      setSelectedOrderIdList((prevState) => prevState.concat(seletedId));
    } else {
      setSelectedOrderIdList((prevState) =>
        prevState.filter((id) => id !== seletedId),
      );
    }
  };

  const onSelectAllItems = (checked) => {
    const allItemsIdList = itemList.map((item) => item.id);
    setSelectedOrderIdList(checked ? allItemsIdList : []);
  };

  const onConfirmingCancelOrder = async () => {
    if (!selectedOrderIdList.length) return alert('선택된 주문이 없습니다.');
    if (
      !confirm(
        `${selectedOrderIdList.length}개 주문의 취소를 승인처리 하시겠습니까?`,
      )
    )
      return;

    const itemType = searchValues.orderType;
    const body = {
      orderIdList: selectedOrderIdList, //  ! 일반상품, 구독상품 모두 , 주문(orderId) 리스트로 전송함
    };

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        confirmingCancelOrder: true,
      }));
      const apiUrl = `/api/admin/orders/${itemType.toLowerCase()}/cancelConfirm`; // ! check path endPoint
      const res = await postPaymentDataToApiServer(apiUrl, body);
      // console.log('onConfirmingCancelOrder: \n', body);
      // console.log('response: admin > sell > cancel > index.jsx\n', res);
      if (res.isDone) {
        alert('취소 승인 처리되었습니다.');
        window.location.reload();
      } else {
        alert(`취소 승인 처리하는데 오류가 발생했습니다.\n${res.error}`);
      }
    } catch (err) {
      alert('API통신 오류 : ', err);
      window.location.reload();
    }
    setIsLoading((prevState) => ({
      ...prevState,
      confirmingCancelOrder: false,
    }));
  };

  const onRefusingCancelOrder = async () => {
    if (!selectedOrderIdList.length) return alert('선택된 상품이 없습니다.');
    if (
      !confirm(
        `${selectedOrderIdList.length}개 상품의 취소요청을 반려 하시겠습니까?`,
      )
    )
      return;

    const body = {
      orderIdList: selectedOrderIdList,
    };

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        refusingCancelOrder: true,
      }));
      const apiUrl = `/api/admin/orders/cancelRequest/reject`; // ! 일반/구독 공용 API
      const res = await postObjData(apiUrl, body);
      // console.log('onRefusingCancelOrder: \n', body);
      // console.log('response: admin > sell > cancel > index.jsx\n', res);
      if (res.isDone) {
        alert('취소요청이 반려 처리되었습니다.');
        window.location.reload();
      } else {
        alert(`취소요청 반려 처리 중 오류가 발생했습니다.\n${res.error}`);
      }
    } catch (err) {
      alert('API통신 오류 : ', err);
      window.location.reload();
    }
    setIsLoading((prevState) => ({
      ...prevState,
      refusingCancelOrder: false,
    }));
  };

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  return (
    <>
      <MetaTitle title="취소 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">취소 관리</h1>
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
                name="content"
                id="content"
                options={[
                  { label: '주문번호', value: 'merchantUid' },
                  { label: '구매자 이름', value: 'memberName' },
                  { label: '구매자 ID', value: 'memberEmail' },
                  { label: '수령자 이름', value: 'recipientName' },
                  { label: '반려견명', value: 'dogName' },
                ]}
              />
              <SearchRadio
                title="주문상태"
                name="statusList"
                idList={searchOption.map((op) => op.id)}
                labelList={searchOption.map((op) => op.label)}
                value={searchValues.statusList}
                setSearchValue={setSearchValues}
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
                목록
                <Tooltip message={'주문 단위 리스트'} />
              </p>
              <div className="controls cont-left">
                <button
                  className={`admin_btn line basic_m ${
                    searchValues.orderType === 'ALL' ? s.disabled_btn : ''
                  }`}
                  onClick={onConfirmingCancelOrder}
                >
                  {isLoading.confirmingCancelOrder ? <Spinner /> : '취소승인'}
                </button>
                <button
                  className={`admin_btn line basic_m autoWidth ${
                    searchValues.orderType === 'ALL' ? s.disabled_btn : ''
                  }`}
                  onClick={onRefusingCancelOrder}
                >
                  {isLoading.refusingCancelOrder ? (
                    <Spinner />
                  ) : (
                    '취소요청 반려'
                  )}
                </button>
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>
                    <PureCheckbox
                      eventHandler={onSelectAllItems}
                      value={valid_isTheSameArray(
                        allItemIdList,
                        selectedOrderIdList,
                      )}
                    />
                  </li>
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
                  <OrderList
                    items={itemList}
                    selectedIdList={selectedOrderIdList}
                    onSelectedItem={onSelectedItem}
                    currentPage={currentPage}
                    pathname={pathname}
                  />
                )}
              </div>
            </div>
            <div className={s['pagination-section']}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                pageInterceptor={pageInterceptor}
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
