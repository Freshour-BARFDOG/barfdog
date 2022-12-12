import React, { useState } from "react";
import s from '../exchange/ExchangeReturnList.module.scss';
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import SearchBar from "/src/components/admin/form/searchBar";
import SearchTerm from "/src/components/admin/form/searchBar/SearchTerm";
import SearchTextWithCategory from "/src/components/admin/form/searchBar/SearchTextWithCategory";
import SearchRadio from "/src/components/admin/form/searchBar/SearchRadio";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import Tooltip from "/src/components/atoms/Tooltip";
import {transformToday} from "/util/func/transformDate";
import {productType} from "/store/TYPE/itemType";
import {orderStatus} from "/store/TYPE/orderStatusTYPE";
import {postObjData} from "/src/pages/api/reqData";
import PureCheckbox from "/src/components/atoms/PureCheckbox";
import {valid_isTheSameArray} from "/util/func/validation/validationPackage";
import Spinner from "/src/components/atoms/Spinner";
import CancelExchangeReturnList from "../exchange/ExchangeReturnList";
import PaginationWithAPI from "/src/components/atoms/PaginationWithAPI";


const initialSearchValues = {
  from: transformToday(),
  to: transformToday(),
  merchantUid: null,
  memberName: null,
  memberEmail: null,
  recipientName: null,
  statusList: 'ALL',
  orderType: productType.GENERAL, // 주문타입 1가지: GENERAL(일반상품) / 정기구독: 교환반품 불가
};


