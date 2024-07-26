import React, { useCallback, useRef, useState } from 'react';
import s from './coupon.module.scss';
import LayoutWithoutFooter from '/src/components/common/LayoutWithoutFooter';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Modal_useCoupon from '/src/components/modal/modal_mypage_coupon';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import transformDate from '/util/func/transformDate';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import Spinner from '/src/components/atoms/Spinner';
import { putObjData } from '/src/pages/api/reqData';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import { couponActiveType, couponUseType } from '/store/TYPE/couponType';
import { getRemainingDaysNumberUntilExpired } from '/util/func/getDiffDate';
import enterKey from '/util/func/enterKey';
import { discountUnitType } from '../../../../store/TYPE/discountUnitType';
import transformLocalCurrency from '../../../../util/func/transformLocalCurrency';
import { useRouter } from 'next/router';
import Image from 'next/image';

const initInfo = {
  availableCount: 0,
  totalCount: 0,
};

export default function CouponPage() {
  const mct = useModalContext();
  const router = useRouter();
  const hasAlert = mct.hasAlert;
  const searchApiUrl = '/api/coupons';
  const searchPageSize = 100;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [activeUseCouponModal, setActiveUseCouponModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({});
  const couponCodeRef = useRef(null);

  const [info, setInfo] = useState(initInfo);

  const onActiveModalHandler = useCallback(() => {
    setActiveUseCouponModal(true);
  }, []);

  const pageInterceptor = useCallback((res, option = { itemQuery: null }) => {
    // res = DUMMY__RESPONSE; // ! TEST
    // console.log( res );
    let newPageInfo = {
      totalPages: 1,
      size: searchPageSize,
      totalItems: 0,
      currentPageIndex: 0,
      newPageNumber: 1,
      newItemList: [],
    };

    const data = res?.data?.couponsPageDto;
    if (data) {
      const pageData = data.page;
      const curItemList = data._embedded.queryCouponsDtoList || [];

      const availableCouponList = curItemList.filter(
        (item) =>
          getRemainingDaysNumberUntilExpired(item.expiredDate) >= 0 &&
          item.status === couponActiveType.ACTIVE,
      );

      newPageInfo = {
        totalPages: pageData.totalPages,
        size: pageData.size,
        totalItems: pageData.totalElements,
        currentPageIndex: pageData.number,
        newPageNumber: pageData.number + 1,
        newItemList: availableCouponList,
      };

      const newCouponInfo = {
        availableCount: availableCouponList.length,
        totalCount: res.data.totalCount,
      };
      setInfo(newCouponInfo);
    }

    return newPageInfo;
  }, []);

  const onInputChangeHandler = useCallback((e) => {
    const { id, value } = e.currentTarget;
    setForm((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }, []);

  const onRegisterCouponByCode = useCallback(async () => {
    if (submitted) return console.error('이제 제출된 양식입니다.');
    if (!form.code) {
      return mct.alertShow('쿠폰코드를 입력해주세요.');
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        rep: true,
      }));

      const body = {
        code: form.code,
      };

      const apiUrl = '/api/coupons/code';
      const res = await putObjData(apiUrl, body);

      if (res.isDone) {
        setSubmitted(true);
        mct.alertShow('쿠폰이 등록되었습니다.', onSuccessCallback);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (res.status === 400 && res.status < 500) {
        let defErrorMessage = '쿠폰코드를 등록할 수 없습니다.';
        let errorMessage = res.data.data.errors[0].defaultMessage;
        errorMessage =
          errorMessage === '이미 사용된 쿠폰 입니다.'
            ? '이미 등록되었거나, 사용된 쿠폰입니다.'
            : errorMessage;
        mct.alertShow(errorMessage || defErrorMessage);
      }
    } catch (err) {
      mct.alertShow(err);
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        rep: false,
      }));
    }
  }, [form.code]);

  const onSuccessCallback = useCallback(() => {
    window.location.reload();
  }, []);

  const onKeyDownHandler = (e) => {
    enterKey(e, onRegisterCouponByCode);
  };

  const onGlobalModalCallback = () => {
    mct.alertHide();
  };

  const onPrevPage = () => {
    router.push('/mypage');
  };

  return (
    <>
      <MetaTitle title="마이페이지 쿠폰조회" />
      <LayoutWithoutFooter>
        <Wrapper>
          <MypageWrapper>
            <header>
              <div className={s.prev_btn} style={{ cursor: 'pointer' }}>
                <Image
                  src={'/img/order/left_arrow.svg'}
                  alt="left_arrow"
                  width={24}
                  height={24}
                  onClick={onPrevPage}
                />
              </div>
            </header>
            <section className={s.title}>쿠폰 조회</section>
            <section className={s.coupon_code}>
              <label>
                <div className={s.coupon_code_row1}>쿠폰등록</div>

                <div className={s.flex_box}>
                  <input
                    className={s.input_box}
                    id={'code'}
                    type="text"
                    placeholder="쿠폰코드를 입력해주세요."
                    ref={couponCodeRef}
                    value={form.code || ''}
                    onChange={onInputChangeHandler}
                    onKeyDown={onKeyDownHandler}
                  />
                  <div className={s.btn_box}>
                    <button className={s.btn} onClick={onRegisterCouponByCode}>
                      {isLoading.rep ? (
                        <Spinner style={{ color: '#fff' }} />
                      ) : (
                        '등록'
                      )}
                    </button>
                  </div>
                </div>
              </label>
            </section>
            <section className={s.coupon_state_section}>
              <div className={s.coupon_state_flex_box}>
                <div className={s.left_box}>
                  사용 가능한 쿠폰 : <span>{info.availableCount || 0}</span>개
                </div>
              </div>

              <div className={s.horizon}>
                <hr />
              </div>
              {itemList.length ? (
                <ul className={s.coupon_content_grid_box}>
                  {itemList.map((item, i) => {
                    const expired =
                      getRemainingDaysNumberUntilExpired(item.expiredDate) < 0;
                    const maxDiscountString =
                      (item.discountType === discountUnitType.FIXED_RATE &&
                        item.availableMaxDiscount) >= 9999999 &&
                      '최대 할인금액 제한없음';
                    const minPriceString =
                      (item.discountType === discountUnitType.FIXED_RATE &&
                        item.availableMinPrice) <= 0 && '최소 이용금액 없음';
                    return (
                      <li
                        key={`coupon-${item.id}-${i}`}
                        className={`${s.grid_box} ${
                          expired && s.expiredCoupon
                        }`}
                      >
                        <div className={s.left_top}>
                          <span className={s.name}>{item.name}</span>
                          <span className={`${s.discount} ${s.pointColor}`}>
                            {transformLocalCurrency(item.discountDegree)}
                            {discountUnitType.KOR[item.discountType]}
                          </span>
                          {item.discountType ===
                            discountUnitType.FIXED_RATE && (
                            <span
                              className={`${s.availableMaxDiscount} ${s.pointColor}`}
                            >
                              &#40;{' '}
                              {maxDiscountString ||
                                `최대 ${transformLocalCurrency(
                                  item.availableMaxDiscount,
                                )}원 할인`}{' '}
                              &#41;
                            </span>
                          )}
                        </div>
                        <div className={s.right_top}>
                          <button
                            type={'button'}
                            className={`${s.useCoupon} ${
                              expired && 'disabled'
                            }`}
                            onClick={onActiveModalHandler}
                          >
                            {expired ? '사용기한 만료' : '쿠폰 사용'}
                          </button>
                        </div>
                        <div className={s.left_bot}>
                          <div className={s.left_bot_text}>
                            <p>{item.description}</p>
                            <p>
                              {couponUseType.KOR[item.couponTarget]} 사용가능
                            </p>
                            {item.discountType ===
                              discountUnitType.FIXED_RATE && (
                              <span
                                className={`${s.availableMinPrice} ${s.left_text}`}
                              >
                                {minPriceString ||
                                  `${transformLocalCurrency(
                                    item.availableMinPrice,
                                  )}원 이상 구매시`}
                              </span>
                            )}
                            {/* <div className={s.left_text}>사용기한</div>
                              <div className={s.line}>
                                <hr/>
                              </div>
                              <div>{transformDate( item.expiredDate )}</div> */}
                          </div>
                        </div>
                        <div className={s.right_bot}>
                          <em>
                            사용한도
                            <div className={s.line}>
                              <hr />
                            </div>
                            <b>{item.amount}회</b>
                          </em>
                          <em>
                            사용기한
                            <div className={s.line}>
                              <hr />
                            </div>
                            <b>
                              {transformDate(item.expiredDate, null, {
                                seperator: '. ',
                              })}
                            </b>
                          </em>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : isLoading.fetching ? (
                <Spinner />
              ) : (
                <EmptyContMessage message={'사용 가능한 쿠폰이 없습니다.'} />
              )}
            </section>
            <div className={s.pagination_box}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterceptor}
              />
            </div>
          </MypageWrapper>
        </Wrapper>
      </LayoutWithoutFooter>
      {activeUseCouponModal && (
        <Modal_useCoupon
          isActiveModal={activeUseCouponModal}
          setIsActiveModal={setActiveUseCouponModal}
        />
      )}
      {hasAlert && (
        <Modal_global_alert onClick={onGlobalModalCallback} background />
      )}
    </>
  );
}
