import s from "./popup_sell.module.scss";
import React, {useCallback, useEffect, useState} from "react";
import transformLocalCurrency from "@util/func/transformLocalCurrency";
import {IoIosArrowDropdown} from "react-icons/io";
import axios from "axios";
import {GetPaymentsByImpUidRequest, GetPaymentsByImpUidResponse} from "@src/pages/api/iamport/paymentInfo";
import ErrorMessage from "@src/components/atoms/ErrorMessage";
import Spinner from "@src/components/atoms/Spinner";



interface PropsInterface {
  data:{
    impUid: string;
  }
}
export const ProductInfo_iamport = ({data}:PropsInterface) => {
  const {impUid} = data;

  const [isActive, setIsActive] = useState<boolean>(false);
  const [info, setInfo] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onToggleHandler = useCallback(() => {
    setIsActive(!isActive);
  }, [isActive]);


  useEffect(() => {
    // validation
    // api조회시 필요한 포트원 고유번호가 없는경우
    // 이미 데이터가 있는경우
    if (!impUid || info) return;


    // 아임포트 전송데이터
    (async () => {
      setIsLoading(true);
      try {
        const data: GetPaymentsByImpUidRequest = {
          impUid: impUid
        }
        const localOrigin = window.location.origin;
        const res = await axios({
          method: "POST",
          url: `${localOrigin}/api/iamport/paymentInfo`,
          data: data,
          timeout: 60000
        })
          .then(res => res)
          .catch(err => err.response);

        console.log(res);
        if (res.status === 200) {
          const d:GetPaymentsByImpUidResponse = res.data.response;
          const iamportData = {
            imp_uid: d.imp_uid,
            customer_uid: d.customer_uid,
            pg_provider: d.pg_provider,
            status: d.status,
            bank_name: d.bank_name || "-",
            card_name: d.card_name || "-",
            amount: d.amount,
            cancel_amount: d.cancel_amount,
          }
          setInfo(iamportData);
        } else {
          alert("포트원 데이터 요청에 실패하였습니다.");
        }
      } catch (err) {
        console.error(err);
        alert("API 요청 중 오류가 발생하였습니다. 사이트 관리자에게 문의하시기 바랍니다.");
      } finally {
        setIsLoading(false);
      }
    })();

  }, [data]);


  if (!impUid) {
    // CASE: 예약결제, 결제취소, 결제 실패 등
    return <></>;
  }

  return (
    <>
      {isLoading ? <ErrorMessage fontSize={17} valid={false} loading={<Spinner/>} fullWidth={true}>
        </ErrorMessage> :
        info ? <>
          <div className={`${s["iamport"]} ${isActive ? s.on : ""}`}>
            <div className={`${s["t-header"]}`}>
              <h4 className={s.title} onClick={onToggleHandler}>
                포트원 주문정보
                <i className={`${s["icon-box"]}`} >
                  펼치기
                  <IoIosArrowDropdown size={20}/>
                </i>
              </h4>
            </div>
            <ul className={`${s["t-body"]}`}>
              <li className={`${s["t-row"]}`}>
                <div className={s["t-box"]}>
                  <div className={`${s.innerBox} ${s.label}`}>
                    <span>포트원 고유번호</span>
                  </div>
                  <div className={`${s.innerBox} ${s.cont}`}>
                    <span>{info.imp_uid}</span>
                  </div>
                </div>
                <div className={s["t-box"]}>
                  <div className={`${s.innerBox} ${s.label}`}>
                    <span>빌링키</span>
                  </div>
                  <div className={`${s.innerBox} ${s.cont}`}>
                    <span>{info.customer_uid}</span>
                  </div>
                </div>
              </li>
              <li className={`${s["t-row"]}`}>
                <div className={s["t-box"]}>
                  <div className={`${s.innerBox} ${s.label}`}>
                    <span>PG사</span>
                  </div>
                  <div className={`${s.innerBox} ${s.cont}`}>
                    <span>{info.pg_provider}</span>
                  </div>
                </div>
                <div className={s["t-box"]}>
                  <div className={`${s.innerBox} ${s.label}`}>
                    <span>결제상태</span>
                  </div>
                  <div className={`${s.innerBox} ${s.cont}`}>
                    <span>{info.status}</span>
                  </div>
                </div>
              </li>
              <li className={`${s["t-row"]}`}>
                <div className={s["t-box"]}>
                  <div className={`${s.innerBox} ${s.label}`}>
                    <span>카드명</span>
                  </div>
                  <div className={`${s.innerBox} ${s.cont}`}>
                    <span>{info.card_name}</span>
                  </div>
                </div>
                <div className={s["t-box"]}>
                  <div className={`${s.innerBox} ${s.label}`}>
                    <span>은행명</span>
                  </div>
                  <div className={`${s.innerBox} ${s.cont}`}>
                    <span>{info.bank_name}</span>
                  </div>
                </div>
              </li>
              <li className={`${s["t-row"]}`}>
                <div className={s["t-box"]}>
                  <div className={`${s.innerBox} ${s.label}`}>
                    <span>결제금액</span>
                  </div>
                  <div className={`${s.innerBox} ${s.cont}`}>
                    <span>{transformLocalCurrency(info.amount)}원</span>
                  </div>
                </div>
                <div className={s["t-box"]}>
                  <div className={`${s.innerBox} ${s.label}`}>
                    <span>취소금액</span>
                  </div>
                  <div className={`${s.innerBox} ${s.cont}`}>
                    <span>{transformLocalCurrency(info.cancel_amount)}원</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </>
          : <ErrorMessage fontSize={17} valid={false} loading={null} fullWidth={true}>
          * 포트원 정보조회에 실패하였습니다.
          </ErrorMessage>
        }
    </>
  );
};
