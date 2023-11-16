import ModalWrapper from './ModalWrapper';
import s from './modal_changeItemOrderState.module.scss';
import React, {useEffect, useState, useMemo} from 'react';
import PureCheckbox from '../atoms/PureCheckbox';
import Image from 'next/image';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import CloseButton from '/src/components/atoms/CloseButton';
import Spinner from '/src/components/atoms/Spinner';
import {valid_isTheSameArray} from '/util/func/validation/validationPackage';
import {postObjData} from '/src/pages/api/reqData';
import Modal_global_alert from './Modal_global_alert';
import {orderStatus} from '/store/TYPE/orderStatusTYPE';
import {useModalContext} from '/store/modal-context';
import animateWindow from '/util/func/animateWindow';
import {useRouter} from 'next/router';
import {validation_ReturnableAndExchangeableOrders} from "../../../util/func/validation/validation_ReturnableAndExchangeableOrders";

const allConfirmTypes = [
  {
    type: orderStatus.CONFIRM,
    active: true,
  },
  {
    type: orderStatus.CANCEL_REQUEST,
    active: false,
  },
  {
    type: orderStatus.RETURN_REQUEST,
    active: false,
  },
  {
    type: orderStatus.EXCHANGE_REQUEST,
    active: false,
  }
];


const config = {
  visibleItemCounts: 2,
  targetConfirmType: allConfirmTypes.filter( t => t.active ).map( t => t.type ),
  
}

const buyerFormIdList = ['구매의사 취소 (구매자 귀책)',
  '다른 상품 잘못 주문 (구매자 귀책)',];
const sellerFormIdList = ['택배사의 귀책으로 상품이 훼손됐을 때 (판매자 귀책)',
  '고객이 주문한 제품과 다른 제품이 배송됐을 때 (판매자 귀책)',
  '상품이 파손되었을 때 (판매자 귀책)',];


const buyerReponsibleLabelList = [
  <p className={s.reason} key={'form-label-01'}>
    구매의사 취소&nbsp;<span className={s.responsibility}>(구매자 귀책)</span>
  </p>,
  <p className={s.reason} key={'form-label-02'}>
    다른 상품 잘못 주문&nbsp;<span className={s.responsibility}>(구매자 귀책)</span>
  </p>
];
const sellerReponsibleLabelList = [
  <p className={s.reason} key={'form-label-03'}>
    택배사의 귀책으로 상품이 훼손됐을 때&nbsp;
    <span className={s.responsibility}>(판매자 귀책)</span>
  </p>,
  <p className={s.reason} key={'form-label-04'}>
    고객이 주문한 제품과 다른 제품이 배송됐을 때&nbsp;
    <span className={s.responsibility}>(판매자 귀책)</span>
  </p>,
  <p className={s.reason} key={'form-label-05'}>
    상품이 파손됐을 때&nbsp;<span className={s.responsibility}>(판매자 귀책)</span>
  </p>
];


