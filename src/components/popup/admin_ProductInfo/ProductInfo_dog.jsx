import s from "./popup_sell.module.scss";


const ProductInfo_dog = () => {
  return (
    <>
      <div className={s["t-header"]}>
        <h4 className={s.title}>반려견 정보</h4>
      </div>
      <ul className={s["t-body"]}>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>견명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>바둑이</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>못먹는 음식</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>Y&#40;닭&#41;</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>특이사항</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>Y</span>
              <span> &#40;땅콩알러지 있어요&#41;</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProductInfo_dog;
