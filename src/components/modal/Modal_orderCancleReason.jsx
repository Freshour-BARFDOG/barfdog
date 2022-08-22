import ModalWrapper from './ModalWrapper';
import s from './modal_orderCancelReason.module.scss';
import CloseButton from '../atoms/CloseButton';
import React, {useState} from 'react';
import Tooltip from "../atoms/Tooltip";
import PureCheckbox from "../atoms/PureCheckbox";

export const Modal_orderCancleReason = ({ id, setActiveModal, onConfirm, selectedItemData }) => {
  const [selectedIdList, setSelectedIdList] = useState( [] );
  const [reason, setReason] = useState( '' );
  const onHideModal = () => {
    setActiveModal({
      [id]: false,
    });
  };
  
  const onConfirmHandler = ()=>{
    if(onConfirm && typeof onConfirm === 'function'){
      onConfirm(reason, selectedIdList);
    }
    
  }
  
  const onInputChange = (e)=>{
    const {value} = e.currentTarget;
    setReason(value);
  }
  // console.log(selectedItemData);
  
  const onClickCheckbox =(id, checked)=>{
    console.log(id, checked);
    const seletedId = Number(id.split('-')[1]);
    console.log(seletedId);
    if (checked) {
      setSelectedIdList((prevState) => prevState.concat(seletedId));
    } else {
      setSelectedIdList((prevState) => prevState.filter((id) => id !== seletedId));
    }
   
  }
  
  // console.log(selectedIdList)
  // ! 영한씨 > 판매취소 로직 확인 > 이후에 작업 진행
  // ! 한 주문 내에 상품에 대한 각각의 id가 필요할 경우,
  
  return (
    <ModalWrapper id={s['modal-cancle']} background positionCenter>
      <CloseButton onClick={onHideModal} className={s['close-button']} />
      <section className={s['title-section']}>
        <h4 className={s.title}>판매취소</h4>
        <span className={s.subtitle}>
          판매사유가 입력된 상품이 포함된 주문은 전체주문취소가 됩니다. 판매취소사유는 체크박스
          설정된 상품에 동일하게 적용되며, 현재 보이는 모달에서 체크된 상품이 판매취소처리됩니다.
        </span>
      </section>
      <section className={s['body-section']}>
        <ul className={s['item-wrap']}>
          {selectedItemData.map((data,i) => (
            <li key={`item-${data.id}-${i}`}>
              <h5 className={s.itemTitle}>주문ID: {data.id}</h5>
              <div className={s.itemList}>
                <PureCheckbox id={`toBeCancledItemId-${data.id}`} onClick={onClickCheckbox}>주문-{data.id} 상품이름{i}</PureCheckbox>
              </div>
            </li>
          ))}
        </ul>
        
        <div className={s['input-wrap']}>
          <h4 className={s['input-title']}>판매 취소사유</h4>
          <input type={'text'} placeholder={'판매 취소사유를 입력해주세요.'} onChange={onInputChange} />
        </div>
      </section>
      <section className={s['btn-section']}>
        <button type={'button'} className={'admin_btn line popup'} onClick={onHideModal}>
          취소
        </button>
        <button type={'button'} className={'admin_btn solid popup'} onClick={onConfirmHandler}>
          확인
        </button>
      </section>
    </ModalWrapper>
  );
};
