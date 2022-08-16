
import s from "./popup_sell.module.scss";
import {orderStatus} from "/store/TYPE/orderStatusTYPE";
import transformDate from "/util/func/transformDate";

const ProductInfo_orderStatusInfo = ({ basicOrderInfo, boxLabel }) => {
  // console.log(basicOrderInfo)
  return (
    <>
      <div className={s["t-header"]}>
        <h4 className={s.title}>{boxLabel}정보</h4>
      </div>
      <ul className={s["t-body"]}>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>처리상태</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{orderStatus.KOR[basicOrderInfo.orderStatus]}</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>{boxLabel}요청일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{transformDate(basicOrderInfo.cancelRequestDate, 'time', {seperator: '/'}) || '-'}</span>
              
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>{boxLabel}승인일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{transformDate(basicOrderInfo.cancelConfirmDate, 'time', {seperator: '/'}) || '-'}</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>{boxLabel}요청사유</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                {basicOrderInfo.cancelReason || '-'}
              </span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>{boxLabel}상세사유</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                {basicOrderInfo.cancelDetailReason || '-'}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProductInfo_orderStatusInfo;