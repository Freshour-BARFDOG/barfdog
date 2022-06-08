import s from "./popup_sell.module.scss";

const ProductInfo_payment = () => {
  return (
    <>
      <div className={s["t-header"]}>
        <h4 className={s.title}>결제정보</h4>
      </div>
      <ul className={s["t-body"]}>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>총 상품금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>78,600원</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송비</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>무료배송</span>
            </div>
          </div>
        </li>

        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>적립금사용</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>3,000원</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>쿠폰할인금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>6,000원</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>총 결제금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>69,600원</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>결제방법</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                <span>결제방법</span>
              </span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>결제방법</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>카드결제</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProductInfo_payment;
