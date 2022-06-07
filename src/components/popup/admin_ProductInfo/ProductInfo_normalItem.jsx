import s from "./popup_sell.module.scss";


const ProductInfo_normItem = () => {
  return (
    <>
      <ul className={`${s["t-body"]} ${s["product-item-info"]}`}>
        <p className={s["t-top-row"]}>
          <span className={s["product-title"]}>상품주문정보</span>
          <span className={s["product-idx"]}>2022032540080871</span>
        </p>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>상품명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                바프독 레시피 올인원 패키지 강아지 생식 닭 칠면조 오리 양 소 1kg
              </span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>옵션</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>세트1&#41; 스타터4+터키비프2+덕램2+램비프2</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>수량</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>1개</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>주문금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>26,400원</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>쿠폰사용</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>첫 구매 50%할인 쿠폰</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>쿠폰할인금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>7,200원</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>처리상태</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>결제완료</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProductInfo_normItem;
