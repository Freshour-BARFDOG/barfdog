import React from 'react';
import s from './searchUser.module.scss';
import Checkbox from '/src/components/atoms/Checkbox';
import Link from "next/link";
import popupWindow from "/util/func/popupWindow";
import transformLocalCurrency from "/util/func/transformLocalCurrency";

export default function UserList({ items,selectedItems, setSelectedItems }) {
  if (!items || !items.length) return;
  return (
    <ul className={s.table_body}>
      {items.map((item, index) => (
        <Item
          key={`item-${item.id}-${index}`}
          item={item}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
        />
      ))}
    </ul>
  );
}


const Item = ({ item, selectedItems,   setSelectedItems }) => {
  // // console.log(item)
  
  const DATA = {
    id: item.id,
    grade: item.grade,
    name: item.name ,
    email: item.email,
    phoneNumber: item.phoneNumber,
    dogName: item.dogName,
    accumulatedAmount: transformLocalCurrency(item.accumulatedAmount)+'원',
    subscribe: item.subscribe ? 'Y' : 'N',
    longUnconnected: item.longUnconnected ? 'Y' : 'N',
  };
  const onPopupHandler = (e) => {
    e.preventDefault();
    if(typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, {width:1000, height:716});
  }
  
  const onSelectHandler = (checked, thisId)=>{
    const selectedId = Number(thisId);
    if(checked){
      setSelectedItems(prevState => prevState.concat(selectedId));
    }else {
      setSelectedItems(prevState => prevState.filter((id)=>id !== selectedId))
    }
  }
  
  return (
    <li className={s.item} key={`item-${DATA.id}`} data-idx={DATA.id}>
      <span>
        <Checkbox
          id={DATA.id}
          onClick={onSelectHandler}
          checked={selectedItems.indexOf(DATA.id) >= 0}
        />
      </span>
      <span>
        <Link href={`/bf-admin/popup/memberInfo/${DATA.id}`} passHref>
          <a target="_blank" className="admin_btn basic_s solid" onClick={onPopupHandler}>
            상세보기
          </a>
        </Link>
      </span>
      <span>{DATA.grade}</span>
      <span>{DATA.name}</span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.email}</em>
      </span>
      <span>{DATA.phoneNumber}</span>
      <span className={s.scrollBox}>{DATA.dogName}</span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.accumulatedAmount}</em>
      </span>
      <span>{DATA.subscribe}</span>
      <span>{DATA.longUnconnected}</span>
    </li>
  );
};
