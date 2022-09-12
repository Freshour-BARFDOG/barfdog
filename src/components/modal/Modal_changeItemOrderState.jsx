import ModalWrapper from './ModalWrapper';
import s from './modal_changeItemOrderState.module.scss';
import React, { useEffect, useState } from 'react';
import PureCheckbox from '../atoms/PureCheckbox';
import Image from 'next/image';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import CloseButton from '/src/components/atoms/CloseButton';
import Spinner from '/src/components/atoms/Spinner';
import { valid_isTheSameArray } from '/util/func/validation/validationPackage';
import { postObjData } from '/src/pages/api/reqData';
import Modal_global_alert from './Modal_global_alert';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { useModalContext } from '/store/modal-context';
import animateWindow from '/util/func/animateWindow';
import { useRouter } from 'next/router';

export const Modal_changeItemOrderState = ({ items = [], onHideModal, confirmType, hasForm = true }) => {
  const router = useRouter();
  
  const itemList = items.map((item, i) => ({
    orderItemId: item.orderItemId, // 주문한 상품 id
    thumbnailUrl: item.thumbnailUrl,
    selectOptionDtoList: item.selectOptionDtoList,
    itemName: item.itemName,
    amount: item.amount,
    finalPrice: item.finalPrice,
    discountAmount: item.discountAmount,
    status: item.status,
    saveReward: item.saveReward,
  }));

  let CONFIRM_TYPE;
  let COMFIRM_TYPE_KOR;
  let BUTTON_NAME;
  if (confirmType === orderStatus.RETURN_REQUEST) {
    CONFIRM_TYPE = 'return';
    COMFIRM_TYPE_KOR = '반품';
    BUTTON_NAME = '반품신청';
  } else if (confirmType === orderStatus.EXCHANGE_REQUEST) {
    CONFIRM_TYPE = 'exchange';
    COMFIRM_TYPE_KOR = '교환';
    BUTTON_NAME = '교환 신청';
  } else if (confirmType === orderStatus.CONFIRM) {
    CONFIRM_TYPE = 'confirm';
    COMFIRM_TYPE_KOR = '구매확정';
    BUTTON_NAME = '구매확정';
  } else if (confirmType === orderStatus.CANCEL_REQUEST) {
    CONFIRM_TYPE = 'cancel';
    COMFIRM_TYPE_KOR = '취소';
    BUTTON_NAME = '취소요청';
  }

  const formIdList = [
    '구매의사 취소 (구매자 귀책)',
    '다른 상품 잘못 주문 (구매자 귀책)',
    '택배사의 귀책으로 상품이 훼손됐을 때 (판매자 귀책)',
    '고객이 주문한 제품과 다른 제품이 배송됐을 때 (판매자 귀책)',
    '상품이 파손되었을 때 (판매자 귀책)',
  ];
  const formLabelList = [
    <p className={s.reason} key={'form-label-01'}>
      구매의사 취소&nbsp;<span className={s.responsibility}>(구매자 귀책)</span>
    </p>,
    <p className={s.reason} key={'form-label-02'}>
      다른 상품 잘못 주문&nbsp;<span className={s.responsibility}>(구매자 귀책)</span>
    </p>,
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
    </p>,
  ];

  const initialFormValues = {
    selectedItemIdList: [], // 주문한 상품orderItem Id List
    reason: formIdList[0],
    detailReason: '',
  };

  const allItemsIdList = items.map((item) => item.orderItemId);
  const mct = useModalContext();
  const [form, setForm] = useState(initialFormValues);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const Y = window.scrollY || 0;
    document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        width:100%;
        top : -${Y}px;
      `;

    // const blockScroll = new BlockScroll();
    // blockScroll.disableScroll();

    setMounted(true);
    return () => {
      animateWindow(Y);
      setMounted(false);
    };
  }, []);

  const hideModal = () => {
    onHideModal(null);
  };

  const onInputChange = (e) => {
    const { id, value } = e.currentTarget;

    setForm((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const onSelectItem = (id, checked) => {
    const selectedId = Number(id);
    if (checked) {
      setForm((prevState) => ({
        ...prevState,
        selectedItemIdList: prevState.selectedItemIdList?.concat(selectedId),
      }));
    } else {
      setForm((prevState) => ({
        ...prevState,
        selectedItemIdList: prevState.selectedItemIdList?.filter((id) => id !== selectedId),
      }));
    }
  };

  const onSelectAllItems = (checked) => {
    setForm((prevState) => ({
      ...prevState,
      selectedItemIdList: checked ? allItemsIdList : [],
    }));
  };
  
  
  
  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');
    const isPassed = form.selectedItemIdList.length > 0;
    if (!isPassed) {
      mct.alertShow('선택된 항목이 없습니다');
      return;
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));

      let body = {
        orderItemIdList: form.selectedItemIdList,
        reason: form.reason,
        detailReason: form.detailReason,
      };

      console.log(body);
      const url = `/api/orders/general/${CONFIRM_TYPE}`;
      const res = await postObjData(url, body);
      // console.log(res);
      if (res.isDone) {
        // if (!res.isDone) { //  ! TEST TEST
        mct.alertShow(`${COMFIRM_TYPE_KOR}신청이 접수되었습니다.`);
        setIsSubmitted(true);
      } else {
        mct.alertShow(`${COMFIRM_TYPE_KOR}신청에 실패하였습니다.`);
      }
    } catch (err) {
      console.error('통신에러: ', err);
      mct.alertShow(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };
  
  
  const onOrderCancle = async (e) => {
    e.preventDefault();
    try {
      
      const body = {
        reason: form.reason,
        detailReason: form.detailReason,
      };
      const orderIdx = router.query.orderIdx; // 주문 ID
      const r = await postObjData(`/api/orders/${orderIdx}/general/cancelRequest`, body);
      console.log(r);
      if (r.isDone) {
        mct.alertShow(`${COMFIRM_TYPE_KOR}신청이 접수되었습니다.`);
        setIsSubmitted(true);
      } else {
        mct.alertShow(`${COMFIRM_TYPE_KOR}신청에 실패하였습니다.`);
      }
    } catch (err) {
      console.error(err);
      console.error('통신에러: ', err);
      mct.alertShow(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
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
          <CloseButton onClick={hideModal} className={s['closeButton']} />
        </section>

        <section className={s['body-section']}>
          {confirmType !== orderStatus.CANCEL_REQUEST && (
            <>
              <SelectAllCheckBox
                itemList={{
                  allItemList: allItemsIdList,
                  selectedItemList: form.selectedItemIdList,
                }}
                event={{ onSelectAllItems: onSelectAllItems }}
                option={{ title: `${COMFIRM_TYPE_KOR} 가능 상품(${itemList.length})` }}
              />
              <ul className={`${s['item-list']} modal-item-list-wrap`}>
                {itemList.length > 0 &&
                  itemList.map((item, i) => (
                    <li key={`ordered-item-${i}`} className={s.item}>
                      <div className={`${s.col} ${s.checkbox}`}>
                        <PureCheckbox
                          onClick={onSelectItem}
                          id={item.orderItemId}
                          value={form.selectedItemIdList.indexOf(item.orderItemId) >= 0 || ''}
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
                            item.selectOptionDtoList.map((op, i) => (
                              <p key={`item-option-${i}`} className={s['option-title']}>
                                {op.optionName}&nbsp;({op.optionAmount}개)
                              </p>
                            ))}
                        </figcaption>
                      </div>
                      <div className={`${s.col} ${s.amount}`}>
                        <span>3개</span>
                      </div>
                    </li>
                  ))}
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
            {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : `${BUTTON_NAME}`}
          </button>
        </section>
      </ModalWrapper>
      {mounted && <Modal_global_alert onClick={isSubmitted && onSuccessSubmitCallback} />}
    </>
  );
};

const SelectAllCheckBox = ({
  itemList = {
    allItemList: [],
    selectedItemList: [],
  },
  event = { onSelectAllItems },
  option = { title },
}) => {
  return (
    <div className={s.top}>
      <span className={s.text}>{option.title}</span>
      {/*<span className={s.text}>{COMFIRM_TYPE_KOR}할 상품을 선택해주세요.</span>*/}
      <PureCheckbox
        eventHandler={event.onSelectAllItems}
        value={valid_isTheSameArray(itemList.allItemList, itemList.selectedItemList) || ''}
      >
        전체 선택
      </PureCheckbox>
    </div>
  );
};
