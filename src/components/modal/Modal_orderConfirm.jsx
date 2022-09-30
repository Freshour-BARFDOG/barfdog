import ModalWrapper from './ModalWrapper';
import s from './modal_orderCancelReason.module.scss';
import CloseButton from '../atoms/CloseButton';
import React, { useEffect, useState } from 'react';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import { getData } from '/src/pages/api/reqData';
import Spinner from "/src/components/atoms/Spinner";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import {productType} from "/store/TYPE/itemType";

export const Modal_orderConfirm = ({
  id,
  orderType,
  setActiveModal,
  onConfirm,
  selectedItemData,
  modaltype,
}) => {
  const [allData, setAllData] = useState(selectedItemData);
  const [selectedIdList, setSelectedIdList] = useState([]);
  const [isLoading, setIsLoading] = useState({});

  useEffect(() => {
    if(orderType !== productType.GENERAL) return; // 일반상품일 경우, orderItemIdList조회를 위해서만 사용함
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

  // console.log(allData);

  const onHideModal = () => {
    setActiveModal({
      [id]: false,
    });
  };

  const onConfirmHandler = () => {
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm(selectedIdList);
    }
  };

  const onClickCheckbox = (id, checked) => {
    const seletedId = Number(id.split('-')[1]); // 체크박스 클릭 시, 일반상품일 경우, orderItemId, 구독상품일 경우 orderId가 selectedId값으로 할당됨
    if (checked) {
      setSelectedIdList((prevState) => prevState.concat(seletedId));
    } else {
      setSelectedIdList((prevState) => prevState.filter((id) => id !== seletedId));
    }
  };

  // console.log(selectedIdList)
  // ! 영한씨 > 판매취소 로직 확인 > 이후에 작업 진행
  // ! 한 주문 내에 상품에 대한 각각의 id가 필요할 경우,

  // console.log(allData);
  return (
    <ModalWrapper id={s['modal-cancle']} background positionCenter>
      <CloseButton onClick={onHideModal} className={s['close-button']} />
      <section className={s['title-section']}>
        <h4 className={s.title}>주문확인</h4>
      </section>
      {isLoading.fetching ? <AmdinErrorMessage><Spinner/></AmdinErrorMessage> : <section className={s['body-section']}>
        <ul className={s['item-wrap']}>
          {allData.map((data, i) => (
            <li key={`item-to-be-confirmed-${data.id}-${i}`}>
              {orderType === productType.GENERAL && <><h5 className={s.itemTitle}>주문ID: {data.id}</h5>
                <div className={s.itemList}>
                  {data.orderItemInfoList?.length > 0 &&
                    data.orderItemInfoList.map((orderIteminfo, i) => (
                      <div key={`${orderIteminfo.orderItemId}-${i}`}>
                        <PureCheckbox
                          id={`orderItemId-${orderIteminfo.orderItemId}`}
                          onClick={onClickCheckbox}
                        >
                          (상품번호: {orderIteminfo.orderItemId}) 상품명: {orderIteminfo.itemName}
                        </PureCheckbox>
                      </div>
                    ))}
                </div></>}
              {orderType === productType.SUBSCRIBE &&
                (<PureCheckbox
                id={`orderId-${data.id}`}
                onClick={onClickCheckbox}
                >
                  <p>주문ID: {data.id}</p>
                </PureCheckbox>)}
            </li>
          ))}
        </ul>
      </section>}
      
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
