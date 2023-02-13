import React, {useCallback, useRef, useState} from 'react';
import s from './coupon.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Modal_useCoupon from '/src/components/modal/modal_mypage_coupon';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import transformDate from '/util/func/transformDate';
import {EmptyContMessage} from '/src/components/atoms/emptyContMessage';
import Spinner from '/src/components/atoms/Spinner';
import {Modal_registerCoupon} from '/src/components/modal/Modal_registerCoupon';
import {putObjData} from "/src/pages/api/reqData";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import {useModalContext} from "/store/modal-context";
import {couponActiveType, couponUseType} from "/store/TYPE/couponType";
import {getRemainingDaysNumberUntilExpired} from "/util/func/getDiffDate";


const initInfo = {
  availableCount: 0,
  totalCount: 0,
}


export default function CouponPage () {
  
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const searchApiUrl = '/api/coupons';
  const searchPageSize = 10;
  const apiDataQueryString = 'queryCouponsDtoList';
  const [isLoading, setIsLoading] = useState( {} );
  const [itemList, setItemList] = useState([]);
  const [activeUseCouponModal, setActiveUseCouponModal] = useState( false );
  const [activeRegisterCouponModal, setActiveRegisterCouponModal] = useState( false );
  const [form, setForm] = useState( {} );
  const couponCodeRef = useRef( null );
  
  
  const [info, setInfo] = useState( initInfo );
  
  const onActiveModalHandler = useCallback( () => {
    setActiveUseCouponModal( true );
  }, [] );
  
  const pageInterceptor = useCallback( (res, option = {itemQuery: null}) => {
    // res = DUMMY__RESPONSE; // ! TEST
    console.log( res );
    let newPageInfo = {
      totalPages: 1,
      size: searchPageSize,
      totalItems: 0,
      currentPageIndex: 0,
      newPageNumber: 1,
      newItemList: [],
    }
    
    const data = res?.data?.couponsPageDto;
    if ( data ) {
      
      const pageData = data.page;
      const curItemList = data._embedded.queryCouponsDtoList || [];
      
      const availableCouponList = curItemList.filter((item) =>
        getRemainingDaysNumberUntilExpired( item.expiredDate ) >= 0 && item.status === couponActiveType.ACTIVE
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
      setInfo( newCouponInfo );
    }
  
    return newPageInfo;
  }, [] );
  
  
  const onInputChangeHandler = useCallback( (e) => {
    const {id, value} = e.currentTarget;
    setForm( (prevState) => ({
      ...prevState,
      [id]: value,
    }) );
  }, [] );
  
  const onActiveCouponRegisterModal = useCallback( () => {
    if ( !form.code ) {
      return mct.alertShow( '쿠폰코드를 입력해주세요.' );
    }
    setActiveRegisterCouponModal( true );
  }, [form] );

  
  const onRegisterCouponByCode = async () => {
    // 유저 쿠폰 > 쿠폰코드를 입력하여 쿠폰받는 방식/
    if(!form.pw){
      return mct.alertShow('비밀번호를 입력해주세요.');
    }
  
    try {
      setIsLoading( (prevState) => ({
        ...prevState,
        rep: true,
      }) );
      const body = {
        code: form.code,
        password: form.pw
      }
    
      const apiUrl = '/api/coupons/code';
      const res = await putObjData( apiUrl, body );
    
      if ( res.isDone ) {
        setActiveRegisterCouponModal( false );
        mct.alertShow( '쿠폰이 등록되었습니다.', onSuccessCallback );
        setTimeout( () => {
          window.location.reload();
        }, 1000 );
      
      } else if ( res.status === 400 && res.status < 500 ) {
        let defErrorMessage = '쿠폰코드를 등록할 수 없습니다.';
        let errorMessage = res.data.data.errors[0].defaultMessage;
        errorMessage = errorMessage === "이미 사용된 쿠폰 입니다." ? '이미 등록되었거나, 사용된 쿠폰입니다.' : errorMessage;
        mct.alertShow( errorMessage || defErrorMessage );
      }
    } catch (err) {
      mct.alertShow( err );
      console.error( err );
    } finally {
      setIsLoading( (prevState) => ({
        ...prevState,
        rep: false,
      }) );
    }
  
  };
  
  const onSuccessCallback = useCallback( () => {
    window.location.reload();
  }, [] );
  
  
  return (
    <>
      <MetaTitle title="마이페이지 쿠폰조회"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>
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
                  />
                  <div className={s.btn_box}>
                    <button className={s.btn} onClick={onActiveCouponRegisterModal}>
                      등록
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
                <hr/>
              </div>
              {itemList.length
                ? <ul className={s.coupon_content_grid_box}>
                  {itemList.map( (item, i) => {
                      const expired = getRemainingDaysNumberUntilExpired( item.expiredDate ) < 0;
                      return <li key={`coupon-${item.id}-${i}`} className={`${s.grid_box} ${expired && s.expiredCoupon}`}>
                        <div className={s.left_top}>{item.name}</div>
                        <div className={s.right_top}>{item.discount}</div>
                        <div className={s.left_bot}>
                          <div className={s.left_bot_text}>
                            <p>{item.description}</p>
                            <p>사용처: {couponUseType.KOR[item.couponTarget]}</p>
                            <div className={s.inner_flex_box}>
                              <div className={s.left_text}>사용기한</div>
                              <div className={s.line}>
                                <hr/>
                              </div>
                              <div>{transformDate( item.expiredDate )}</div>
                            </div>
                          </div>
                        </div>
                        <div className={s.right_bot}>
                          <button
                            type={'button'}
                            className={`${s.useCoupon} ${expired && 'disabled'}`}
                            onClick={onActiveModalHandler}>
                            {expired ? "사용기한 만료" : "쿠폰 사용"}
                          </button>
                        </div>
                      </li>
                    } )}
                </ul>
                : isLoading.fetching
                  ? <Spinner/>
                  : <EmptyContMessage message={'사용 가능한 쿠폰이 없습니다.'}/>
              }
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
      </Layout>
      {activeUseCouponModal && (
        <Modal_useCoupon
          isActiveModal={activeUseCouponModal}
          setIsActiveModal={setActiveUseCouponModal}
        />
      )}
      {activeRegisterCouponModal && (
        <Modal_registerCoupon
          isActiveModal={activeUseCouponModal}
          setIsActiveModal={setActiveRegisterCouponModal}
          form={form}
          onChange={onInputChangeHandler}
          event={onRegisterCouponByCode}
          isLoading={isLoading}
        />
      )}
      {hasAlert && <Modal_global_alert background/>}
    </>
  );
}
