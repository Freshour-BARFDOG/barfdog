import s from "./popup_sell.module.scss";
import React, {useCallback, useEffect, useState} from "react";
import {IoIosArrowDropdown} from "react-icons/io";
import ErrorMessage from "@src/components/atoms/ErrorMessage";
import Spinner from "@src/components/atoms/Spinner";
import {checkNeedToCancelNaverpaySubscribe} from "@util/func/order/checkNeedToCancelNaverpaySubscribe";
import {PaymentMethod} from "@store/TYPE/paymentMethodType";
import {iamportBillingKeyResponseCode} from "@src/pages/api/iamport/getCustomerBillingKey";
import {LoadingInterface} from "../../../../type/LoadingInterface";
import {IamportExtraRequester} from "../../../../type/naverpay/IamportExtraRequester";
import {deleteIamportCustomerBillingKey} from "@util/func/order/iamport/deleteIamportCustomerBillingKey";
import {CancelReasonName} from "@store/TYPE/order/CancelReasonName";


interface PropsInterface {
  data: {
    paymentMethod: PaymentMethod;
    orderStatus: string;
    impUid: string;
    customerUid: string;
    memberName: string;
  }
}

export const ProductInfo_naverpay = ({data}: PropsInterface) => {
  const {memberName, paymentMethod, orderStatus, impUid, customerUid} = data;

  const initialState = null;
  const [isActive, setIsActive] = useState<boolean>(false);
  const [needToCancelSubscribe, setNeedToCancelSubscribe] = useState<boolean>(initialState);
  const [isLoading, setIsLoading] = useState<LoadingInterface>({
    delete: false,
    fetching: false
  });

  const onToggleHandler = useCallback(() => {
    setIsActive(!isActive);
  }, [isActive]);


  useEffect(() => {

    if (!customerUid || needToCancelSubscribe !== initialState) return;

    // 아임포트 전송데이터
    (async () => {
      setIsLoading(prev => ({
        ...prev,
        fetching: true
      }));
      try {
        const needToCancelNaverpaySubscribe = await checkNeedToCancelNaverpaySubscribe({
          paymentMethod: paymentMethod,
          orderStatus: orderStatus,
          paid: !!impUid,
          customerUid: customerUid,
          setIsLoading: setIsLoading
        });

        setNeedToCancelSubscribe(needToCancelNaverpaySubscribe);
      } catch (err) {
        console.error(err);
        alert("API 요청 중 오류가 발생하였습니다. 사이트 관리자에게 문의하시기 바랍니다.");
      } finally {
        setIsLoading(prev => ({
          ...prev,
          fetching: false
        }));
      }
    })();

  }, [data]);


  const onDeleteBillingKey = async () => {
    if (!customerUid) return alert("구독해지 불가능한 주문입니다. 관리자에게 문의하세요.");
    if (!confirm(`[ ${memberName} ]님의 네이버페이 정기구독 해지를 진행하시겠습니까?`)) return // console.log("사용자가 네이버페이 정기구독 해지를 취소하였습니다.");
    setIsLoading(prev => ({
      ...prev,
      delete: true
    }));
    try {
      const res = await deleteIamportCustomerBillingKey({
        customerUid,
        reason: CancelReasonName.unsubscribeNaverpayByAdmin,
        requester: IamportExtraRequester.ADMIN
      });
      // console.log(res);
      if (res.status === 200) {
        const d = res.data;
        const data = {
          code: d.code,
        }

        if (data.code === iamportBillingKeyResponseCode.valid) {
          alert("[성공] 네이버페이 정기구독해지가 정상적으로 처리되었습니다.");
          onSuccessDeleteBillingKeyCallback();
        } else {
          alert("[실패] 네이버페이 정기구독 해지에 실패하였습니다.");
        }
      } else {
        alert("API 요청에 실패하였습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(prev => ({
        ...prev,
        delete: false
      }));
    }
  };

  const onSuccessDeleteBillingKeyCallback = () => {
    setNeedToCancelSubscribe(false);
  };


  if (!customerUid || needToCancelSubscribe === false) {
    // 네이버페이 정기결제해지 취소 조건에 안맞을 경우, 랜더링 X
    return <></>;
  }

  return (
    <>
      {isLoading.fetching ? <ErrorMessage fontSize={17} valid={false} loading={<Spinner/>} fullWidth={true}>
        </ErrorMessage> :
        needToCancelSubscribe && <>
          <div className={`${s["iamport"]} ${isActive ? s.on : ""}`}>
            <div className={`${s["t-header"]}`}>
              <h4 className={s.title} onClick={onToggleHandler}>
                <span className={`${s['title-innerText']}`}>
                  네이버페이 정보
                  <i className={s.alert}>최초결제 실패 후, 네이버페이 정기결제 미해지 건만 노출됩니다.</i>
                </span>
                <i className={`${s["icon-box"]}`}>
                  펼치기
                  <IoIosArrowDropdown size={20}/>
                </i>
              </h4>
            </div>
            <ul className={`${s["t-body"]} ${s["has-row-1"]}`}>
              <li className={`${s["t-row"]}`}>
                <div className={s["t-box"]}>
                  <div className={`${s.innerBox} ${s.label}`}>
                    <span>정기결제 빌링키</span>
                  </div>
                  <div className={`${s.innerBox} ${s.cont}`}>
                    <span>{customerUid}</span>
                  </div>
                </div>
                <div className={s["t-box"]}>
                  <div className={`${s.innerBox} ${s.label}`}>
                    <span>네이버페이 구독 설정</span>
                  </div>
                  <div className={`${s.innerBox} ${s.cont} ${s["button-container"]}`}>
                    <button className={"custom_btn line point basic_m"} onClick={onDeleteBillingKey}>
                      {isLoading.delete ? <Spinner style={{color: "var(--color-main)"}}/> : "구독 해지"}
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </>
      }
    </>
  );
};
