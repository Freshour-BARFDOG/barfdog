import React from 'react';
import {InquiryItem} from "./InquiryItem";

export default function InquiryItemList({
  items,
  selectedIdList,
  onSelectedItem,
}) {
  return (
    <ul className="table_body">
      {items?.length > 0 && items.map((item, i) => (
        <InquiryItem
          key={`item-${item.id}-${i}`}
          index={i}
          item={item}
          selectedIdList={selectedIdList}
          onSelectedItem={onSelectedItem}
        />
      ))}
    </ul>
  );
}


