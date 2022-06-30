import React from 'react';
import s from './searchUser.module.scss';
import Checkbox from '/src/components/atoms/Checkbox';
import Link from "next/link";
import popupWindow from "/util/func/popupWindow";

export default function UserList({ items }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <Item key={`item-${item.id}-${index}`} item={item} />
      ))}
    </ul>
  );
}

const Item = ({ item }) => {
  const DATA = {
    id: item.memberId || Math.random(),
    grade: item.grade || '실버',
    name: item.name || '김바프',
    email: item.email || 'useruseruseruser@gmail.com',
    phoneNumber: item.phoneNumber || '010-1234-4567',
    dogName: item.dogName || '스칼렛스칼렛스칼렛스칼렛',
    accumulatedAmount: item.accumulatedAmount || '1,265,100',
    subscribe: item.subscribe || 'Y',
    longUnconnected: item.longUnconnected || 'N',
    apiurl: {
      // self: item._links.query_banner.href,
      // orderUp: item._links.mainBanner_leakedOrder_up.href,
      // orderDown: item._links.mainBanner_leakedOrder_down.href,
      // delete: item._links.delete_banner.href,
    },
  };
  const onPopupHandler = (e) => {
    e.preventDefault();
    if(typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, {width:1000, height:716});
  }

  return (
    <li className={s.item} key={`item-${DATA.id}`} data-idx={DATA.id}>
      <span>
        <Checkbox
          id={DATA.id}
          onClick={(value) => {
            console.log(value);
          }}
        />
      </span>
      <span>
        <Link href={`/bf-admin/member/popup/${DATA.id}`} passHref>
          <a target="_blank" className="admin_btn basic_s solid" onClick={onPopupHandler}>
            상세보기
          </a>
        </Link>
      </span>
      <span>{DATA.grade}</span>
      <span>{DATA.name}</span>
      <span className={s.scrollBox}>{DATA.email}</span>
      <span>{DATA.phoneNumber}</span>
      <span className={s.scrollBox}>{DATA.dogName}</span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.accumulatedAmount}원</em>
      </span>
      <span>{DATA.subscribe}</span>
      <span>{DATA.longUnconnected}</span>
    </li>
  );
};