export default function ReturnOnSellPage() {
  
  const searchApiUrl = `/api/admin/orders/search`; // 상품단위 리스트 검색(페이징) ! 교환, 반품은 '상품'단위로 처리
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchBody, setSearchBody] = useState(null);
  const [selectedOrderIdList, setSelectedOrderIdList] = useState([]);
  const allItemIdList = itemList.map((item) => item.id); // 주문 id
  
  
  const searchOption = Object.keys(orderStatus)
    .filter(
      (key) =>
        key === orderStatus.RETURN_REQUEST ||
        key === orderStatus.RETURN_DONE_SELLER ||
        key === orderStatus.RETURN_DONE_BUYER
    )
    .map((key) => ({
      id: key,
      label: orderStatus.KOR[key],
    }));
  searchOption.unshift({ id: 'ALL', label: '반품 전체' }); // 검색에서만 사용하는 TYPE
  
  
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
      statusList: searchStatusList, // ! 배열로 전송
      orderType: searchValues.orderType,
    };
    setSearchBody(body);
  };
  
  const pageInterceptor = (res) => {
    // res = DUMMY_RETURN_RESPONSE; //  ! TEST
    console.log(res)
    const pageData = res.data.page;
    const curItemList = res.data?._embedded?.queryAdminOrdersDtoList || [];
    let newPageInfo = {
      totalPages: pageData.totalPages,
      size: pageData.size,
      totalItems: pageData.totalElements,
      currentPageIndex: pageData.number,
      newPageNumber: pageData.number + 1,
      newItemList: curItemList,
    };
    return newPageInfo;
  };
  
  const onSelectedItem = (id, checked) => {
    const seletedId = Number(id);
    if (checked) {
      setSelectedOrderIdList((prevState) => prevState.concat(seletedId));
    } else {
      setSelectedOrderIdList((prevState) => prevState.filter((id) => id !== seletedId));
    }
  };
  
  const onSelectAllItems = (checked) => {
    const allItemsIdList = itemList.map((item) => item.id);
    setSelectedOrderIdList(checked ? allItemsIdList : []);
  };
  
  
  
  
  const onConfirmingReturnOrderBySeller = async () => { // 일반 주문 반품요청을 판매자 귀책으로 컨펌 처리
    if (!selectedOrderIdList.length) return alert('선택된 상품이 없습니다.');
    if (!confirm(`${selectedOrderIdList.length}개 상품의 반품요청을 '판매자 귀책'으로 승인하시겠습니까?`))
      return;
  
    const seletedOrderItemIdList = itemList
      .filter((item) => selectedOrderIdList.indexOf(item.id) >= 0)
      .map((item) => item.orderItemId);
    const body ={
      orderItemIdList: seletedOrderItemIdList, //  ! 개별 상품의 id 사용 (주문id 아님)
    }
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        returnBySeller: true,
      }));
      const apiUrl = `/api/admin/orders/general/confirmReturn/seller`; // ! 일반상품 반품 가능 (정기구독상품 교환/반품 불가)
      const res = await postObjData(apiUrl, body);
      console.log('onConfirmingReturnOrderBySeller: \n', body);
      console.log('response: admin > sell > return > index.jsx\n', res);
      if (res.isDone) {
        alert(`'판매자 귀책'으로 반품요청이 승인되었습니다.`);
        window.location.reload();
      } else {
        alert(`'판매자 귀책'으로 반품요청 처리 중에 오류가 발생했습니다.\n${res.error}`);
      }
    } catch (err) {
      alert('API통신 오류 : ', err);
      window.location.reload();
    }
    setIsLoading((prevState) => ({
      ...prevState,
      returnBySeller: false,
    }));
  };
  
  
  
  const onConfirmingReturnOrderByBuyer = async () => { // 일반 주문 반품요청을 구매자 귀책으로 컨펌 처리
    if (!selectedOrderIdList.length) return alert('선택된 상품이 없습니다.');
    if (!confirm(`${selectedOrderIdList.length}개 상품의 반품요청을 '구매자 귀책'으로 승인하시겠습니까?`))
      return;
  
    const seletedOrderItemIdList = itemList
      .filter((item) => selectedOrderIdList.indexOf(item.id) >= 0)
      .map((item) => item.orderItemId);
    const body ={
      orderItemIdList: seletedOrderItemIdList, //  ! 개별 상품의 id 사용 (주문id 아님)
    }
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        returnByBuyer: true,
      }));
      const apiUrl = `/api/admin/orders/general/confirmReturn/buyer`;  // ! 일반상품 반품 가능 (정기구독상품 교환/반품 불가)
      const res = await postObjData(apiUrl, body);
      console.log('onConfirmingReturnOrderByBuyer: \n', body);
      console.log('response: admin > sell > return > index.jsx\n', res);
      if (res.isDone) {
        alert(`'구매자 귀책'으로 반품요청이 승인되었습니다.`);
        window.location.reload();
      } else {
        alert(`'구매자 귀책'으로 반품요청 처리 중에 오류가 발생했습니다.\n${res.error}`);
      }
    } catch (err) {
      alert('API통신 오류 : ', err);
      window.location.reload();
    }
    setIsLoading((prevState) => ({
      ...prevState,
      returnByBuyer: false,
    }));
  };
  
  const onRefusingReturnRequest = async () => { // 일반 주문 반품요청 거절 처리
    if (!selectedOrderIdList.length) return alert('선택된 상품이 없습니다.');
    if (!confirm(`${selectedOrderIdList.length}개 상품의 반품요청을 반려하시겠습니까?`))
      return;
  
    const seletedOrderItemIdList = itemList
      .filter((item) => selectedOrderIdList.indexOf(item.id) >= 0)
      .map((item) => item.orderItemId);
    const body ={
      orderItemIdList: seletedOrderItemIdList, //  ! 개별 상품의 id 사용 (주문id 아님)
    }
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        refusingReturnRequest: true,
      }));
      const apiUrl = `/api/admin/orders/general/denyReturn`; // ! 일반상품 반품 가능 (정기구독상품 교환/반품 불가)
      const res = await postObjData(apiUrl, body);
      console.log('onRefusingReturnRequest: \n', body);
      console.log('response: admin > sell > return > index.jsx\n', res);
      if (res.isDone) {
        alert(`반품요청을 반려하였습니다.`);
        window.location.reload();
      } else {
        alert(`반품요청을 반려 처리 중에 오류가 발생했습니다.\n${res.error}`);
      }
    } catch (err) {
      alert('API통신 오류 : ', err);
      window.location.reload();
    }
    setIsLoading((prevState) => ({
      ...prevState,
      refusingReturnRequest: false,
    }));
  };
  
  

  return (
    <>
      <MetaTitle title="반품 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>반품 관리
            </h1>
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
                title="조건검색"
                name="content"
                id="content"
                options={[
                  { label: '주문번호', value: 'merchantUid' },
                  { label: '구매자 이름', value: 'memberName' },
                  { label: '구매자 ID', value: 'memberEmail' },
                  { label: '수령자 이름', value: 'recipientName' },
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
              <div className="cont_title cont-left">
                목록
                <Tooltip message={`- 반품 가능한 일반상품 / "상품"단위 리스트\n- 구매자 귀책 택배비: 6,000원\n- 판매자 귀책: 택배비 없음\n- 반품불가: 반품불가 처리된 상품은 배송완료 상태가 됩니다.`} messagePosition={'left'} wordBreaking={true} width={'340px'}/>
              </div>
              <div className="controls cont-left">
                <button className="admin_btn line basic_m autoWidth" onClick={onConfirmingReturnOrderBySeller}>
                  {isLoading.returnBySeller ? <Spinner/> : '반품승인 (판매자 귀책)'}
                  
                </button>
                <button className="admin_btn line basic_m autoWidth" onClick={onConfirmingReturnOrderByBuyer}>
                  {isLoading.returnByBuyer ? <Spinner/> : '반품승인 (구매자 귀책)'}
                </button>
                <button className="admin_btn line basic_m" onClick={onRefusingReturnRequest}>
                  
                  {isLoading.refusingReturnRequest ? <Spinner/> : '반품불가'}
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
                      value={valid_isTheSameArray(allItemIdList, selectedOrderIdList)}
                    />
                  </li>
                  <li className={s.table_th}>상세보기</li>
                  <li className={s.table_th}>주문번호</li>
                  <li className={s.table_th}>주문한 상품번호</li>
                  <li className={s.table_th}>주문상태</li>
                  {/*<li className={s.table_th}>반품사유</li>*/}
                  <li className={s.table_th}>구매자 ID</li>
                  <li className={s.table_th}>구매자</li>
                  <li className={s.table_th}>수령자</li>
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
                option={{ apiMethod: 'POST', body: searchBody }}
              />
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}






const DUMMY_RETURN_RESPONSE = {
  data: {
    _embedded: {
      queryAdminOrdersDtoList: [
        {
          id: 6011,
          orderType: 'general',
          merchantUid: 'merchant_uid5',
          orderItemId: 60110,
          orderStatus: 'RETURN_REQUEST',
          deliveryNumber: 'cj0239234235',
          memberEmail: 'user@gmail.com',
          memberName: '김회원',
          memberPhoneNumber: '01099038544',
          recipientName: '김회원',
          recipientPhoneNumber: '01099038544',
          packageDelivery: false,
          orderDate: '2022-08-12T11:19:46.145',
          _links: {
            query_order: {
              href: 'http://localhost:8080/api/admin/orders/6011/general',
            },
          },
        },
        {
          id: 5966,
          orderItemId: 59660,
          orderType: 'general',
          merchantUid: 'merchant_uid4',
          orderStatus: 'RETURN_DONE_BUYER',
          deliveryNumber: 'cj0239234234',
          memberEmail: 'user@gmail.com',
          memberName: '김회원',
          memberPhoneNumber: '01099038544',
          recipientName: '김회원',
          recipientPhoneNumber: '01099038544',
          packageDelivery: false,
          orderDate: '2022-08-12T11:19:46.143',
          _links: {
            query_order: {
              href: 'http://localhost:8080/api/admin/orders/5966/general',
            },
          },
        },
        {
          id: 5981,
          orderItemId: 59810,
          orderType: 'general',
          merchantUid: 'merchant_uid4',
          orderStatus: 'RETURN_DONE_BUYER',
          deliveryNumber: 'cj0239234234',
          memberEmail: 'admin@gmail.com',
          memberName: '관리자',
          memberPhoneNumber: '01056785678',
          recipientName: '관리자',
          recipientPhoneNumber: '01056785678',
          packageDelivery: false,
          orderDate: '2022-08-12T11:19:46.143',
          _links: {
            query_order: {
              href: 'http://localhost:8080/api/admin/orders/5981/general',
            },
          },
        }
      ],
    },
    _links: {
      first: {
        href: 'http://localhost:8080/api/admin/orders/cancelRequest?page=0&size=5',
      },
      prev: {
        href: 'http://localhost:8080/api/admin/orders/cancelRequest?page=0&size=5',
      },
      self: {
        href: 'http://localhost:8080/api/admin/orders/cancelRequest?page=1&size=5',
      },
      next: {
        href: 'http://localhost:8080/api/admin/orders/cancelRequest?page=2&size=5',
      },
      last: {
        href: 'http://localhost:8080/api/admin/orders/cancelRequest?page=2&size=5',
      },
      confirm_cancel_general: {
        href: 'http://localhost:8080/api/admin/orders/general/cancelRequest',
      },
      confirm_cancel_subscribe: {
        href: 'http://localhost:8080/api/admin/orders/general/cancelRequest',
      },
      profile: {
        href: '/docs/index.html#resources-admin-query-cancelRequest',
      },
    },
    page: {
      size: 5,
      totalElements: 14,
      totalPages: 3,
      number: 1,
    },
  },
};