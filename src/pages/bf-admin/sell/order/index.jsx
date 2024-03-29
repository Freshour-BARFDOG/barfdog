import React, { useCallback, useEffect, useState } from 'react';
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
import { Modal_orderConfirm } from '/src/components/modal/Modal_orderConfirm';
import Tooltip from '/src/components/atoms/Tooltip';
import popupWindow from '/util/func/popupWindow';
import {
  getGoodsFlowOtp,
  postGoodsFlowOrder,
} from '/src/pages/api/goodsFlow/service';
import axios from 'axios';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import enterKey from '/util/func/enterKey';
import { global_searchDateType } from '/store/TYPE/searchDateType';
import { postPaymentDataToApiServer } from '../../../api/postPaymentDataToApiServer';
import { CancelReasonName } from '../../../../../store/TYPE/order/CancelReasonName';
import { getData } from '../../../api/reqData';

const initialSearchValues = {
  from: global_searchDateType.oldestDate,
  to: transformToday(),
  merchantUid: null,
  memberName: null,
  memberEmail: null,
  recipientName: null,
  dogName: null,
  statusList: orderStatus.PAYMENT_DONE,
  orderType: productType.GENERAL,
};

export default function OrderOnSellPage() {
  const searchApiUrl = `/api/admin/orders/searchAll`;
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchBody, setSearchBody] = useState(null);
  const [selectedOrderIdList, setSelectedOrderIdList] = useState([]);
  const [activeModal, setActiveModal] = useState({});
  const [searchQueryInitialize, setSearchQueryInitialize] = useState(false);
  const allItemIdList = itemList.map((item) => item.id); // 주문 id
  const [selectedItemList, setSelectedItemList] = useState([]);

  useEffect(() => {
    const selectedList = itemList.filter(
      (data) => selectedOrderIdList.indexOf(data.id) >= 0,
    );
    setSelectedItemList(selectedList);
  }, [selectedOrderIdList]);

  const searchOption = Object.keys(orderStatus)
    .filter(
      (key) =>
        key === orderStatus.PAYMENT_DONE ||
        key === orderStatus.PRODUCING ||
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
      from: searchValues.from, // 검색날짜 from
      to: searchValues.to, // // 검색날짜 from
      merchantUid: searchValues.merchantUid, // 주문번호
      memberName: searchValues.memberName, // 주문자 이름
      memberEmail: searchValues.memberEmail, // 주문자 email
      recipientName: searchValues.recipientName, // 수령자 이름
      dogName: searchValues.dogName,
      statusList: [searchValues.statusList], // ! 배열로 전송 //  전체 상태 검색 시 null
      orderType: searchValues.orderType,
    };
    setSearchBody(body);
    setSelectedOrderIdList([]); // 선택된 아이템 id 리스트 초기화
  };

  const pageInterceptor = useCallback((res, option = { itemQuery: null }) => {
    // res = searchValues.orderType === productType.GENERAL ? DUMMY__ADMIN_ORDER_ITEMS_GENERAL_RESPONSE :  DUMMY__ADMIN_ORDER_ITEMS_SUBSCRIBE_RESPONSE; //  ! TEST TEST TEST
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

  const onStartOrderConfirm = () => {
    const invalidItemList =
      filterInvalidOrderConfirmStatusItems(selectedItemList);
    // console.log(invalidItemList);
    if (!selectedOrderIdList.length) {
      return alert('선택된 상품이 없습니다.');
    } else if (invalidItemList.length) {
      return alert('결제완료 상태가 아닌 상품이 포함되어있습니다.');
    }
    setActiveModal({ orderConfirm: true });

    // console.log(selectedItemList.map(item => item.id))

    // onOrderConfirm(selectedItemList.map(item => item.id));
  };

  const onStartOrderDeny = () => {
    const invalidItemList = filterInvalidOrderDenyStatusItems(
      selectedItemList,
      searchValues.orderType,
    );
    console.log(invalidItemList);
    if (!selectedOrderIdList.length) {
      return alert('선택된 상품이 없습니다.');
    } else if (invalidItemList.length) {
      return alert('주문확인 상태가 아닌 상품이 포함되어있습니다.');
    }
    // setActiveModal({ orderConfirm: true });

    const selectedIdList = selectedItemList.map((item) => item.id);

    if (!selectedIdList.length) return alert('선택된 상품이 없습니다.');
    if (
      !confirm(
        `선택하신 ${selectedIdList.length}개의 상품을 확인취소 처리하시겠습니까?`,
      )
    )
      return;

    const itemType = searchValues.orderType;
    let body;
    if (itemType === productType.GENERAL) {
      body = {
        orderIdList: selectedIdList, // 주문 내에 속한 "상품의 id" List
      };
    } else if (itemType === productType.SUBSCRIBE) {
      body = {
        orderIdList: selectedIdList, // "주문 id" list
      };
    }

    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          confirm: true,
        }));
        const apiUrl = `/api/admin/orders/${itemType.toLowerCase()}/orderConfirmCancel`;
        const res = await postPaymentDataToApiServer(apiUrl, body);
        console.log('onOrderConfirm: \n', body);
        console.log('response: admin > sell > search > index.jsx\n', res);
        if (res.isDone) {
          alert('확인취소 처리되었습니다.');
          window.location.reload();
        } else {
          alert(`확인취소 처리하는데 오류가 발생했습니다.\n${res.error}`);
        }
      } catch (err) {
        console.log('API통신 오류가 발생하였습니다.');
        alert(err);
      } finally {
        setIsLoading((prevState) => ({
          ...prevState,
          confirm: false,
        }));
      }
    })();
  };

  const onOrderConfirm = async (selectedIdList) => {
    if (!selectedIdList.length) return alert('선택된 상품이 없습니다.');
    if (
      !confirm(
        `선택하신 ${selectedIdList.length}개의 상품을 주문확인 처리하시겠습니까?`,
      )
    )
      return;

    const itemType = searchValues.orderType;
    let body;
    if (itemType === productType.GENERAL) {
      body = {
        orderItemIdList: selectedIdList, // 주문 내에 속한 "상품의 id" List
      };
    } else if (itemType === productType.SUBSCRIBE) {
      body = {
        orderIdList: selectedIdList, // "주문 id" list
      };
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        confirm: true,
      }));
      const apiUrl = `/api/admin/orders/${itemType.toLowerCase()}/orderConfirm`;
      const res = await postPaymentDataToApiServer(apiUrl, body);
      // console.log('onOrderConfirm: \n', body);
      // console.log('response: admin > sell > search > index.jsx\n', res);
      if (res.isDone) {
        alert('주문확인 처리되었습니다.');
        window.location.reload();
      } else {
        alert(`주문확인 처리하는데 오류가 발생했습니다.\n${res.error}`);
      }
    } catch (err) {
      // console.log('API통신 오류가 발생하였습니다.');
      alert(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        confirm: false,
      }));
    }
  };

  const onStartManagerCompany = async () => {
    try {
      // goodsflow otp 발급(운송장 출력창 호출할때마다 발급 받아야함)
      const otp = await getGoodsFlowOtp();

      // 운송장 출력창 호출
      const goodsflowPrintUrl =
        window.location.origin + '/api/goodsFlow/contractList';
      const printRes = await postObjData(goodsflowPrintUrl, {
        otp: otp,
      });
      console.log('=================');

      if (printRes.isDone) {
        console.log(printRes);
        console.log(printRes.data.data);

        popupWindow(`/bf-admin/sell/delivery/print?data=${printRes.data.data}`);

        // // popupWindow(`/bf-admin/sell/delivery/print?data=${printRes.data.data}`);
        // const url = `https://ds.goodsflow.com/p1/printcc/contract/list.aspx`; // 예시 URL
        // // const url = `https://ds.goodsflow.com/p1/printcc/contract/detail.aspx`; // 예시 URL
        // const subWindow = window.open(url, '_blank', 'width=1000,height=1000');
        // if (subWindow) {
        //   subWindow.focus();
        // } else {
        //   alert('Subwindow blocked. Please allow pop-ups and try again.');
        // }
      }
    } catch (err) {
      console.log('API통신 오류 : ', err);
    } finally {
      console.log('API통신 종료');
    }
  };

  const onStartRegisterDelivery = async () => {
    // - API CYCLE
    // - 1. FE => BE : 발송처리할 상품의 id List 전달 (주문 발송 api에 필요한 배송 정보 reponse 받음)
    // - 2. FE => GoodFlow : 배송정보 전달 (송장번호 reponse받음)
    // - 3. FE => BE: GoodFlow에서 전달받은 운송장 번호 등록
    const invalidItemList = filterInvalidDeliveryStatusItems(
      selectedItemList,
      searchValues.orderType,
    );
    if (invalidItemList.length) {
      return alert(
        `주문발송 처리에 부적당한 ${
          searchValues.orderType === 'GENERAL' ? '일반' : '구독'
        }상품이 포함되어있습니다.`,
      );
    }

    if (!selectedOrderIdList.length) return alert('선택된 상품이 없습니다.');
    if (
      !confirm(
        `선택하신 ${selectedOrderIdList.length}개의 상품을 발송처리 하시겠습니까?`,
      )
    )
      return;

    // ! [수정] 24.03.28
    // - (BEFORE) body에 일반주문과 구독의 id만 보냄
    // - (AFTER) body에 일반주문과 구독의 id + "일반주문의 itemOptionList"도 추가로 보냄
    // [
    //   {
    //     "orderId": 3232,
    //     "itemOptionList": [
    //       {
    //         "itemOptionId": 29,
    //         "itemOptionCount": 2
    //       }
    //     ]
    //   },
    //   {
    //     "orderId": 3236,
    //     "itemOptionList": [
    //       {
    //         "itemOptionId": 28,
    //         "itemOptionCount": 1
    //       },
    //       {
    //         "itemOptionId": 30,
    //         "itemOptionCount": 1
    //       }
    //     ]
    //   }
    // ]

    let orderIdOptionList = [];

    if (searchValues.orderType === 'GENERAL') {
      for (const orderId of selectedOrderIdList) {
        try {
          const generalApiUrl = `/api/admin/orders/${orderId}/general`;
          // 일반주문에 대한 요청 수행
          const generalResponse = await getData(generalApiUrl);
          if (generalResponse.data) {
            // console.log(
            //   generalResponse.data.orderItemAndOptionDtoList[0]
            //     .selectOptionDtoList[0].optionId,
            // );
            const itemOptionList =
              generalResponse.data.orderItemAndOptionDtoList.flatMap((item) =>
                item.selectOptionDtoList.map((option) => ({
                  itemOptionId: option.optionId,
                  itemOptionCount: option.amount,
                })),
              );
            // 주문 ID와 아이템 옵션 목록을 orderIdOptionList에 추가
            orderIdOptionList.push({
              orderId: orderId,
              itemOptionList: itemOptionList,
            });
          }
        } catch (error) {
          console.error(
            `Error fetching order details for orderId ${orderId}:`,
            error,
          );
        }
      }
    } else if (searchValues.orderType === 'SUBSCRIBE') {
      for (const orderId of selectedOrderIdList) {
        try {
          const subscribeApiUrl = `/api/admin/orders/${orderId}/subscribe`;
          const subscribeResponse = await getData(subscribeApiUrl);
          if (subscribeResponse.data) {
            orderIdOptionList.push({
              orderId: orderId,
              itemOptionList: null,
            });
          }
        } catch (error) {
          console.error(
            `Error fetching order details for orderId ${orderId}:`,
            error,
          );
        }
      }
    }

    let body = {
      // [수정 후]
      orderList: orderIdOptionList,
      // [수정 전]
      // orderIdList: selectedOrderIdList, // 일반상품 & 구독상품 모두 '주문 id'로 요청함
    };

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        delivery: true,
      }));
      const apiUrl = `/api/admin/deliveries/info`; // 주문 발송 api에 필요한 배송 정보 조회
      const resFromServer = await postObjData(apiUrl, body); // ! PRODUCT CODE
      // console.log('resFromServer: ', resFromServer);
      // const resFromServer = DUMMY_ADMIN_DELIVERY_INFO; // ! TEST CODE
      if (!resFromServer.isDone)
        return alert(
          `주문발송 처리 중 오류가 발생했습니다.\n${resFromServer.error}`,
        );
      const deliveryItemInfoList =
        resFromServer.data.data._embedded.queryOrderInfoForDeliveryList;
      // console.log(deliveryItemInfoList);

      // GoodsFlow에 전송하는 배송리스트 (운송장 출력창에 보여지는 리스트)
      const deliveryList = [];

      for (const info of deliveryItemInfoList) {
        // 주문 id에 대한 정보 Array
        const bodyForGoodsFlow = {
          // TEST: '__________________goodsflow data 전송 방지 key & value', // ! TESTTESTTESTTESTTESTTESTTESTTEST CODE
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

      if (deliveryList.length > 0) {
        const goodsflowOrderRegisterApiUrl =
          window.location.origin + '/api/goodsFlow/orderRegister';
        // const res = await postObjData(goodsflowOrderRegisterApiUrl, bodyForGoodsFlow);
        // 주문 등록 후 id값 받아서 운송장 출력창 호출할때 보내야함
        const res = await postGoodsFlowOrder({
          data: {
            items: deliveryList,
          },
        });
        // // console.log(res);
        // // console.log(res.data);

        const data = res.data;
        if (!data.success) {
          const error = data.error;
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

        // 운송장 출력창 호출
        const goodsflowPrintUrl =
          window.location.origin + '/api/goodsFlow/print';
        const printRes = await postObjData(goodsflowPrintUrl, {
          otp: otp,
          id: res.data.id,
        });
        // console.log('=================');

        if (printRes.isDone) {
          // console.log(printRes);
          // console.log(printRes.data.data);
          popupWindow(
            `/bf-admin/sell/delivery/print?data=${printRes.data.data}`,
          );

          const goodsFlowTraceRes =
            window.location.origin + '/api/goodsFlow/postTraceResult';
          // const r = await postObjData(goodsFlowTraceRes);
          // // console.log(r);
        }
      }
    } catch (err) {
      // console.log('API통신 오류 : ', err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        confirm: false,
      }));
    }
  };
  const postDeliveryNo = async () => {
    /// ! ---------------운송장 번호 등록과정 추가필요 -----------------!
    /// ! ---------------운송장 번호 등록과정 추가필요 -----------------!
    /// ! ---------------운송장 번호 등록과정 추가필요 -----------------!
    const registerDeliveryNumberApiUrl = `/api/admin/deliveries/deliveryNumber`;
    // const body = {
    //   deliveryNumberDtoList: [
    //     {
    //       transUniqueCd: ' _____',
    //       deliveryNumber: '________',
    //     },
    //   ],
    // };

    // TODO:운송장
    const traceRes = await axios
      .post(
        `${window.location.origin}/api/goodsFlow/getTraceResult`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((res) => {
        // console.log(res.data);
        console.log(
          '------------------------------------------------------------------ AXIOS > RESPONSE ------------------------------------------------------------------ ',
          res,
        );

        return res;
      })
      .catch((err) => {
        console.error('goodsflow traceresult err: ', err);

        return err.response;
      });
    // console.log('============');
    // console.log(traceRes.data);

    // 결과보고 조회 성공
    if (traceRes.data.success) {
      if (traceRes.data.data != '') {
        const items = traceRes.data.data.items;

        //       const items = [ {
        //         transUniqueCd: "KGbAZJOXEQixMGh",
        //         uniqueCd: "o0001-001",
        //         seq: 1,
        //         partnerCode: "goods0001",
        //         ordNo: "o0001",
        //         ordLineNo: 1,
        //         itemQty: 1,
        //         deliverCode: "EPOST",
        //         sheetNo: "608773401921",
        //         dlvStatCode: "30",
        //         procDateTime: "20220101120200",
        //         errorCode: "",
        //         exceptionCode: ""
        // },
        // {
        //   transUniqueCd: "jTRgjwRspCAVCg4",

        //   uniqueCd: "o0001-001",
        // seq: 2,
        // partnerCode: "goods0001",
        // ordNo: "o0001",
        // ordLineNo: 1,
        // itemQty: 1,
        // deliverCode: "EPOST",
        // sheetNo: "608773401921",
        // dlvStatCode: "70",
        // procDateTime: "20220101120200",
        // errorCode: "",
        // exceptionCode: ""
        // }
        // ];
        // console.log(items);
        const itemFilter = items.map((i) => {
          return {
            transUniqueCd: i.transUniqueCd,
            deliveryNumber: i.sheetNo,
            deliveryCode: i.deliveryCode,
          };
        });

        const body = {
          deliveryNumberDtoList: itemFilter,
        };

        // console.log(body);
        const r = await postObjData(registerDeliveryNumberApiUrl, body);
        // console.log('server RESPONSE:\n', r);
        if (r.isDone) {
          alert('운송장번호 저장 완료');
        } else {
          console.error('운송장번호 저장 실패');
        }
      } else {
        alert('배송 리스트가 없습니다.\n다시 시도해주세요');
      }
    } else {
      const traceErrMsg = traceRes.data.error.message;
      if (traceErrMsg != null) {
        alert(traceErrMsg);
      }
      alert('다시 시도해주세요');
    }
  };

  const onValidOrderBeforeCancelOrderBySeller = () => {
    if (!selectedOrderIdList.length) {
      return alert('선택된 상품이 없습니다.');
    }
    setActiveModal({ orderCancel: true });
  };

  const onCancelOrderBySeller = async (enteredDetailReason, selectedIdList) => {
    if (!enteredDetailReason) return alert('판매취소사유를 입력해주세요.');
    if (selectedIdList.length <= 0)
      return alert('판매취소할 상품을 선택해주세요.');
    if (
      !confirm(
        `선택하신 ${selectedIdList.length} 개의 상품을 판매취소 처리하시겠습니까?\n선택된 상품이 포함된 주문은 '전체취소'처리됩니다.`,
      )
    )
      return;

    // const seletedOrderItemIdList = itemList
    //   .filter((item) => selectedIdList.indexOf(item.id) >= 0)
    //   .map((item) => item.orderItemId);
    const itemType = searchValues.orderType;
    const body =
      itemType === productType.GENERAL
        ? {
            orderItemIdList: selectedIdList, // 취소 컨펌 처리 할 주문한상품(orderItem) id 리스트
            reason: CancelReasonName.cancelNowOfGeneralOrderBySeller, // 포트원에 전달되는 사유 (일반결제)
            detailReason: enteredDetailReason,
          }
        : itemType === productType.SUBSCRIBE
        ? {
            orderIdList: selectedOrderIdList, // "주문 id" list
            reason: CancelReasonName.cancelNowOfSubscribeOrderBySeller, // 포트원에 전달되는 사유 (정기결제)
            detailReason: enteredDetailReason,
          }
        : null;
    // console.log(body);

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        orderCancel: true,
      }));
      const apiUrl = `/api/admin/orders/${itemType.toLowerCase()}/orderCancel`;
      const res = await postPaymentDataToApiServer(apiUrl, body); // 네이버페이 검수 대상 (결제취소: timeout 60초)
      // console.log('onOrderCancel: \n', 'apiUrl:', apiUrl, '\nbody:', body);
      // console.log('response: admin > sell > search > index.jsx\n', res);
      if (res.isDone) {
        alert(
          itemType === productType.GENERAL
            ? CancelReasonName.cancelNowOfGeneralOrderBySeller
            : CancelReasonName.cancelNowOfSubscribeOrderBySeller,
        );

        window.location.reload();
      } else {
        alert(`판매자 주문취소 처리 중 오류가 발생했습니다.\n${res.error}`);
      }
    } catch (err) {
      // console.log('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      orderCancel: false,
    }));
  };

  const filterInvalidOrderConfirmStatusItems = (items) => {
    return items.filter(
      (item) => item.orderStatus !== orderStatus.PAYMENT_DONE,
    );
  };

  const filterInvalidOrderDenyStatusItems = (items, orderType) => {
    if (orderType === productType.GENERAL) {
      return items.filter(
        (item) => item.orderStatus !== orderStatus.DELIVERY_READY,
      );
    } else if (orderType === productType.SUBSCRIBE) {
      return items.filter((item) => item.orderStatus !== orderStatus.PRODUCING);
    }
  };

  const filterInvalidDeliveryStatusItems = (items, orderType) => {
    let invalidItemList = [];
    if (orderType === productType.GENERAL) {
      invalidItemList = items.filter(
        (item) => item.orderStatus !== orderStatus.DELIVERY_READY,
      );
    } else if (orderType === productType.SUBSCRIBE) {
      invalidItemList = items.filter(
        (item) => item.orderStatus !== orderStatus.PRODUCING,
      );
    }
    return invalidItemList;
  };

  const onSearchInputKeydown = (e) => {
    enterKey(e, onSearchHandler);
  };

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
                idList={[productType.GENERAL, productType.SUBSCRIBE]}
                labelList={[productType.KOR.GENERAL, productType.KOR.SUBSCRIBE]}
                value={searchValues.orderType}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                목록 <Tooltip message={'주문 단위 리스트'} />
              </p>
              <div className="controls cont-left">
                <button
                  className="admin_btn line basic_m"
                  onClick={onStartOrderConfirm}
                >
                  {isLoading.confirm ? <Spinner /> : '주문확인'}
                </button>
                <button
                  className="admin_btn line basic_m"
                  onClick={onStartOrderDeny}
                >
                  확인취소
                </button>
                <button
                  className="admin_btn line basic_m"
                  onClick={onStartRegisterDelivery}
                >
                  주문발송
                </button>
                {/* <button
                  className="admin_btn line basic_m"
                  onClick={postDeliveryNo}
                >
                  운송장전송
                </button> */}
                <button
                  className="admin_btn line basic_m"
                  onClick={onValidOrderBeforeCancelOrderBySeller}
                >
                  {isLoading.orderCancel ? <Spinner /> : '판매취소'}
                </button>
                <button
                  className="admin_btn line pl-3 pr-3 pt-1 pb-1"
                  onClick={onStartManagerCompany}
                >
                  굿스플로 택배사 관리
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
                option={{
                  apiMethod: 'POST',
                  body: searchBody,
                  initialize: searchQueryInitialize,
                }}
              />
            </div>
          </section>
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
      {activeModal.orderCancel && (
        <Modal_orderCancleReason
          id={'orderCancel'}
          orderType={searchBody.orderType}
          setActiveModal={setActiveModal}
          onConfirm={onCancelOrderBySeller}
          selectedItemData={selectedItemList}
        />
      )}
      {activeModal.orderConfirm && (
        <Modal_orderConfirm
          id={'orderConFirm'}
          orderType={searchBody.orderType}
          setActiveModal={setActiveModal}
          onConfirm={onOrderConfirm}
          selectedItemData={selectedItemList}
        />
      )}
    </>
  );
}
