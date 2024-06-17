import React, { useState } from 'react';
import s from '../coupon.module.scss';
import Spinner from '/src/components/atoms/Spinner';
import transformDate from '/util/func/transformDate';

export default function CouponList({
  items,
  currentPage,
  onEditItem,
  isLoading,
}) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, i) => (
        <ItemList
          key={`item-${item.id}-${i}`}
          number={i + 1 + (currentPage - 1) * 10}
          item={item}
          onEditItem={onEditItem}
          isLoading={isLoading}
        />
      ))}
    </ul>
  );
}

const ItemList = ({ item, number, onEditItem, isLoading }) => {
  const [formValues, setFormValues] = useState({});
  const [tempValues, setTempValues] = useState({
    expiredDate: transformDate(item.expiredDate),
    memberCouponStatus: item.couponStatus,
    remaining: item.remaining,
  });

  // console.log('item>>>', item);

  const DATA = {
    id: item.id,
    number,
    memberName: item.memberName,
    memberEmail: item.memberEmail,
    couponName: item.couponName,
    memberCouponStatus:
      item.memberCouponStatus === 'ACTIVE'
        ? '활성'
        : item.memberCouponStatus === 'INACTIVE'
        ? '비활성'
        : item.memberCouponStatus,
    remaining: item.remaining,
    code: item.code || '-',
    createdDate: transformDate(item.createdDate) || '-',
    expiredDate: transformDate(item.expiredDate) || '-',
    apiurl: {
      edit: `/api/admin/coupons/memberCoupon/${item.id}`,
    },
  };

  const onInputChange = (e) => {
    const { id, value } = e.currentTarget;
    setTempValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // 내일 날짜를 계산
  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형식으로 변환
  };

  const onEditHandler = (e) => {
    if (!confirm(`선택된 쿠폰(${DATA.memberName})을 수정하시겠습니까?`)) return;
    const apiUrl = e.currentTarget.dataset.apiUrl;
    onEditItem(apiUrl, DATA.id, tempValues);
  };

  return (
    <li className={s.item} key={`item-${DATA.id}`}>
      <span>{DATA.number}</span>
      <span>{DATA.memberName}</span>
      <span>{DATA.memberEmail}</span>
      <span>{DATA.couponName}</span>
      <span className={s.select_wrapper}>
        <select
          id="memberCouponStatus"
          value={tempValues.memberCouponStatus || DATA.memberCouponStatus}
          onChange={onInputChange}
        >
          <option value="ACTIVE">활성</option>
          <option value="INACTIVE">비활성</option>
        </select>
      </span>
      <span>{DATA.code}</span>
      <span className={s.input_wrapper}>
        <input
          type="number"
          id="remaining"
          value={tempValues.remaining || DATA.remaining}
          onChange={onInputChange}
          min={0}
        />
      </span>
      <span>{DATA.createdDate}</span>
      <span>
        <input
          id="expiredDate"
          type="date"
          value={tempValues.expiredDate || DATA.expiredDate}
          onChange={onInputChange}
          min={getTomorrowDate()} // 내일 날짜부터 설정가능
        />
      </span>
      <span>
        <button
          className="admin_btn basic_s solid"
          onClick={onEditHandler}
          data-api-url={DATA.apiurl.edit}
        >
          {isLoading?.edit && isLoading.edit[DATA.id] ? (
            <Spinner style={{ color: 'white' }} />
          ) : (
            '수정'
          )}
        </button>
      </span>
    </li>
  );
};
