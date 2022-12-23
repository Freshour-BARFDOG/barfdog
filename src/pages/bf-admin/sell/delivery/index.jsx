import React, {useCallback, useState} from 'react';
import s from './delivery.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import DeliveryList from './DeliveryList';
import { transformToday } from '/util/func/transformDate';
import { productType } from '/store/TYPE/itemType';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import Spinner from '/src/components/atoms/Spinner';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Tooltip from '/src/components/atoms/Tooltip';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import { valid_isTheSameArray } from '/util/func/validation/validationPackage';
import {postObjData} from "/src/pages/api/reqData";
import { goodsFlowOrderCancel, postGoodsFlowOrder, getGoodsFlowOtp } from '/src/pages/api/goodsFlow/service';
import popupWindow from '/util/func/popupWindow';
import {getDefaultPagenationInfo} from "/util/func/getDefaultPagenationInfo";
import enterKey from "/util/func/enterKey";

const initialSearchValues = {
  from: transformToday(),
  to: transformToday(),
  merchantUid: null,
  memberName: null,
  memberEmail: null,
  recipientName: null,
  statusList: 'ALL',
  orderType: productType.GENERAL,
};

export default function DeliveryOnSellPage() {
  const searchApiUrl = `/api/admin/orders/cancelRequest`; // 주문 리스트 검색(페이징)
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchBody, setSearchBody] = useState(null);
  const [selectedOrderIdList, setSelectedOrderIdList] = useState([]);
  const [searchQueryInitialize, setSearchQueryInitialize] = useState( false );
  
  const allItemIdList = itemList.map((item) => item.id); // 주문 id
  const searchOption = Object.keys(orderStatus)
    .filter(
      (key) =>
        key === orderStatus.DELIVERY_BEFORE_COLLECTION ||
        key === orderStatus.DELIVERY_START ||
        key === orderStatus.DELIVERY_DONE,
    )
    .map((key) => ({
      id: key,
      label: orderStatus.KOR[key],
    }));
  searchOption.unshift({ id: 'ALL', label: '배송 전체' }); // 검색에서만 사용하는 TYPE

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

  
  const pageInterceptor = useCallback((res, option={itemQuery: null}) => {
    // res = DUMMY_DEFAULT_ITEMLIST_RESPONSE; //  ! TEST
    console.log(res);
    // queryAdminOrdersDtoList : 상품단위 검색
    // queryAdminCancelRequestDtoList : 주문 단위 검색
    return getDefaultPagenationInfo(res?.data, 'queryAdminCancelRequestDtoList', {pageSize: searchPageSize, setInitialize: setSearchQueryInitialize});
  },[]);
  
  
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

  const onReprintInvoice = async () => {
    // validation:  선택된 항목이 없을 경우
    if(selectedOrderIdList.length === 0) return;
    // validation: 배송에정이 아닌 상품이 선택된 경우, 실행불가
    const incorrectItem =
      itemList.filter((item) => selectedOrderIdList.indexOf(item.id) >= 0 && item.orderStatus !== orderStatus.DELIVERY_BEFORE_COLLECTION);
    // if (incorrectItem.length > 0) return alert('"배송예정"이 아닌 상품이 존재합니다.');
    if(!confirm(`선택된 ${selectedOrderIdList.length}개의 항목을 재출력하시겠습니까?`)) return;
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        reprint: true,
      }));
      // STEP 1: 주문 발송 api에 필요한 배송 정보 조회
      const url = '/api/admin/deliveries/info';
      const body = {
        orderIdList: selectedOrderIdList,
      };

      const res = await postObjData(url, body);
      console.log(res);
      const data = res.data?.data;
      const deliveryItemInfoList = data._embedded?.queryOrderInfoForDeliveryList || [];
      if (!res.isDone || !deliveryItemInfoList.length) {
        setIsLoading((prevState) => ({
          ...prevState,
          reprint: false,
        }));
        return alert(`서버통신 오류가 발생했습니다.`);
      }

      const deliveryList = [];
      for (const info of deliveryItemInfoList) {
        // 주문 id에 대한 정보 Array
        const bodyForGoodsFlow = {
          transUniqueCd: info.transUniqueCd,
          sndName: info.sndName,
          sndZipCode: info.sndZipCode,
          sndAddr1: info.sndAddr1,
          sndAddr2: info.sndAddr2,
          sndTel1: info.sndTel1,
          rcvName: info.rcvName,
          rcvZipCode: info.rcvZipCode,
          rcvAddr1: info.rcvAddr1,
          rcvAddr2: info.rcvAddr2,
          rcvTel1: info.rcvTel1,
          mallId: info.mallId,
          msgToTrans: info.request, // ! 배송 메시지 > 서버에서 받은 값 있는지 확인필요
          orderItems: info.orderItems.map((item) => ({
            uniqueCd: item.uniqueCd, // 고객 사용번호
            ordNo: item.ordNo, // 주문번호
            itemName: item.itemName, // 상품명
            itemQty: item.itemQty, // 상품 수량
            ordDate: item.ordDate, // 주문 일시: YYYYMMDDHH24mmss
          })),
          status: 'N', // [[처리상태코드]] "N": 신규, "O": 미발송
          paymentTypeCode: 'SH', // [[지불방법코드]] "SH": 선불, "BH": 착불  // barfdog > 배송비 착불 CASE 없음
        };
        deliveryList.push(bodyForGoodsFlow);
      } //

      if (deliveryList.length === 0) {
        setIsLoading((prevState) => ({
          ...prevState,
          reprint: false,
        }));
        return alert('조회된 항목이 없습니다.');
      }
      
      // ! 추가예정: goodsflow 송장취소 API
      // ! 추가예정: goodsflow 송장취소 API
      // ! 추가예정: goodsflow 송장취소 API
      // ! 추가예정: goodsflow 송장취소 API
    deliveryList.forEach(async function(item) {
      // console.log(item);
      // console.log(item.transUniqueCd);
      
      const cancelRes = await goodsFlowOrderCancel(item.transUniqueCd);
      const success = cancelRes.data.success;
      
      // console.log(cancelRes.data);
      
      if(!success){
        console.error(cancelRes.data.error.message);
      }
    });

      // ! 추가예정: 송장재등록 API
      // ! 추가예정: 송장재등록 API
      // ! 추가예정: 송장재등록 API
      // ! 추가예정: 송장재등록 API
      // TODO 백엔드 주문발송 api 수정 후 test

     // 주문 등록 후 id값 받아서 운송장 출력창 호출할때 보내야함
     const orderRes = await postGoodsFlowOrder({
      data: {
        items: deliveryList,
      },
    });
    // console.log(orderRes);
    // console.log(orderRes.data);

    const orderResData = orderRes.data;
    if (!orderResData.success) {
      const error = orderResData.error;
      const errorMessage = error.message;
      const errorCode = error.status;
      // console.error(
      //   `${bodyForGoodsFlow.orderItems
      //     .map((item) => item.itemName)
      //     .join(
      //       ', ',
      //     )} 상품의 발송처리에 실패하였습니다.\nERROR: ${errorMessage}\nERROR STATUS: ${errorCode}`,
      // );
      console.error(
        `상품의 발송처리에 실패하였습니다.\nERROR: ${errorMessage}\nERROR STATUS: ${errorCode}`,
      );
    }
    // goodsflow otp 발급(운송장 출력창 호출할때마다 발급 받아야함)
    const otp = await getGoodsFlowOtp();
    
    // STEP 2: 송장 재출력
    // 운송장 출력창 호출
    const goodsflowPrintUrl = window.location.origin + '/api/goodsFlow/print';
    const printRes = await postObjData(goodsflowPrintUrl, {
      otp: otp,
      id: orderResData.id,
    });
    console.log('=================');

    if (printRes.isDone) {
      // console.log(printRes);
      // console.log(printRes.data.data);
      popupWindow(`/bf-admin/sell/delivery/print?data=${printRes.data.data}`);
    }
    } catch (err) {
        console.error(err)
    }
    setIsLoading((prevState) => ({
      ...prevState,
      reprint: false,
    }));
    

  
  };
  
  
  
  
  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };
  
  

  return (
    <>
      <MetaTitle title="배송 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">배송 관리</h1>
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
                idList={[productType.GENERAL, productType.SUBSCRIBE]}
                labelList={[productType.KOR.GENERAL, productType.KOR.SUBSCRIBE]}
                value={searchValues.orderType}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                목록
              </p>
              <div className="controls cont-left">
                <button className="admin_btn line basic_m" onClick={onReprintInvoice}>
                  {isLoading.reprint ? <Spinner /> : '송장 재출력'}
                </button>
                {searchBody?.statusList?.indexOf(orderStatus.DELIVERY_BEFORE_COLLECTION) >= 0 && (
                  <Tooltip
                    message={'배송예정 상품일 경우, 송장 재출력할 수 있습니다.'}
                    width={'300'}
                    messagePosition={'center'}
                  />
                )}
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>
                    <PureCheckbox
                      eventHandler={onSelectAllItems}
                      value={valid_isTheSameArray(allItemIdList, selectedOrderIdList)}
                    />
                  </li>
                  <li className={s.table_th}>상세보기</li>
                  <li className={s.table_th}>주문번호</li>
                  {/*<li className={s.table_th}>상품주문번호</li>*/}
                  <li className={`${s.table_th} ${s.hasToolTip}`}>주문상태</li>
                  <li className={`${s.table_th} ${s.hasToolTip}`}>배송상태 <Tooltip style={{textAlign:'left'}} message={`- 배송상태 목록\n: 생산 중(구독상품), 배송 준비 중(일반상품), 배송예정, 배송시작, 배송완료, 구독결제 취소`} messagePosition={'left'} wordBreaking={true} width={'200px'}/></li>
                  <li className={s.table_th}>운송장번호</li>
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
                  <DeliveryList
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
                option={{ apiMethod: 'POST', body: searchBody, initialize: searchQueryInitialize }}
              />
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}




