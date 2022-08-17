import React, { useState } from 'react';
import s from './order.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import OrderList from './OrderList';
import { productType } from '/store/TYPE/itemType';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { transformToday } from '/util/func/transformDate';
import { postObjData } from '/src/pages/api/reqData';
import { valid_isTheSameArray } from '/util/func/validation/validationPackage';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import Spinner from '/src/components/atoms/Spinner';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import { Modal_orderCancleReason } from '/src/components/modal/Modal_orderCancleReason';

const initialSearchValues = {
  from: transformToday(),
  to: transformToday(),
  merchantUid: null,
  memberName: null,
  memberEmail: null,
  recipientName: null,
  statusList: null,
  orderType: productType.GENERAL,
};

export default function OrderOnSellPage() {
  const searchApiUrl = `/api/admin/orders/search`;
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchBody, setSearchBody] = useState(null);
  const [selectedOrderIdList, setSelectedOrderIdList] = useState([]);
  const [activeModal, setActiveModal] = useState({});
  const allItemIdList = itemList.map((item) => item.id); // 주문 id

  const searchOption = Object.keys(orderStatus)
    .filter(
      (key) =>
        key === orderStatus.PAYMENT_DONE ||
        key === orderStatus.PRUDUCING ||
        key === orderStatus.DELIVERY_READY ||
        key === orderStatus.FAILED,
    )
    .map((key) => ({
      id: key,
      label: orderStatus.KOR[key],
    }));

  const onResetSearchValues = () => {
    setSearchValues(initialSearchValues);
  };

  const onSearchHandler = () => {
    const body = {
      from: searchValues.from,
      to: searchValues.to,
      merchantUid: searchValues.merchantUid,
      memberName: searchValues.memberName,
      memberEmail: searchValues.memberEmail,
      recipientName: searchValues.recipientName,
      statusList: [searchValues.statusList], // ! 배열로 전송
      orderType: searchValues.orderType,
    };
    setSearchBody(body);
  };

  const pageInterceptor = (res) => {
    // console.log(res);
    res = DUMMY__ADMIN_ORDER_ITEMS_RESPONSE; //  ! TEST
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
    // console.log(id, checked);
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

  const onOrderConfirm = async () => {
    if (!selectedOrderIdList.length) return alert('선택된 상품이 없습니다.');
    if (!confirm(`선택하신 ${selectedOrderIdList.length}개의 상품을 주문확인 처리하시겠습니까?`))
      return;

    const seletedOrderItemIdList = itemList
      .filter((item) => selectedOrderIdList.indexOf(item.id) >= 0)
      .map((item) => item.orderItemId);
    const itemType = searchValues.orderType;
    const body =
      itemType === productType.GENERAL
        ? {
            orderItemIdList: seletedOrderItemIdList, // 주문한 "상품의 id" List
          }
        : itemType === productType.SUBSCRIBE
        ? {
            orderIdList: selectedOrderIdList, // "주문 id" list
          }
        : null;

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        confirm: true,
      }));
      const apiUrl = `/api/admin/orders/${itemType.toLowerCase()}/orderConfirm`;
      const res = await postObjData(apiUrl, body);
      console.log('onOrderConfirm: \n', body);
      console.log('response: admin > sell > search > index.jsx\n', res);
      if (res.isDone) {
        alert('주문확인 처리되었습니다.');
        window.location.reload();
      } else {
        alert(`주문확인 처리하는데 오류가 발생했습니다.\n${res.error}`);
      }
    } catch (err) {
      console.log('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      confirm: false,
    }));
  };

  const onStartRegisterDelivery = async () => {
    // - API CYCLE
    // - 1. FE => BE : 발송처리할 상품의 id List 전달 (주문 발송 api에 필요한 배송 정보 reponse 받음)
    // - 2. FE => GoodFlow : 배송정보 전달 (송장번호 reponse받음)
    // - 3. FE => BE: GoodFlow에서 전달받은 운송장 번호 등록
    if (!selectedOrderIdList.length) return alert('선택된 상품이 없습니다.');
    if (!confirm(`선택하신 ${selectedOrderIdList.length}개의 상품을 발송처리 하시겠습니까?`))
      return;

    const itemType = searchValues.orderType;
    const body =
      itemType === productType.GENERAL
        ? {
            orderItemIdList: selectedOrderIdList, // 일반상품 & 구독상품 모두 '주문 id'로 요청함
          }
        : itemType === productType.SUBSCRIBE
        ? {
            orderIdList: selectedOrderIdList, // 일반상품 & 구독상품 모두 '주문 id'로 요청함
          }
        : null;
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        delivery: true,
      }));
      const apiUrl = `/api/admin/orders/${itemType.toLowerCase()}/orderConfirm`; // 주문 발송 api에 필요한 배송 정보 조회
      // const resFromServer = await postObjData(apiUrl, body); // ! PRODUCT CODE
      const resFromServer = DUMMY_ADMIN_DELIVERY_INFO; // ! TEST CODE
      console.log('onOrderConfirm: \n', body);
      console.log('response: admin > sell > search > index.jsx\n', resFromServer);
      if (!resFromServer.isDone)
        return alert(`주문발송 처리 중 오류가 발생했습니다.\n${res.error}`);
      const deliveryItemInfoList = resFromServer.data.data._embedded.queryOrderInfoForDeliveryList;

      for (const info of deliveryItemInfoList) {
        // 주문 id에 대한 정보 Array
        const bodyForGoodsFlow = {
          TEST: 'goodsflow data 전송 방지 key & value', // ! TEST CODE
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
          msgToTrans: '', // ! 배송 메시지 > 서버에서 받은 값 있는지 확인필요
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

        const goodsflowOrderRegisterApiUrl =
          window.location.origin + '/api/goodsFlow/orderRegister';
        const res = await postObjData(goodsflowOrderRegisterApiUrl, bodyForGoodsFlow);
        // console.log(res);
        const data = res.data.data;
        if (!data.success) {
          const error = data.error;
          const errorMessage = error.message;
          const errorCode = error.status;
          console.error(
            `${bodyForGoodsFlow.orderItems
              .map((item) => item.itemName)
              .join(
                ', ',
              )} 상품의 발송처리에 실패하였습니다.\nERROR: ${errorMessage}\nERROR STATUS: ${errorCode}`,
          );
        }

        /// ! ---------------운송장 번호 등록과정 추가필요
        const registerDeliveryNumberApiUrl = `/api/admin/deliveries/deliveryNumber`;
        const body = {
          deliveryNumberDtoList: [
            {
              transUniqueCd: ' _____',
              deliveryNumber: '________',
            },
          ],
        };
        const r = await postObjData(registerDeliveryNumberApiUrl, body);
        console.log('server RESPONSE:\n', r);
        if (r.isDone) {
          alert('운송장번호 저장 완료');
        } else {
          console.error('운송장번호 저장 실패');
        }
      } //
    } catch (err) {
      console.log('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      confirm: false,
    }));
  };

  const onStartCancelOrder = () => {
    if (!selectedOrderIdList.length) {
      return alert('선택된 상품이 없습니다.');
    }
    setActiveModal({ orderCancel: true });
  };

  
  
  const onCancelOrder = async (enteredDetailReason) => {

    if(!enteredDetailReason) return alert('판매취소사유를 입력해주세요.');
    if (!confirm(`선택하신 ${selectedOrderIdList.length} 개의 상품을 판매취소 처리하시겠습니까?`)) return;
    
    const seletedOrderItemIdList = itemList
      .filter((item) => selectedOrderIdList.indexOf(item.id) >= 0)
      .map((item) => item.orderItemId);
    const itemType = searchValues.orderType;
    const body =
      itemType === productType.GENERAL
        ? {
            orderItemIdList: seletedOrderItemIdList, // 주문한 "상품의 id" List
            reason: enteredDetailReason,
            detailReason: enteredDetailReason,
          }
        : itemType === productType.SUBSCRIBE
        ? {
            orderIdList: selectedOrderIdList, // "주문 id" list
            reason: '판매자 취소',
            detailReason: enteredDetailReason,
          }
        : null;
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        orderCancel: true,
      }));
      const apiUrl = `/api/admin/orders/${itemType.toLowerCase()}/orderCancel`;
      const res = await postObjData(apiUrl, body);
      console.log('onOrderCancel: \n','apiUrl:',apiUrl, '\nbody:',body);
      console.log('response: admin > sell > search > index.jsx\n', res);
      if (res.isDone) {
        alert('주문취소 처리되었습니다.');
        window.location.reload();
      } else {
        alert(`주문취소 중 오류가 발생했습니다.\n${res.error}`);
      }
    } catch (err) {
      console.log('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      orderCancel: false,
    }));
  };

  // console.log(searchValues);

  return (
    <>
      <MetaTitle title="주문 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">주문 관리</h1>
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
                  { label: '주문번호', value: 'orderIdx' },
                  { label: '구매자 이름', value: 'buyerName' },
                  { label: '구매자 ID', value: 'buyerId' },
                  { label: '수령자 이름', value: 'receiverName' },
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
              <p className="cont_title cont-left">목록</p>
              <div className="controls cont-left">
                <button className="admin_btn line basic_m" onClick={onOrderConfirm}>
                  {isLoading.confirm ? <Spinner /> : '주문확인'}
                </button>
                <button className="admin_btn line basic_m" onClick={onStartRegisterDelivery}>
                  주문발송
                </button>
                <button className="admin_btn line basic_m" onClick={onStartCancelOrder}>
                  {isLoading.orderCancel ? <Spinner /> : '판매취소'}
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
                  {/*<li className={s.table_th}>상품주문번호</li>*/}
                  {/* ! 개별 상품 취소 기능 삭제로 인하여, 해당 column 미노출*/}
                  <li className={s.table_th}>주문상태</li>
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
                  <OrderList
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
                queryItemList={'queryAdminOrdersDtoList'}
                setItemList={setItemList}
                setIsLoading={setIsLoading}
                option={{ apiMethod: 'POST', body: searchBody }}
              />
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
      {activeModal.orderCancel && (
        <Modal_orderCancleReason
          id={'orderCancel'}
          setActiveModal={setActiveModal}
          onConfirm={onCancelOrder}
        />
      )}
    </>
  );
}

