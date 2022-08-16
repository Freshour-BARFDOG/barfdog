import s from './popup_sell.module.scss';
import { dogInedibleFoodType } from '/store/TYPE/dogInedibleFoodType';

const ProductInfo_dog = ({ dogInfo }) => {
  // console.log(dogInfo);
  return (
    <>
      <div className={s['t-header']}>
        <h4 className={s.title}>반려견 정보</h4>
      </div>
      <ul className={s['t-body']}>
        <li className={`${s['t-row']} ${s['fullWidth']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>견명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{dogInfo.name}</span>
            </div>
          </div>
        </li>
        <li className={`${s['t-row']}  ${s.autoHeight}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>못먹는 음식</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                {dogInfo.inedibleFood === dogInedibleFoodType.NONE
                  ? 'N'
                  :  dogInfo.inedibleFood === dogInedibleFoodType.ETC
                  ? `${dogInedibleFoodType.KOR.ETC} (${dogInfo.inedibleFoodEtc})`
                  : dogInfo.inedibleFood}
              </span>
            </div>
          </div>
          <div className={`${s['t-box']}`}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>특이사항</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{dogInfo.caution === dogInedibleFoodType.NONE
                ? 'N'
                : `${dogInfo.caution}`}</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProductInfo_dog;