const DUMMY_DEFAULT_ITEMLIST_RESPONSE = {
  data: {
    _embedded: {
      queryAdminCancelRequestDtoList: [
        {
          id: 7819,
          orderType: 'general',
          merchantUid: 'merchant_uid15',
          orderItemId: 7816,
          orderStatus: 'DELIVERY_BEFORE_COLLECTION',
          deliveryNumber: 'cj02392342315',
          memberEmail: 'admin@gmail.com',
          memberName: '관리자',
          memberPhoneNumber: '01056785678',
          recipientName: '관리자',
          recipientPhoneNumber: '01056785678',
          packageDelivery: false,
          orderDate: '2022-08-12T11:19:51.139',
          _links: {
            query_order: {
              href: 'http://localhost:8080/api/admin/orders/7819/general',
            },
          },
        },
        {
          id: 7789,
          orderType: 'general',
          merchantUid: 'merchant_uid13',
          orderItemId: 7780,
          orderStatus: 'DELIVERY_START',
          deliveryNumber: 'cj02392342313',
          memberEmail: 'admin@gmail.com',
          memberName: '관리자',
          memberPhoneNumber: '01056785678',
          recipientName: '관리자',
          recipientPhoneNumber: '01056785678',
          packageDelivery: false,
          orderDate: '2022-08-12T11:19:51.139',
          _links: {
            query_order: {
              href: 'http://localhost:8080/api/admin/orders/7789/general',
            },
          },
        },
        {
          id: 7834,
          orderType: 'general',
          merchantUid: 'merchant_uid16',
          orderItemId: 7825,
          orderStatus: 'DELIVERY_BEFORE_COLLECTION',
          deliveryNumber: 'cj02392342316',
          memberEmail: 'admin@gmail.com',
          memberName: '관리자',
          memberPhoneNumber: '01056785678',
          recipientName: '관리자',
          recipientPhoneNumber: '01056785678',
          packageDelivery: false,
          orderDate: '2022-08-12T11:19:51.139',
          _links: {
            query_order: {
              href: 'http://localhost:8080/api/admin/orders/7834/general',
            },
          },
        },
        {
          id: 7735,
          orderType: 'general',
          merchantUid: 'merchant_uid7',
          orderItemId: 7726,
          orderStatus: 'DELIVERY_BEFORE_COLLECTION',
          deliveryNumber: 'cj0239234237',
          memberEmail: 'user@gmail.com',
          memberName: '김회원',
          memberPhoneNumber: '01099038544',
          recipientName: '김회원',
          recipientPhoneNumber: '01099038544',
          packageDelivery: false,
          orderDate: '2022-08-12T11:19:51.137',
          _links: {
            query_order: {
              href: 'http://localhost:8080/api/admin/orders/7735/general',
            },
          },
        },
        {
          id: 7720,
          orderType: 'general',
          merchantUid: 'merchant_uid6',
          orderItemId: 7711,
          orderStatus: 'DELIVERY_DONE',
          deliveryNumber: 'cj0239234236',
          memberEmail: 'user@gmail.com',
          memberName: '김회원',
          memberPhoneNumber: '01099038544',
          recipientName: '김회원',
          recipientPhoneNumber: '01099038544',
          packageDelivery: false,
          orderDate: '2022-08-12T11:19:51.137',
          _links: {
            query_order: {
              href: 'http://localhost:8080/api/admin/orders/7720/general',
            },
          },
        },
      ],
    },
    _links: {
      first: {
        href: 'http://localhost:8080/api/admin/orders/search?page=0&size=5',
      },
      prev: {
        href: 'http://localhost:8080/api/admin/orders/search?page=0&size=5',
      },
      self: {
        href: 'http://localhost:8080/api/admin/orders/search?page=1&size=5',
      },
      next: {
        href: 'http://localhost:8080/api/admin/orders/search?page=2&size=5',
      },
      last: {
        href: 'http://localhost:8080/api/admin/orders/search?page=2&size=5',
      },
      profile: {
        href: '/docs/index.html#resources-query-admin-orders',
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