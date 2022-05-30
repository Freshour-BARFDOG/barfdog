import s from "./popup_sell.module.scss";

const ProductInfo_basicOrderInfo = (props) => {
  const DATA = props.data;

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
              <span>10000826742324</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>주문&#40;결제&#41;일시</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>2022/02/14 14:19</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>주문유형</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{DATA.paymentType}</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>묶음배송여부</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>Y</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구매자명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>홍길동</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>연락처</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>01053216549</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구매자ID</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>TEST_ID</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구독회원</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>Y</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProductInfo_basicOrderInfo;
