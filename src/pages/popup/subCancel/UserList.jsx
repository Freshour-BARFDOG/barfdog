import React from 'react';
import s from './subCancel.module.scss';
import popupWindow from '/util/func/popupWindow';
import transformLocalCurrency from '/util/func/transformLocalCurrency';

export default function UserList({
  items,
  selectedItems,
  setSelectedItems,
  currentPage,
}) {
  if (!items || !items.length) return;
  return (
    <ul className={s.table_body}>
      {items.map((item, index) => (
        <Item
          key={`item-${item.id}-${index}`}
          item={item}
          number={index + 1 + (currentPage - 1) * 10}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
        />
      ))}
    </ul>
  );
}

const Item = ({ item, number, selectedItems, setSelectedItems }) => {
  // console.log(item);

  const DATA = {
    id: item.id,
    number: number,
    memberName: item.memberName,
    email: item.email,
    phoneNumber: item.phoneNumber,
    dogName: item.dogName,
    dogType: item.dogType,
    grade: item.grade,
    subscribeCount: item.subscribeCount + '회',
    accumulatedAmount: transformLocalCurrency(item.accumulatedAmount) + '원',
    cancelReason: item.cancelReason,
  };
  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, { width: 1000, height: 716 });
  };

  const onSelectHandler = (checked, thisId) => {
    const selectedId = Number(thisId);
    if (checked) {
      setSelectedItems((prevState) => prevState.concat(selectedId));
    } else {
      setSelectedItems((prevState) =>
        prevState.filter((id) => id !== selectedId),
      );
    }
  };

  return (
    <li className={s.item} key={`item-${DATA.id}`} data-idx={DATA.id}>
      <span>{DATA.number}</span>
      <span>{DATA.memberName}</span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.email}</em>
      </span>
      <span>{DATA.phoneNumber}</span>
      <span className={s.scrollBox}>{DATA.dogName}</span>
      <span className={s.scrollBox}>{DATA.dogType}</span>
      <span className={s.scrollBox}>{DATA.grade}</span>
      <span className={s.scrollBox}>{DATA.subscribeCount}</span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.accumulatedAmount}</em>
      </span>
      <span>{DATA.cancelReason}</span>
    </li>
  );
};
