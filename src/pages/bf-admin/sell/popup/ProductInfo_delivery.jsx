import s from "./popup_sell.module.scss";


const ProductInfo_delivery = () => {
  return (
    <>
      <div className={s["t-header"]}>
        <h4 className={s.title}>배송정보</h4>
      </div>
      <ul className={s["t-body"]}>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>수취인명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>김바프</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>연락처</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>010-1234-0000</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송지 주소</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>서울 서대문구 독립문로1길 9-12 503호</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송 요청사항</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>부재 시 문 앞</span>
            </div>
          </div>
        </li>

        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>발송처리일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>2022/02/16 16:31:28</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송완료일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                <span>2022/02/18 16:31:28</span>
              </span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}  ${s["auto-height"]}`}>
              <span>송장번호</span>
            </div>
            <div className={`${s.innerBox} ${s.cont} ${s["auto-height"]}`}>
              <span>cj대한통운 26542106385426</span>
              <span>
                <button
                  id={"inquire-delivery"}
                  className="admin_btn line basic_s"
                >
                  배송조회
                </button>
              </span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}  ${s["auto-height"]}`}>
              <span>구매확정일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}  ${s["auto-height"]}`}>
              <span>20/02/15 16:23:48</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProductInfo_delivery;