export const Modal_changeItemOrderState = ({items = [], onHideModal, confirmType, hasForm = true}) => {
  const router = useRouter();
  const mct = useModalContext();
  
  
  
  const orderId = items[0].orderId;
  const allItemsIdList = items.map( (item) => item.orderItemId );
  
  const itemList = useMemo( () => items.map( (item, i) => ({
    orderItemId: item.orderItemId, // 주문한 상품 id
    thumbnailUrl: item.thumbnailUrl,
    selectOptionDtoList: item.selectOptionDtoList,
    itemName: item.itemName,
    amount: item.amount,
    finalPrice: item.finalPrice,
    discountAmount: item.discountAmount,
    status: item.status,
    saveReward: item.saveReward,
  }) ), [] );
  
  let CONFIRM_TYPE;
  let COMFIRM_TYPE_KOR;
  let BUTTON_NAME;
  if ( confirmType === orderStatus.RETURN_REQUEST ) {
    CONFIRM_TYPE = 'return';
    COMFIRM_TYPE_KOR = '반품';
    BUTTON_NAME = '반품신청';
  } else if ( confirmType === orderStatus.EXCHANGE_REQUEST ) {
    CONFIRM_TYPE = 'exchange';
    COMFIRM_TYPE_KOR = '교환';
    BUTTON_NAME = '교환 신청';
  } else if ( confirmType === orderStatus.CONFIRM ) {
    CONFIRM_TYPE = 'confirm';
    COMFIRM_TYPE_KOR = '구매확정';
    BUTTON_NAME = '구매확정';
  } else if ( confirmType === orderStatus.CANCEL_REQUEST ) {
    CONFIRM_TYPE = 'cancelRequest';
    COMFIRM_TYPE_KOR = '취소';
    BUTTON_NAME = '취소요청';
  }
  

  const formLabelList = [...buyerReponsibleLabelList, ...sellerReponsibleLabelList];
  const formIdList = [...buyerFormIdList, ...sellerFormIdList];

  
  const initialFormValues = {
    selectedItemIdList: [], // 주문한 상품orderItem Id List
    reason: formIdList[0],
    detailReason: '',
  };
  
  
  
  
  const [form, setForm] = useState( initialFormValues );
  const [isSubmitted, setIsSubmitted] = useState( false );
  const [isLoading, setIsLoading] = useState( {} );
  const [mounted, setMounted] = useState( false );
  
  useEffect( () => {
    // Block scroll event
    if ( typeof window === 'undefined' ) return;
    
    const Y = window.scrollY || 0;
    document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        width:100%;
        top : -${Y}px;
      `;
    
    setMounted( true );
    return () => {
      animateWindow( Y );
      setMounted( false );
    };
  }, [] );
  
  
  const hideModal = () => {
    onHideModal( null );
  };
  
  const onInputChange = (e) => {
    const {id, value} = e.currentTarget;
    
    setForm( (prevState) => ({
      ...prevState,
      [id]: value,
    }) );
  };
  
  const onSelectItem = (id, checked) => {
    const selectedId = Number( id );
    if ( checked ) {
      setForm( (prevState) => ({
        ...prevState,
        selectedItemIdList: prevState.selectedItemIdList?.concat( selectedId ),
      }) );
    } else {
      setForm( (prevState) => ({
        ...prevState,
        selectedItemIdList: prevState.selectedItemIdList?.filter( (id) => id !== selectedId ),
      }) );
    }
  };
  
  const onSelectAllItems = (checked) => {
    setForm( (prevState) => ({
      ...prevState,
      selectedItemIdList: checked ? allItemsIdList : [],
    }) );
  };
  
  
  
  const onSubmit = async (e) => {
    e.preventDefault();
    if ( isSubmitted ) return console.error( '이미 제출된 양식입니다.' );
    
    ////////////////////////////////////
    // 부분반품 가능할경우 vlalidation (부분반품 => 전체반품 변경 221213)
    // const isPassed = form.selectedItemIdList.length > 0;
    // if ( !isPassed ) {
    //   mct.alertShow( '선택된 항목이 없습니다' );
    //   return;
    // }
    ////////////////////////////////////
    
    const validationTargetTypes = [orderStatus.RETURN_REQUEST, orderStatus.EXCHANGE_REQUEST];
    if ( validationTargetTypes.indexOf( confirmType ) >= 0 ) {
      const result = validation_ReturnableAndExchangeableOrders( items );
      if ( !result.valid ) {
        const message = result.message.join( `\n` );
        return mct.alertShow( message );
      }
    }
    
    
    try {
      setIsLoading( (prevState) => ({
        ...prevState,
        submit: true,
      }) );
      
      let body;
      if ( confirmType === orderStatus.CONFIRM ) {
        body = {
          orderItemIdList: form.selectedItemIdList
        }
      } else {
        body = {
          // orderItemIdList : form.selectedItemIdList, // 부분 반품이 가능했던 CASE
          orderIdList: [orderId], // ! 전체반품 ( 부분 반품 불가) => List로 전달 (221213 변경)
          reason: form.reason,
          detailReason: form.detailReason,
        };
      }
      
      const url = `/api/orders/general/${CONFIRM_TYPE}`;
      // console.log( 'url:', url, 'body: ',body );
      const res = await postObjData( url, body );
      // // console.log(res);
      if ( res.isDone ) {
        // if (!res.isDone) { //  ! TEST TEST
        if ( confirmType === orderStatus.CONFIRM ) {
          mct.alertShow( `구매확정 처리되었습니다.` );
        } else {
          mct.alertShow( `${COMFIRM_TYPE_KOR}신청이 접수되었습니다.` );
          
        }
        
        setIsSubmitted( true );
      } else {
        mct.alertShow( `${COMFIRM_TYPE_KOR}신청에 실패하였습니다.` );
      }
    } catch (err) {
      console.error( '통신에러: ', err );
      mct.alertShow( `데이터 처리 중 오류가 발생했습니다.\n${err}` );
    }
    setIsLoading( (prevState) => ({
      ...prevState,
      submit: false,
    }) );
  };
  
  
  const onOrderCancle = async (e) => {
    e.preventDefault();
    try {
      
      const body = {
        reason: form.reason,
        detailReason: form.detailReason,
      };
      const orderIdx = router.query.orderIdx; // 주문 ID
      const r = await postObjData( `/api/orders/${orderIdx}/general/cancelRequest`, body );
      // console.log( r );
      if ( r.isDone ) {
        mct.alertShow( `취소신청이 접수되었습니다.` );
        setIsSubmitted( true );
      } else {
        mct.alertShow( `취소신청에 실패하였습니다.` );
      }
    } catch (err) {
      console.error( err );
      console.error( '통신에러: ', err );
      mct.alertShow( `데이터 처리 중 오류가 발생했습니다.\n${err}` );
    }
  };
  
  
  const onSuccessSubmitCallback = () => {
    mct.alertHide();
    window.location.reload();
  };
  
  
  return (
    <>
      <ModalWrapper id={s.modal} background positionCenter className={'animation-show'}>
        <section className={s['title-section']}>
          <h2>{COMFIRM_TYPE_KOR}신청</h2>
          <CloseButton onClick={hideModal} className={s['closeButton']}/>
        </section>
        
        <section className={s['body-section']}>
          {/* ! 부분 반품 Ver. (221213 전체반품으로 변경하면서, 삭제*/}
          {config.targetConfirmType.indexOf( confirmType ) >= 0 && (
            <>
              <SelectAllCheckBox
                itemList={{
                  allItemList: allItemsIdList,
                  selectedItemList: form.selectedItemIdList,
                }}
                event={{onSelectAllItems: onSelectAllItems}}
                option={{title: `${COMFIRM_TYPE_KOR} 가능 상품(${itemList.length})`}}
              />
              <ul className={`${s['item-list']} modal-item-list-wrap ${itemList.length > config.visibleItemCounts ? s.overflowScroll : ''}`}>
                {itemList.length > 0 &&
                  itemList.map( (item, i) => {
                    // return <ReturnOrChangeItem key={`returnOrChangeItem-${i}`} item={item}/>
                    return <SelectableReturnOrChangeItem key={`returnOrChangeItem-${i}`} item={item} onSelectItem={onSelectItem} selectedItemIdList={form.selectedItemIdList}/>
                  } )}
              
              </ul>
            </>
          )}
          {hasForm && (
            <div className={s.form}>
              <h6 className={s.title}>{COMFIRM_TYPE_KOR}사유를 선택해주세요.</h6>
              <CustomRadio
                name="reason"
                className={s['radio-input-wrap']}
                idList={formIdList}
                labelList={formLabelList}
                value={form.reason}
                setValue={setForm}
                getDirValue={false}
              />
              <div className={s['detailReason']}>
                <textarea
                  id={'detailReason'}
                  name="detailReason"
                  placeholder={'상세사유를 입력해주세요.'}
                  value={form.detailReason}
                  onChange={onInputChange}
                ></textarea>
              </div>
            </div>
          )}
        </section>
        <section className={s['btn-section']}>
          <button type={'button'} className={`${s['cancle']}`} onClick={hideModal}>
            취소
          </button>
          <button type={'button'} className={`${s['confirm']}`} onClick={confirmType === orderStatus.CANCEL_REQUEST ? onOrderCancle : onSubmit}>
            {isLoading.submit ? <Spinner style={{color: '#fff'}}/> : `${BUTTON_NAME}`}
          </button>
        </section>
      </ModalWrapper>
      {mounted && <Modal_global_alert onClick={isSubmitted && onSuccessSubmitCallback}/>}
    </>
  );
};


const ReturnOrChangeItem = ({item}) => {
  return (<li className={s.item}>
    <div className={`${s.col} ${s.info}`}>
      <figure className={s.image}>
        {item.thumbnailUrl && (
          <Image
            src={item.thumbnailUrl}
            objectFit="cover"
            layout="fill"
            alt="레시피 이미지"
          />
        )}
      </figure>
      <figcaption className={s.desc}>
        <p className={s['item-title']}>{item.itemName}</p>
        {item.selectOptionDtoList.length > 0 &&
          item.selectOptionDtoList.map( (op, i) => (
            <p key={`item-option-${i}`} className={s['option-title']}>
              {op.optionName}&nbsp;({op.optionAmount}개)
            </p>
          ) )}
      </figcaption>
    </div>
    <div className={`${s.col} ${s.amount}`}>
      <span>{item.amount}개</span>
    </div>
  </li>)
};


const SelectableReturnOrChangeItem = ({item, onSelectItem, selectedItemIdList}) => {
  return (<li className={`${s.item} ${s.selectable}`}>
    <div className={`${s.col} ${s.checkbox}`}>
      <PureCheckbox
        onClick={onSelectItem}
        id={item.orderItemId}
        value={selectedItemIdList?.indexOf( item.orderItemId ) >= 0 || ''}
      />
    </div>
    <div className={`${s.col} ${s.info}`}>
      <figure className={s.image}>
        {item.thumbnailUrl && (
          <Image
            src={item.thumbnailUrl}
            objectFit="cover"
            layout="fill"
            alt="레시피 이미지"
          />
        )}
      </figure>
      <figcaption className={s.desc}>
        <p className={s['item-title']}>{item.itemName}</p>
        {item.selectOptionDtoList.length > 0 &&
          item.selectOptionDtoList.map( (op, i) => (
            <p key={`item-option-${i}`} className={s['option-title']}>
              {op.optionName}&nbsp;({op.optionAmount}개)
            </p>
          ) )}
      </figcaption>
    </div>
    <div className={`${s.col} ${s.amount}`}>
      <span>{item.amount}개</span>
    </div>
  </li>)
};


const SelectAllCheckBox = ({
                             itemList = {
                               allItemList: [],
                               selectedItemList: [],
                             },
                             event = {onSelectAllItems},
                             option = {title},
                           }) => {
  return (
    <div className={s.top}>
      <span className={s.text}>{option.title}</span>
      <PureCheckbox
        eventHandler={event.onSelectAllItems}
        value={valid_isTheSameArray( itemList.allItemList, itemList.selectedItemList ) || ''}
      >
        전체 선택
      </PureCheckbox>
    </div>
  );
};