import s from "./popup_sell.module.scss";
import {subscribePlanType} from "/store/TYPE/subscribePlanType";
import transformLocalCurrency from "../../../../util/func/transformLocalCurrency";

const ProductInfo_subscribe = ({subscribeInfo,  isChangedSubscribeInfo }) => {
  return (
    <>
      {isChangedSubscribeInfo ? (
        <div className={s["notice-message"]}>
          *구독정보 변경으로 주문 변경 내용이 있습니다. 이전 구독정보가 아래에
          표시됩니다.
        </div>
      ) : (
        <div className={s["t-header"]}>
          <h4 className={s.title}>구독 정보</h4>
        </div>
      )}
      <ul className={s["t-body"]}>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구독회차</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{subscribeInfo.subscribeCount}회차</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>플랜</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{subscribePlanType[subscribeInfo.plan].KOR}</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>급여량</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{transformLocalCurrency(subscribeInfo.oneMealRecommendGram)}g</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>레시피</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{subscribeInfo.recipeName}</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProductInfo_subscribe;
