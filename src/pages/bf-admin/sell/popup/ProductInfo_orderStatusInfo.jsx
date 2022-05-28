
import s from "./popup_sell.module.scss";

const ProductInfo_orderStatusInfo = ({ data, boxLabel }) => {
  const DATA = data;

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
              <span>취소요청</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>{boxLabel}요청일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>2022-05-28 11:30:11</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>{boxLabel}승인일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>2022-05-28 11:30:11</span>
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
                단순변심단순변심단순변심단순변심단순변심단순변심단순변심
                단순변심 단순변심 단순변심 단순변심 단순변심
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
                단순변심단순변심단순변심단순변심단순변심단순변심단순변심
                단순변심 단순변심 단순변심 단순변심
                단순변심단순변심단순변심단순변심단순변심단순변심단순변심단순변심
                단순변심 단순변심 단순변심 단순변심
                단순변심단순변심단순변심단순변심단순변심단순변심단순변심단순변심
                단순변심 단순변심 단순변심 단순변심 단순변심
              </span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProductInfo_orderStatusInfo;