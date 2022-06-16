import React from 'react';
import s from './coupon-release.module.scss';
import Checkbox from '/src/components/atoms/Checkbox';

export default function CouponReleaseUserList({ items }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <Item key={`item-${item.id}-${index}`} item={item} />
      ))}
    </ul>
  );
}



const Item = ({item}) => {
  const DATA = {
    name: item.name || '김바프',
    id: item.id || '0',
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
  return (
    <li className={s.item} key={`item-${DATA.id}`} data-idx={DATA.id}>
      <span>
        <Checkbox
          id="reviewId"
          onClick={(value) => {
            console.log(value);
          }}
        />
      </span>
      <span>{DATA.name}</span>
      <span>{DATA.id}</span>
      <span><em className={"text-transform-ellipsis"}>{DATA.accumulatedAmount}원</em></span>
      <span>{DATA.subscribe}</span>
      <span>{DATA.longUnconnected}</span>
    </li>
  );
};
