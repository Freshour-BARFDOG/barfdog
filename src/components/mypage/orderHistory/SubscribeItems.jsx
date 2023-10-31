import s from '/src/pages/mypage/orderHistory/orderHistory.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import React, {useCallback, useState} from 'react';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import {orderStatus} from '/store/TYPE/orderStatusTYPE';
import {cancelSubscribeOrder} from "/util/func/order/cancelOrder";
import Spinner from "../../atoms/Spinner";
import {iamportBillingKeyResponseCode} from "../../../pages/api/iamport/getCustomerBillingKey";
import {IamportExtraRequester} from "../../../../type/naverpay/IamportExtraRequester";
import {CancelReasonName} from "../../../../store/TYPE/order/CancelReasonName";
import {deleteIamportCustomerBillingKey} from "../../../../util/func/order/iamport/deleteIamportCustomerBillingKey";


export const SubscribeItems = ({itemList}) => {
  const [isLoading, setIsLoading] = useState({
    cancelOrder: {},
    deleteBillingKey: {}
  });
  const [submitted, setSubmitted] = useState(false);

  const onCancelSubscribeOrder = useCallback(async (item) => {
    if (submitted) return console.error("이미 제출된 양식입니다.");
    if (!confirm("'결제 전' 주문을 결제취소처리 하시겠습니까?")) return;
    setSubmitted(true);

    const merchantUid = item.subscribeOrderDto.merchantUid;
    const orderId = item.subscribeOrderDto.orderId;
    try {
      setIsLoading(prevState => ({
        ...prevState,
        cancelOrder: {
          [orderId]: true
        }
      }));
      const res = await cancelSubscribeOrder(orderId);
      // console.log(res);
      if (res.isDone) {
        alert(`결제취소처리가 완료되었습니다. \n주문번호: ${merchantUid}`);
        onSuccessCallback();
      } else {
        alert(`결제취소처리에 실패하였습니다.`);
      }
    } catch (err) {
      alert(`결제취소 처리 중 오류가 발생하였습니다.\n 지속적으로 에러가 발생할 경우, 관리자에게 문의바랍니다.`);
      console.error(err)
    } finally {
      setIsLoading(prevState => ({
        ...prevState,
        cancelOrder: {
          [orderId]: false
        }
      }))
    }
  }, [itemList, submitted]);


  const onDeleteBillingKey = async ({customerUid, orderId}) => {
    if (!customerUid) return alert("구독해지 불가능한 주문입니다. 관리자에게 문의하세요.");
    if (!confirm("네이버페이 정기구독 해지를 진행하시겠습니까?")) return // console.log("사용자가 네이버페이 정기구독 해지를 취소하였습니다.");
    setIsLoading((prevState) => ({
      ...prevState,
      deleteBillingKey: {
        [orderId]: true
      }
    }));
    try {
      const res = await deleteIamportCustomerBillingKey({
        customerUid,
        reason: CancelReasonName.unsubscribeNaverpayByCustomer,
        requester: IamportExtraRequester.CUSTOMER
      });


      // console.log(res);
      if (res.status === 200) {
        const d = res.data;
        const data = {
          code: d.code,
        }

        if (data.code === iamportBillingKeyResponseCode.valid) {
          alert("[성공] 네이버페이 정기구독해지가 정상적으로 처리되었습니다.");
          onSuccessCallback();
        } else {
          alert("[실패] 네이버페이 정기구독 해지에 실패하였습니다.");
        }
      } else {
        alert("API 요청에 실패하였습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        deleteBillingKey: {
          [orderId]: false
        }
      }));
    }
  };

  const onSuccessCallback = () => {
    window.location.reload();
  };

  return (
    <>
      <ul className={`${s['subscribeItem-container']}`}>
        {itemList?.length > 0 &&
          itemList.map((item, index) => (<li key={`subscribe-item-${index}`}>
            <div className={s.day}>{transformDate(item.subscribeOrderDto.orderDate, 'total')}</div>
            <div className={s.content_body}>
              <div className={s.left_box}>
                <figure className={`${s.image} img-wrap`}>
                  <Image
                    priority={false}
                    src={item.recipeDto.thumbnailUrl}
                    objectFit="cover"
                    layout="fill"
                    alt={`레시피 썸네일`}
                  />
                </figure>

                <div className={s.flex_box}>
                  <div className={s.text}>
                    <p>{item.subscribeOrderDto.dogName}</p>
                    <div className={s.last_text}>
                      {item.recipeDto.recipeName} ({item.subscribeOrderDto.subscribeCount}회차)
                    </div>
                  </div>

                  <div className={s.text2}>
                    <div>주문번호</div>
                    <div>{item.subscribeOrderDto.merchantUid}</div>
                    <div>결제금액</div>
                    <div>{transformLocalCurrency(item.subscribeOrderDto.paymentPrice)}원</div>
                  </div>
                </div>
              </div>

              <div className={s.mid_box}>
                {orderStatus.KOR[item.subscribeOrderDto.orderStatus]}
              </div>
              <div className={s.right_box}>
                {item.subscribeOrderDto.needToCancelNaverpaySubscribe &&
                  <button className={`${s.btn} ${s["naverPay-btn"]}`}
                          onClick={onDeleteBillingKey.bind(null, {customerUid: item.subscribeOrderDto.customerUid, orderId: item.subscribeOrderDto.orderId})}>
                    {isLoading.deleteBillingKey[item.subscribeOrderDto.orderId] ?
                      <Spinner style={{color: "#fff"}}/> : <span>네이버페이 구독 해지</span>
                    }
                  </button>}
                {item.subscribeOrderDto.orderStatus === orderStatus.BEFORE_PAYMENT
                  ? <button className={`${s.btn} ${s.cancelOrder}`} onClick={onCancelSubscribeOrder.bind(null, item)}>
                    {isLoading.cancelOrder[item.subscribeOrderDto.orderId] ?
                      <Spinner style={{color: "#fff"}}/> : "결제 취소"}
                  </button>
                  : <Link
                    href={`/mypage/orderHistory/subscribe/${item.subscribeOrderDto.orderId}`}
                    passHref
                  >
                    <a className={s.btn}>주문상세 </a>
                  </Link>
                }
                <a
                  href={`/mypage/subscribe/${item.subscribeOrderDto.subscribeId}`}
                  className={s.btn2}
                >
                  구독관리
                </a>
              </div>
            </div>
          </li>))}
      </ul>
    </>
  );
};
