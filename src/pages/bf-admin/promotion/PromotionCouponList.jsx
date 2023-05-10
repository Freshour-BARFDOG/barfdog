import React, {useState} from "react";
import s from "./promotion.module.scss";
import transformDate from "/util/func/transformDate";
import ThreeDots from "/public/img/icon/threeDots.svg";
import {promotionStatusType} from "/store/TYPE/promotionStatusType";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import Spinner from "../../../components/atoms/Spinner";
import {Modal_moreView} from "../../../components/modal/Modal_moreView";
import {getHTMLElementInfo} from "/util/func/HTML/getHTMLElementInfo";
import {useModalContext} from "/store/modal-context";


export default function PromotionCouponList({
                                              items,
                                              onDelete,
                                              isLoading
                                            }) {
  if (!items || !items.length) return;

  const mct = useModalContext();
  const [submitted, setSubmitted] = useState(false);
  const [modalState, setModalState] = useState({
    id: null,
    active: false,
  });

  const onDeleteHandler = () => {
    if (submitted) return console.error("이미 제출된 양식입니다.");
    const targetItem = items.filter(item => item.id === modalState.id)[0];
    if(targetItem.status !== promotionStatusType.INACTIVE) return mct.alertShow(`프로모션 [${promotionStatusType.KOR.INACTIVE}] 상태에서만 삭제할 수 있습니다.`);
    if (!confirm(`선택된 프로모션을 삭제하시겠습니까? \n- 삭제 대상: ${targetItem.name}`)) return;
    onDelete(modalState.url.delete, modalState.id);
    setSubmitted(true);
  };



  const onModalHandler = (id, e) => {

    const elem = getHTMLElementInfo(e.currentTarget);

    setModalState(prev => ({
      ...prev,
      id: id !== modalState.id ? id : null,
      active: id !== modalState.id,
      pos: {
        x: elem.x + elem.width,
        y: elem.y,
      },
      url: {
        edit: `/bf-admin/promotion/${id}/update`,
        detail: `/bf-admin/popup/promotion/${id}`,
        delete: `/bf-admin/promotion/${id}/delete`,
      },
    }));
  };

  return <div>
    <ul className="table_body">
      {items.map((item, i) => (
        <ItemList
          key={`item-${item.id}-${i}`}
          item={item}
          isLoading={isLoading}
          onActiveModal={onModalHandler}
        />
      ))}
    </ul>
    {modalState.active &&
      <Modal_moreView
        data={{
          id: modalState.id,
          pos: {x: modalState.pos.x, y: modalState.pos.y}
        }}
        url={modalState.url}
        onDelete={onDeleteHandler}
      />}
  </div>;
}

function ItemList({item, isLoading, onActiveModal}) {

  const DATA = {
    id: item.id,
    type: item.type,
    status: item.status,
    name: item.name,
    startDate: transformDate(item.startDate, "time", {seperator: "/"}),
    expiredDate: transformDate(item.expiredDate, "time", {seperator: "/"}),
    coupon: {
      id: item.coupon.couponId,
      used: item.coupon.used,
      remaining: item.coupon.remaining,
      quantity: item.coupon.quantity,
      code: item.coupon.code,
      name: item.coupon.name,
      couponTarget: item.coupon.couponTarget,
      discount: item.coupon.discount,
      availableMinPrice: transformLocalCurrency(item.coupon.availableMaxDiscount),
      availableMaxDiscount: transformLocalCurrency(item.coupon.availableMaxDiscount),
      amount: item.coupon.amount,
    }
  };

  return (
    <li className={s.item} key={`item-${DATA.id}`}>
      <span className={s.moreview} onClick={onActiveModal.bind(null, DATA.id)}>
        {(isLoading?.delete && isLoading.delete[DATA.id])
          ? <Spinner/>
          : <ThreeDots/>}
      </span>
      <span className={`${s.status} ${
        DATA.status === promotionStatusType.ACTIVE ? s.active
          : DATA.status === promotionStatusType.PAUSED ? s.paused
            : s.inactive
      }`}>{promotionStatusType.KOR[DATA.status]}</span>
      <span>{DATA.name}</span>
      <span className={s.period}>
        <em>{DATA.startDate}</em>
        <em>~ {DATA.expiredDate}</em>
      </span>
      <span>
        {DATA.coupon.used}
        <i className={s.seperator}>/</i>
        {DATA.coupon.remaining}
        <i className={s.seperator}>/</i>
        {DATA.coupon.quantity}
      </span>
      <span className={s.couponInfo}>
        <em>
          {DATA.coupon.code}
          <i className={s.seperator}>/</i>
          {DATA.coupon.name}
        </em>
        <em className={s.detail}>
          {DATA.coupon.couponTarget}
          <i className={s.seperator}>/</i>
          {DATA.coupon.discount} 할인
          ({DATA.coupon.availableMinPrice}원 이상 구매 시
          <i className={s.seperator}>/</i>
          최대 {DATA.coupon.availableMaxDiscount}원)
          <i className={s.seperator}>/</i>
          {DATA.coupon.amount}회
        </em>
      </span>
    </li>
  );
}
