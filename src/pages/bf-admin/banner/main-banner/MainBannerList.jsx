import Image from 'next/image';
import React, { useState } from "react";
import s from "./mainBanner.module.scss";
import {
  sortableHandle,
  sortableContainer,
  sortableElement,
  arrayMove,
} from "react-sortable-hoc";


//  DOWN : 내가 지금 클릭한 애의 인덱스
//    인덱스 +1 // 마지막 인덱스일 경우, 변함없음
//    그 다음 List: 인덱스 -1


export default function MainBannerList({items}) {

  const [itemList, setItemList] = useState(items);
  const [editOrder, setEditOrder] = useState(false);


  const DragHandle = sortableHandle(() => <span>::::::::</span>);

  const SortableItem = sortableElement(({ item }) => (
    <li className={s.item} key={`item-${item.id}`}>
      {editOrder ? <DragHandle /> : <span>{item.order}</span>}
      <span>{item.name}</span>
      <span>
        <figure className={s['img-wrap']}>
          <Image
            src="https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1"
            alt="메인배너 이미지"
            objectFit="contain"
            layout="fill"
          ></Image>
        </figure>
      </span>
      <span>{item.exp_target}</span>
      <span>{item.reg_date}</span>
      <span>
        <button className="admin_btn basic_s solid">수정</button>
      </span>
      <span>
        <button className="admin_btn basic_s solid">삭제</button>
      </span>
    </li>
  ));

  const SortableContainer = sortableContainer(({ children }) => {
    return <ul className="table_body">{children}</ul>;
  });



  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItemList(arrayMove(itemList, oldIndex, newIndex));
  };


  return (
    <SortableContainer
      onSortEnd={onSortEnd}
      useDragHandle
      disableAutoscroll
      className="table_body"
    >
      {/* {itemList.map((item, index) => <SortableItem key={`item-${index}`} index={index} item={item} />
      )} */}
    </SortableContainer>
  );
}