const DUMMY__ADMIN_ORDER_ITEMS_RESPONSE = {
  data: {
    _embedded: {
      queryAdminOrdersDtoList: [
        {
          id: 7819,
          orderType: 'general',
          merchantUid: 'merchant_uid15',
          orderItemId: 78190,
          orderStatus: 'PAYMENT_DONE',
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
          orderType: 'subscribe',
          merchantUid: 'merchant_uid13',
          orderItemId: 77890,
          orderStatus: 'PAYMENT_DONE',
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
          orderItemId: 78340,
          orderStatus: 'PAYMENT_DONE',
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
          orderItemId: 77350,
          orderStatus: 'PAYMENT_DONE',
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
          orderItemId: 77210,
          orderStatus: 'PAYMENT_DONE',
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

const DUMMY_ADMIN_DELIVERY_INFO = {
  isDone: true,
  error: '',
  status: 200,
  data: {
    data: {
      _embedded: {
        queryOrderInfoForDeliveryList: [
          {
            transUniqueCd: 'O5vhpwumbZ4wou8',
            sndName: '바프독',
            sndZipCode: '27352',
            sndAddr1: '충청북도 충주시 번영대로 214',
            sndAddr2: '1층 프레쉬아워',
            sndTel1: '0438554995',
            rcvName: '김회원',
            rcvZipCode: '12345',
            rcvAddr1: '부산광역시 해운대구 센텀2로 19',
            rcvAddr2: '106호',
            rcvTel1: '01099038544',
            mallId: 'BARFDOG',
            orderItems: [
              {
                uniqueCd: '5359-subs',
                ordNo: '5359',
                itemName: '구독상품',
                itemQty: 1,
                ordDate: '20220812111945',
              },
              {
                uniqueCd: '5364-item',
                ordNo: '5364',
                itemName: '굿즈 상품1',
                itemQty: 1,
                ordDate: '20220812111945',
              },
              {
                uniqueCd: '5370-item',
                ordNo: '5370',
                itemName: '굿즈 상품2',
                itemQty: 2,
                ordDate: '20220812111945',
              },
            ],
          },
          {
            transUniqueCd: 'uNGHpdjujpIp3fr',
            sndName: '바프독',
            sndZipCode: '27352',
            sndAddr1: '충청북도 충주시 번영대로 214',
            sndAddr2: '1층 프레쉬아워',
            sndTel1: '0438554995',
            rcvName: '김회원',
            rcvZipCode: '12345',
            rcvAddr1: '부산광역시 해운대구 센텀2로 19',
            rcvAddr2: '106호',
            rcvTel1: '01099038544',
            mallId: 'BARFDOG',
            orderItems: [
              {
                uniqueCd: '5379-subs',
                ordNo: '5379',
                itemName: '구독상품',
                itemQty: 1,
                ordDate: '20220812111945',
              },
              {
                uniqueCd: '5384-item',
                ordNo: '5384',
                itemName: '굿즈 상품1',
                itemQty: 1,
                ordDate: '20220812111945',
              },
              {
                uniqueCd: '5390-item',
                ordNo: '5390',
                itemName: '굿즈 상품2',
                itemQty: 2,
                ordDate: '20220812111945',
              },
            ],
          },
          {
            transUniqueCd: 'TdEgJaY6lbsYkuJ',
            sndName: '바프독',
            sndZipCode: '27352',
            sndAddr1: '충청북도 충주시 번영대로 214',
            sndAddr2: '1층 프레쉬아워',
            sndTel1: '0438554995',
            rcvName: '김회원',
            rcvZipCode: '12345',
            rcvAddr1: '부산광역시 해운대구 센텀2로 19',
            rcvAddr2: '106호',
            rcvTel1: '01099038544',
            mallId: 'BARFDOG',
            orderItems: [
              {
                uniqueCd: '5399-item',
                ordNo: '5399',
                itemName: '굿즈 상품1',
                itemQty: 1,
                ordDate: '20220812111945',
              },
              {
                uniqueCd: '5405-item',
                ordNo: '5405',
                itemName: '굿즈 상품2',
                itemQty: 2,
                ordDate: '20220812111945',
              },
            ],
          },
          {
            transUniqueCd: 'DsYizOMeUKEbrC2',
            sndName: '바프독',
            sndZipCode: '27352',
            sndAddr1: '충청북도 충주시 번영대로 214',
            sndAddr2: '1층 프레쉬아워',
            sndTel1: '0438554995',
            rcvName: '김회원',
            rcvZipCode: '12345',
            rcvAddr1: '부산광역시 해운대구 센텀2로 19',
            rcvAddr2: '106호',
            rcvTel1: '01099038544',
            mallId: 'BARFDOG',
            orderItems: [
              {
                uniqueCd: '5414-item',
                ordNo: '5414',
                itemName: '굿즈 상품1',
                itemQty: 1,
                ordDate: '20220812111945',
              },
              {
                uniqueCd: '5420-item',
                ordNo: '5420',
                itemName: '굿즈 상품2',
                itemQty: 2,
                ordDate: '20220812111945',
              },
            ],
          },
        ],
      },
      _links: {
        self: {
          href: 'http://localhost:8080/api/admin/deliveries/info',
        },
        update_deliveryNumber: {
          href: 'http://localhost:8080/api/admin/deliveries/deliveryNumber',
        },
        profile: {
          href: '/docs/index.html#resources-admin-query-deliveries-info',
        },
      },
    },
  },
};
