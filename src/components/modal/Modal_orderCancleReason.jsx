import ModalWrapper from './ModalWrapper';
import s from './modal_orderCancelReason.module.scss';
import CloseButton from '../atoms/CloseButton';
import React, { useEffect, useState } from 'react';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import { getData } from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import { productType } from '/store/TYPE/itemType';

export const Modal_orderCancleReason = ({
  id,
  orderType,
  setActiveModal,
  onConfirm,
  selectedItemData,
}) => {
  const [allData, setAllData] = useState(selectedItemData);
  const [selectedIdList, setSelectedIdList] = useState([]);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState({});

  useEffect(() => {
    if (orderType !== productType.GENERAL) return; // 일반상품일 경우, orderItemIdList조회를 위해서만 사용함
    try {
      (async () => {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        for (const item of selectedItemData) {
          const orderId = item.id;
          const url = `/api/admin/orders/${orderId}/${orderType.toLowerCase()}`;
          const res = await getData(url);
          if (res.status === 200) {
            const data = res.data;
            const orderItemInfoList = data.orderItemAndOptionDtoList.map((l) => l.orderItemDto);
            setAllData((prevDataList) =>
              prevDataList.map((data) =>
                data.id === orderId ? { ...data, orderItemInfoList } : data,
              ),
            );
          }
        }
      })();
    } catch (err) {
      console.error(err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      fetching: false,
    }));
  }, [selectedItemData]);


  const onHideModal = () => {
    setActiveModal({
      [id]: false,
    });
  };

  const onConfirmHandler = () => {
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm(reason, selectedIdList);
    }
  };

  const onInputChange = (e) => {
    const { value } = e.currentTarget;
    setReason(value);
  };
  

  const onClickCheckbox = (id, checked) => {
    // console.log(id, checked);
    const seletedId = Number(id.split('-')[1]);
    // console.log(seletedId);
    if (checked) {
      setSelectedIdList((prevState) => prevState.concat(seletedId));
    } else {
      setSelectedIdList((prevState) => prevState.filter((id) => id !== seletedId));
    }
  };
  
  // console.log(allData);
  return (
    <ModalWrapper id={s['modal-cancle']} background positionCenter>
      <CloseButton onClick={onHideModal} className={s['close-button']} />
      <section className={s['title-section']}>
        <h4 className={s.title}>판매취소</h4>
        <span className={s.subtitle}>
          판매사유가 입력된 상품이 포함된 주문은 전체주문취소가 됩니다.
          <br />
          판매취소사유는 체크박스 설정된 상품에 동일하게 적용되며, 현재 보이는 모달에서 체크된
          상품이 판매취소처리됩니다.
        </span>
      </section>
      {isLoading.fetching ? (
        <AmdinErrorMessage>
          <Spinner />
        </AmdinErrorMessage>
      ) : (
        <section className={s['body-section']}>
          <ul className={s['item-wrap']}>
            {allData.map((data, i) => (
              <li key={`item-to-be-canceled-${data.id}-${i}`}>
                {orderType === productType.GENERAL && (
                  <>
                    <h5 className={s.itemTitle}>주문번호: {data.merchantUid}</h5>
                    <div className={s.itemList}>
                      {data.orderItemInfoList?.length > 0 &&
                        data.orderItemInfoList.map((orderIteminfo, i) => (
                          <div key={`${orderIteminfo.orderItemId}-${i}`}>
                            <PureCheckbox
                              id={`orderItemId-${orderIteminfo.orderItemId}`}
                              onClick={onClickCheckbox}
                            >
                              (상품번호: {orderIteminfo.orderItemId}) 상품명:{' '}
                              {orderIteminfo.itemName}
                            </PureCheckbox>
                          </div>
                        ))}
                    </div>
                  </>
                )}

                {orderType === productType.SUBSCRIBE && (
                  <PureCheckbox id={`orderId-${data.id}`} onClick={onClickCheckbox}>
                    <p>주문ID: {data.merchantUid}</p>
                  </PureCheckbox>
                )}
              </li>
            ))}
          </ul>

          <div className={s['input-wrap']}>
            <h4 className={s['input-title']}>판매 취소사유</h4>
            <textarea
              type={'text'}
              placeholder={'판매 취소사유를 입력해주세요.'}
              onChange={onInputChange}
            />
          </div>
        </section>
      )}

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
