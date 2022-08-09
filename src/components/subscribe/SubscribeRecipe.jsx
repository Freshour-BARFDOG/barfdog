import React, {useContext, useEffect, useState} from 'react';
import s from './subscribeRecipe.module.scss'
import 'swiper/css';
import Image from 'next/image';
import {getData, postObjData} from "/src/pages/api/reqData";
import Spinner from "/src/components/atoms/Spinner";
import checkStringUnderConsonant from "/util/func/checkStringUnderConsonant";
import {subscribePlanType} from "/store/TYPE/subscribePlanType";
import {Swiper, SwiperSlide} from "swiper/react";
import {SubscribeCustomInput} from "./SubscribeCustomInput";
import {ItemRecommendlabel, ItemSoldOutLabel} from "../atoms/ItemLabel";
import popupWindow from "/util/func/popupWindow";
import {useModalContext} from "/store/modal-context";
import Modal_confirm from "/src/components/modal/Modal_confirm";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import {valid_isTheSameArray} from "/util/func/validation/validationPackage";
import {ToggleBoxContext} from "../atoms/ToggleBox";
import {FullScreenLoading} from "../atoms/FullScreenLoading";


const swiperSettings = {
  className: `${s.swiper_recipes} ${s.inMypage}`,
  slidesPerView: 'auto',
  spaceBetween: 20,
  loop: false, // ! Important : loop사용 시, checkbox복수 선택 불가함 (loop에 사용되는 dummy slider로 인함)
  autoplay: false,
  breakpoints: {
    300: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    651: {
      //601 이상일 경우
      slidesPerView: 2, //레이아웃 2열
      spaceBetween: 20,
    },
    1001: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1201: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
};


export const SubscribeRecipe = ({subscribeInfo}) => {
  
  const mct = useModalContext();
  const tbContext = useContext( ToggleBoxContext );
  const initialInputType = subscribeInfo.info.planName === subscribePlanType.FULL.NAME ? 'checkbox' : 'radio';
  const curIngredient = subscribeInfo.recipe.ingredients;
  const [initialize, setInitialize] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allRecipeInfoList, setAllRecipeInfoList] = useState( []);
  const [selectedCheckbox, setSelectedCheckbox] = useState([]); // * 풀플랜: 최대 2가지 레시피 선택 가능 (Checkbox Input)
  const [selectedRadio, setSelectedRadio] = useState();
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedIdList, setSelectedIdList] = useState( [] );
  
  // console.log(selectedRadio)
  // console.log(selectedCheckbox)
  
  useEffect( () => {
    // INIT RECIPE VALUE
    if(allRecipeInfoList.length) return; // Block code Execution after recipeInfo Initialization.
    
    const recipeIdList = subscribeInfo.recipe.allRecipeIdList;
    (async ()=>{
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: true,
      }));
      try {
  
        const recipeInfoList = [];
        for (const recipeId of recipeIdList) {
          const apiUrl = `/api/recipes/${recipeId}`;
          const res = await getData(apiUrl);
          // console.log(res);
          recipeInfoList.push(res.data);
        }
        setAllRecipeInfoList(recipeInfoList);
        
        const initialValueList = recipeInfoList.filter(info=>subscribeInfo.recipe.idList.indexOf(info.id) >= 0 ).map((info)=>`${info.name}-${info.id}`);
        const initRadioVal = initialValueList[0];
        let initCheckboxObjVal={};
        for (const val of initialValueList) {
          initCheckboxObjVal[val] = true;
        }
        initialInputType === 'radio' ? setSelectedRadio(initRadioVal) : setSelectedCheckbox(initCheckboxObjVal);
        
      } catch (err) {
          console.error(err)
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
    
    
  }, [] );
  
  useEffect(() => {
    if(!selectedCheckbox || typeof selectedCheckbox !== 'object') return;
    let selectedCheckboxCount = 0;
    const keys = Object.keys(selectedCheckbox);
    const seletedIdList = [];
    keys.forEach((key) => {
      const selectedId = allRecipeInfoList.filter(
        (rc, index) => rc.name === `${selectedCheckbox && key.split('-')[0]}`,
      )[0]?.id;
      const val = selectedCheckbox[key];
      val && selectedCheckboxCount++;
      val ? seletedIdList.push(selectedId) : seletedIdList?.filter((id) => id !== selectedId);
    });
    const maxSelectedCheckboxCount = 2;
    if (selectedCheckboxCount > maxSelectedCheckboxCount) {
      onShowModal('풀플랜은 최대 2개 레시피를 선택할 수 있습니다.');
      setInitialize(true);
      setSelectedIdList([]);
    } else {
      setInitialize(false);
      setSelectedIdList(seletedIdList);
    }
    
  }, [selectedCheckbox]);
  
  useEffect(() => {
    if(!selectedRadio)return;
    const selectedId = allRecipeInfoList.filter(
      (rc, index) => rc.name === selectedRadio.toString().split('-')[0])[0]?.id;
    setSelectedIdList(selectedId);
  }, [selectedRadio]);
  
  
  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, { width: 1000, height: 716 });
  };
  
  const onActiveConfirmModal = () => {
    const isTheSameArray = valid_isTheSameArray(selectedIdList, subscribeInfo.recipe.idList)
    if(subscribeInfo.recipe.soldOut) {
      onShowModal('품절된 레시피가 존재합니다.');
    } else if (isTheSameArray) {
      onShowModal('기존과 동일한 레시피입니다.');
    } else {
      setActiveConfirmModal(true);
    }
  };
  
  
  const onChangeRecipe = async (confirm) => {
    if(submitted) return console.error('이미 제출된 양식입니다.');
    if(!confirm){
      return setActiveConfirmModal(false);
    }
    
    
    const curPlan = subscribeInfo.info.planName;
    const body = {
      plan: curPlan,
      nextPaymentPrice: subscribeInfo.price[curPlan].salePrice, // 선택된 플랜의 판매가격
      recipeIdList: selectedIdList,
    };
    
    console.log('body: ',body);
    
    try {
      setIsLoading(true);
      const url = `/api/subscribes/${subscribeInfo.info.subscribeId}/planRecipes`;
      const res = await postObjData(url, body)
      console.log(res);
      if (!res.isDone) {  // ! TEST CODE //
        // if (res.isDone) {  // ! PRODUCT CODE //
        setSubmitted(true);
        onShowModal('레시피 변경이 완료되었습니다.');
      } else {
        onShowModal(`데이터 전송 실패\n${res.error}`);
      }
      setActiveConfirmModal(false);
    } catch (err) {
      console.error('err: ',err);
    }
    setIsLoading(false);
  };
  
  
  
  
  const onShowModal = (message) => {
    if (message) mct.alertShow();
    setModalMessage(message);
  };
  const onHideModal = () => {
    setModalMessage('');
    mct.alertHide();
  };
  
  const onSuccessChangeSubscribeOrder = () => {
    setIsLoading({reload:true});
    onHideModal();
    window.location.reload();
  };
  
  
  return (
    <>
      {isLoading.reload && <FullScreenLoading/>}
      {isLoading.fetching ? <Spinner/> : <section className={s.recipe}>
        <h2 className={s.notice_row_1}>구매하실 레시피 한가지를 선택해 주세요</h2>
        <p className={s.notice_row_2}>
          <em>풀플랜</em>만 두 개의 레시피를 동시 선택할 수 있습니다.
        </p>
        {curIngredient && (
          <div className={s.notice_row_3}>
            <div className={s.color_box}>
              <div className={s.color_box_row_1}>
                <div className={s.picture_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require('public/img/mypage/subscribe/alert_circle.png')}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>
                <span>&nbsp;잠깐!</span>
              </div>
              <div className={s.color_box_row_2}>
                {true && (
                  <>
                    <em>{'TEST, TEST2'}</em>에 못먹는 음식으로 체크해 주셨네요!&nbsp;
                  </>
                )}
                <br />
                <em>{subscribeInfo.recipe.nameList.join(', ')}</em> 레시피에는 <em>&lsquo;{curIngredient}&rsquo;</em>
                {checkStringUnderConsonant(curIngredient) ? '이' : '가'} 들어가 있습니다.
                <br />
                반려견에게 알레르기를 유발할 수 있으니 레시피 선택에 유의해 주시기 바랍니다.
              </div>
            </div>
          </div>
        )}
        <h6 className={'pointColor'}>******SOLD OUT: 1번째 레시피 강제 적용. (테스트 이후 삭제)</h6>
        <Swiper {...swiperSettings} watchOverflow={false}>
          {allRecipeInfoList.length > 0 &&
            allRecipeInfoList.map((rc, index) => (
              <SwiperSlide key={`recipe-${rc.id}-${index}`} className={s.slide}>
                {(() => {
                  // ! TEST
                  if (index === 0) {
                    rc.inStock = false;
                  }
                })()}
                <SubscribeCustomInput
                  id={`${rc.name}-${rc.id}`}
                  selectedRadio={selectedRadio}
                  type={initialInputType}
                  name={'subscribe-recipes'}
                  initialize={initialize}
                  disabled={!rc.inStock}
                  selectedCheckbox={selectedCheckbox}
                  setSelectedCheckbox={setSelectedCheckbox}
                  setSelectedRadio={setSelectedRadio}
                  option={{label:'레시피 선택'}}
                >
                  {/* ! TEST TEST TEST TEST TEST TEST  //  SERVER=> 추천레시피 이름정보 필요함*/}
                  {rc.name === rc.name && (
                    <ItemRecommendlabel
                      label="추천!"
                      style={{
                        backgroundColor: '#000',
                      }}
                    />
                  )}
                  {!rc.inStock && <ItemSoldOutLabel />}
                  <figure className={`${s.image} img-wrap`}>
                    <Image
                      className={'init-next-image'}
                      src={rc.thumbnailUri2}
                      objectFit="cover"
                      layout="fill"
                      alt="레시피 상세 이미지"
                    />
                  </figure>
                  <p className={s.row_1}>{rc.uiNameEnglish}</p>
                  <p className={s.row_2}>{rc.uiNameKorean}</p>
                  <p className={s.row_3}>{rc.description}</p>
                  <p className={s.row_4}>
                    <a href="/recipes" onClick={onPopupHandler}>
                      더 알아보기
                    </a>
                  </p>
                </SubscribeCustomInput>
              </SwiperSlide>
            ))}
        </Swiper>
      </section>}
      <div className={s.btn_box}>
        <button className={s.btn} onClick={onActiveConfirmModal}>{isLoading.submit ? <Spinner style={{color:'#fff'}} /> : '변경 레시피 적용하기'}</button>
      </div>
      {(activeConfirmModal) && (
        <Modal_confirm
          text={`레시피를 변경하시겠습니까?`}
          isConfirm={onChangeRecipe}
          positionCenter
        />
      )}
      {tbContext.visible && <Modal_global_alert
        message={modalMessage}
        onClick={submitted ? onSuccessChangeSubscribeOrder : onHideModal}
        background
      />}
    </>
  );
};