import React, {useCallback, useRef, useState} from 'react';
import s from './promotion.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import {EmptyContMessage} from '/src/components/atoms/emptyContMessage';
import Spinner from '/src/components/atoms/Spinner';
import {postObjData} from "/src/pages/api/reqData";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import {useModalContext} from "/store/modal-context";
import enterKey from "/util/func/enterKey";
import {getDefaultPagenationInfo} from "/util/func/getDefaultPagenationInfo";
import MyPagePromotionList from "./PromotionList";


export default function PromotionPage () {
  
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const searchApiUrl = '/api/promotions';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState( {} );
  const [itemList, setItemList] = useState([]);
  const [submitted, setSubmitted] = useState( false );
  const [form, setForm] = useState( {} );
  const promotionInputRef = useRef( null );


  const pageInterceptor = useCallback((res) => {
    // console.log(res);
    return getDefaultPagenationInfo(res?.data, 'queryPromotionsDtoList');
  }, []);

  
  const onInputChangeHandler = useCallback( (e) => {
    const {id, value} = e.currentTarget;
    setForm( (prevState) => ({
      ...prevState,
      [id]: value,
    }) );
  }, [] );
  
  
  const onRegister = useCallback(async () => {
    if(submitted) return console.error( "이미 제출된 양식입니다." );
    if ( !form.code ) {
      return mct.alertShow( '프로모션 코드를 입력해주세요.' );
    }
  
    try {
      setSubmitted( true );
      setIsLoading( (prevState) => ({
        ...prevState,
        rep: true,
      }) );
      const body = {
        promotionCode: form.code,
      }
    
      const apiUrl = '/api/promotions/code';
      const res = await postObjData( apiUrl, body );
      // console.log(res);
      if ( res.isDone ) {
        mct.alertShow( '프로모션 참여 완료되었습니다.', onClickAPICallback );
        setTimeout( () => {
          window.location.reload();
        }, 1000 );
      
      } else if(res.status === 404) {
        mct.alertShow("프로모션 코드를 확인해주세요."); // 해당 프로모션 코드에 대응하는 쿠폰이 없을 경우.
        setSubmitted( false );
      } else {
        let defErrorMessage = '프로모션 코드를 등록할 수 없습니다.';
        let errorMessage = res.error || res.data?.data?.errors[0].defaultMessage;
        mct.alertShow(errorMessage || defErrorMessage);
        setSubmitted( false );
      }
    } catch (err) {
      console.error( err );
      mct.alertShow( err , onClickAPICallback);
      setSubmitted( false );
    } finally {
      setIsLoading( (prevState) => ({
        ...prevState,
        rep: false,
      }) );
    }
  },[form.code]);
  
  
  const onClickAPICallback = useCallback( () => {
    window.location.reload();
  }, [] );
  
  const onKeyDownHandler = (e) => {
    enterKey( e, onRegister );
  };
  
  
  return (
    <>
      <MetaTitle title="마이페이지 프로모션 조회"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>프로모션</section>
            <section className={s.coupon_code}>
              <label>
                <div className={s.coupon_code_row1}>프로모션 코드</div>

                <div className={s.flex_box}>
                  <input
                    className={s.input_box}
                    id={'code'}
                    type="text"
                    placeholder="프로모션 코드를 입력해주세요."
                    ref={promotionInputRef}
                    value={form.code || ''}
                    onChange={onInputChangeHandler}
                    onKeyDown={onKeyDownHandler}
                  />
                  <div className={s.btn_box}>
                    <button className={s.btn} onClick={onRegister}>
                      {isLoading.rep ? <Spinner style={{color:"#fff"}}/> :"등록"}
                    </button>
                  </div>
                </div>
              </label>
            </section>
            <section className={s.coupon_state_section}>
              <div className={s.coupon_state_flex_box}>
                <div className={s.left_box}>
                  프로모션 참여 현황
                </div>
              </div>
              <div className={s.horizon}>
                <hr/>
              </div>
              {itemList.length
                ? <MyPagePromotionList items={itemList}/>
                : isLoading.fetching
                  ? <Spinner/>
                  : <EmptyContMessage message={'참여한 프로모션이 없습니다.'}/>
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
      {hasAlert && <Modal_global_alert background/>}
    </>
  );
}
