import s from "./popup_sell.module.scss";
import {productType} from "/store/TYPE/itemType";
import transformDate from "/util/func/transformDate";
import {transformPhoneNumber} from "/util/func/transformPhoneNumber";

const ProductInfo_basicOrderInfo = ({basicOrderInfo}) => {
  // console.log(basicOrderInfo);
  return (
    <>
      <div className={s["t-header"]}>
        <h4 className={s.title}>주문정보</h4>
      </div>
      <ul className={s["t-body"]}>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>주문번호</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{basicOrderInfo.id}</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>주문&#40;결제&#41;일시</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{transformDate(basicOrderInfo.orderDate, 'time', {seperator: '/'})}</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>주문유형</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{productType.KOR[basicOrderInfo?.orderType]}</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>묶음배송여부</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{basicOrderInfo.package ? 'Y' : 'N'}</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구매자명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{basicOrderInfo.memberName}</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>연락처</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{transformPhoneNumber(basicOrderInfo.phoneNumber)}</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구매자ID</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{basicOrderInfo.email}</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구독회원</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{basicOrderInfo.subscribe ? 'Y' : 'N'}</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};



export default ProductInfo_basicOrderInfo;
