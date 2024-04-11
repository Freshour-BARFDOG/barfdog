import React, { useCallback, useState } from 'react';
import s from './ExchangeReturnList.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import Tooltip from '/src/components/atoms/Tooltip';
import { transformToday } from '/util/func/transformDate';
import { productType } from '/store/TYPE/itemType';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { postObjData } from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import { valid_isTheSameArray } from '/util/func/validation/validationPackage';
import CancelExchangeReturnList from './ExchangeReturnList';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import enterKey from '/util/func/enterKey';
import { global_searchDateType } from '/store/TYPE/searchDateType';

const initialSearchValues = {
  from: global_searchDateType.oldestDate,
  to: transformToday(),
  merchantUid: null,
  memberName: null,
  memberEmail: null,
  recipientName: null,
  dogName: null,
  statusList: 'ALL',
  orderType: productType.GENERAL,
};

export default function ExchangeOnSellPage() {
  const searchApiUrl = `/api/admin/orders/searchAll`; // 주문단위 리스트 검색(페이징) ! 교환, 반품은 '주문' 단위로 변경 (221213)
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchBody, setSearchBody] = useState(null);
  const [selectedOrderIdList, setSelectedOrderIdList] = useState([]);
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const allItemIdList = itemList.map((item) => item.id); // 주문 id
  const [currentPage, setCurrentPage] = useState(1);

  const searchOption = Object.keys(orderStatus)
    .filter(
      (key) =>
        key === orderStatus.EXCHANGE_REQUEST ||
        key === orderStatus.EXCHANGE_DONE_SELLER ||
        key === orderStatus.EXCHANGE_DONE_BUYER,
    )
    .map((key) => ({
      id: key,
      label: orderStatus.KOR[key],
    }));
  searchOption.unshift({ id: 'ALL', label: '교환 전체' }); // 검색에서만 사용하는 TYPE

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
    // res = DUMMY_EXCHANGE_RESPONSE; //  ! TEST
    // console.log(res);
    // queryAdminOrdersDtoList : 상품단위 검색
    // queryAdminCancelRequestDtoList : 주문 단위 검색
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

  const onConfirmingExhangeOrderBySeller = async () => {
    // 일반 주문 교환요청을 판매자 귀책으로 컨펌 처리
    if (!selectedOrderIdList.length) return alert('선택된 상품이 없습니다.');
    if (
      !confirm(
        `${selectedOrderIdList.length}개 상품의 교환요청을 '판매자 귀책'으로 승인하시겠습니까?`,
      )
    )
      return;

    // const seletedOrderItemIdList = itemList
    //   .filter((item) => selectedOrderIdList.indexOf(item.id) >= 0)
    //   .map((item) => item.orderItemId);

    const body = {
      orderIdList: selectedOrderIdList, //  ! 주문 id 사용 (221213 변경)
    };

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        exchangeBySeller: true,
      }));
      const apiUrl = `/api/admin/orders/general/confirmExchange/seller`; // ! 일반상품 반품 가능 (정기구독상품 교환/반품 불가)
      const res = await postObjData(apiUrl, body);
      // console.log('onConfirmingExhangeOrderBySeller: \n', body);
      // console.log('response: admin > sell > exchange > index.jsx\n', res);
      if (res.isDone) {
        alert(`'판매자 귀책'으로 교환요청이 승인되었습니다.`);
        window.location.reload();
      } else {
        alert(
          `'판매자 귀책'으로 교환요청 처리 중에 오류가 발생했습니다.\n${res.error}`,
        );
      }
    } catch (err) {
      alert('API통신 오류 : ', err);
      window.location.reload();
    }
    setIsLoading((prevState) => ({
      ...prevState,
      exchangeBySeller: false,
    }));
  };

  const onConfirmingExchangeOrderByBuyer = async () => {
    // 일반 주문 교환요청을 구매자 귀책으로 컨펌 처리
    if (!selectedOrderIdList.length) return alert('선택된 상품이 없습니다.');
    if (
      !confirm(
        `${selectedOrderIdList.length}개 상품의 교환요청을 '구매자 귀책'으로 승인하시겠습니까?`,
      )
    )
      return;

    // const seletedOrderItemIdList = itemList
    //   .filter((item) => selectedOrderIdList.indexOf(item.id) >= 0)
    //   .map((item) => item.orderItemId);

    const body = {
      orderIdList: selectedOrderIdList, //  ! 주문 id 사용 (221213 변경)
    };

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        exchangeByBuyer: true,
      }));
      const apiUrl = `/api/admin/orders/general/confirmExchange/buyer`; // ! 일반상품 반품 가능 (정기구독상품 교환/반품 불가)
      const res = await postObjData(apiUrl, body);
      // console.log('onConfirmingReturnOrderDueToBuyer: \n', body);
      // console.log('response: admin > sell > exchange > index.jsx\n', res);
      if (res.isDone) {
        alert(`'구매자 귀책'으로 교환요청이 승인되었습니다.`);
        window.location.reload();
      } else {
        alert(
          `'구매자 귀책'으로 교환요청 처리 중에 오류가 발생했습니다.\n${res.error}`,
        );
      }
    } catch (err) {
      alert('API통신 오류 : ', err);
      window.location.reload();
    }
    setIsLoading((prevState) => ({
      ...prevState,
      exchangeByBuyer: false,
    }));
  };

  const onRefusingExchangeRequest = async () => {
    // 일반 주문 교환요청 거절 처리
    if (!selectedOrderIdList.length) return alert('선택된 상품이 없습니다.');
    if (
      !confirm(
        `${selectedOrderIdList.length}개 상품의 교환요청을 반려하시겠습니까?`,
      )
    )
      return;

    // const seletedOrderItemIdList = itemList
    //   .filter((item) => selectedOrderIdList.indexOf(item.id) >= 0)
    //   .map((item) => item.orderItemId);

    const body = {
      orderIdList: selectedOrderIdList, //  ! 주문 id 사용 (221213 변경)
    };

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        refusingExhangeRequest: true,
      }));
      const apiUrl = `/api/admin/orders/general/denyExchange`; // ! 일반상품 교환 가능 (정기구독상품 교환/반품 불가)
      const res = await postObjData(apiUrl, body);
      // console.log('onRefusingExchangeRequest: \n', body);
      // console.log('response: admin > sell > exchange > index.jsx\n', res);
      if (res.isDone) {
        alert(`교환요청을 반려하였습니다.`);
        window.location.reload();
      } else {
        alert(`교환요청을 반려 처리 중에 오류가 발생했습니다.\n${res.error}`);
      }
    } catch (err) {
      alert('API통신 오류 : ', err);
      window.location.reload();
    }
    setIsLoading((prevState) => ({
      ...prevState,
      refusingExhangeRequest: false,
    }));
  };

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

  return (
    <>
      <MetaTitle title="교환 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>교환 관리</h1>
          </div>
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
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                목록
                <Tooltip
                  message={`- 교환불가 조건: 정기구독상품,신선식품이 포함되지 않은 일반주문\n"주문" 단위로 반품처리됩니다.\n- 교환불가: 교환불가 처리된 주문은 배송완료 상태가 됩니다.`}
                  messagePosition={'left'}
                  wordBreaking={true}
                  width={'340px'}
                />
              </p>
              <div className="controls cont-left">
                <button
                  className="admin_btn line basic_m autoWidth"
                  onClick={onConfirmingExhangeOrderBySeller}
                >
                  {isLoading.exchangeBySeller ? (
                    <Spinner />
                  ) : (
                    '교환승인 (판매자 귀책)'
                  )}
                </button>
                <button
                  className="admin_btn line basic_m autoWidth"
                  onClick={onConfirmingExchangeOrderByBuyer}
                >
                  {isLoading.exchangeByBuyer ? (
                    <Spinner />
                  ) : (
                    '교환승인 (구매자 귀책)'
                  )}
                </button>
                <button
                  className="admin_btn line basic_m"
                  onClick={onRefusingExchangeRequest}
                >
                  {isLoading.refusingExhangeRequest ? <Spinner /> : '교환불가'}
                </button>
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>
                    <PureCheckbox
                      className={s.inner}
                      eventHandler={onSelectAllItems}
                      value={valid_isTheSameArray(
                        allItemIdList,
                        selectedOrderIdList,
                      )}
                    />
                  </li>
                  <li className={s.table_th}>번호</li>
                  <li className={s.table_th}>상세보기</li>
                  <li className={s.table_th}>주문번호</li>
                  <li className={s.table_th}>주문한 상품번호</li>
                  <li className={s.table_th}>주문상태</li>
                  <li className={s.table_th}>구매자 ID</li>
                  <li className={s.table_th}>구매자</li>
                  <li className={s.table_th}>수령자</li>
                  <li className={s.table_th}>반려견명</li>
                  <li className={s.table_th}>묶음배송 여부</li>
                </ul>
                {isLoading.fetching ? (
                  <AmdinErrorMessage loading={<Spinner />} />
                ) : itemList.length === 0 ? (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                ) : (
                  <CancelExchangeReturnList
                    items={itemList}
                    selectedIdList={selectedOrderIdList}
                    onSelectedItem={onSelectedItem}
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
