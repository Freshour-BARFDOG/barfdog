import React, {useState} from "react";
import s from "./promotion.module.scss";
import transformDate from "/util/func/transformDate";
import ThreeDots from "/public/img/icon/threeDots.svg";
import {promotionStatusType} from "/store/TYPE/promotionStatusType";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import Spinner from "../../atoms/Spinner";
import {Modal_moreView} from "../../modal/Modal_moreView";
import {getHTMLElementInfo} from "/util/func/HTML/getHTMLElementInfo";
import {useModalContext} from "/store/modal-context";
import popupWindow from "/util/func/popupWindow";
import {PromotionStatus} from "./PromotionStatus";
import {discountUnitType} from "/store/TYPE/discountUnitType";
import {couponUseType} from "/store/TYPE/couponType";


export default function PromotionCouponList({
                                              items,
                                              onDelete,
                                              isLoading
                                            }) {

  const mct = useModalContext();
  const [submitted, setSubmitted] = useState(false);
  const [modalState, setModalState] = useState({
    id: null,
    active: false,
  });

  if (!items || !items.length) return;

  const onDeleteHandler = () => {
    if (submitted) return console.error("이미 제출된 양식입니다.");
    const targetItemObj = items.filter(item => item.promotionDto.promotionId === modalState.id)[0];
    const targetItem = targetItemObj?.promotionDto;
    if(!targetItem){
      alert("프로모션 정보를 확인 중 오류가 발생하였습니다.")
    }
    if(targetItem.status !== promotionStatusType.INACTIVE) return mct.alertShow(`프로모션 [${promotionStatusType.KOR.INACTIVE}] 상태에서만 삭제할 수 있습니다.`);
    if (!confirm(`선택된 프로모션을 삭제하시겠습니까? \n- 삭제 대상: ${targetItem.name}`)) return;
    onDelete(modalState.url.delete, modalState.id);
    setSubmitted(true);
  };


  const onPopupHandler = (href) => {
    if(typeof window === 'undefined') return;
    popupWindow(href, {width:900, height:900});
  }


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
        edit: `/bf-admin/promotion/${id}/update`, // Client PATH
        detail: `/bf-admin/popup/promotion/${id}`, // Client PATH
        delete: `/api/admin/promotions/${id}/delete`, // SERVER API
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
        onPopup= {onPopupHandler}
      />}
  </div>;
}

function ItemList({item, isLoading, onActiveModal}) {

  const promotion = item.promotionDto;
  const coupon = item.promotionCouponDto;


  const DATA = {
    id: promotion.promotionId,
    type: promotion.type,
    status: promotion.status,
    name: promotion.name,
    startDate: transformDate(promotion.startDate, "time", {seperator: "/"}),
    expiredDate: transformDate(promotion.expiredDate, "time", {seperator: "/"}),
    coupon: {
      id: coupon.promotionCouponId,
      quantity: coupon.quantity,
      remaining: coupon.remaining,
      published: coupon.quantity - coupon.remaining,
      used: coupon.usedCount,
      code: coupon.code,
      name: coupon.name,
      couponTarget: couponUseType.KOR[coupon.couponTarget],
      discount: `${transformLocalCurrency(coupon.discountDegree)}${discountUnitType.KOR[coupon.discountType]}`,
      availableMinPrice: transformLocalCurrency(coupon.availableMaxDiscount),
      availableMaxDiscount: transformLocalCurrency(coupon.availableMaxDiscount),
      amount: transformLocalCurrency(coupon.amount),
    }
  };

  return (
    <li className={s.item} key={`item-${DATA.id}`}>
      <span className={s.moreview} onClick={onActiveModal.bind(null, DATA.id)}>
        {(isLoading?.delete && isLoading.delete[DATA.id])
          ? <Spinner/>
          : <ThreeDots/>}
      </span>
      <PromotionStatus status={DATA.status}/>
      <span>{DATA.name}</span>
      <span>
        {DATA.coupon.used}
        <i className={s.seperator}>/</i>
        {DATA.coupon.published}
        <i className={s.seperator}>/</i>
        {DATA.coupon.quantity}
      </span>
      <span className={s.period}>
        <em>{DATA.startDate}</em>
        <em>~ {DATA.expiredDate}</em>
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
        </em>
        <em className={s.detail}>
          한도: {DATA.coupon.amount}회
        </em>
      </span>
    </li>
  );
}
