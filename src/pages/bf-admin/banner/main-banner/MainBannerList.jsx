import Image from 'next/image';
import React, { useState, useEffect } from "react";
import s from "./mainBanner.module.scss";
import Ascend from '/public/img/icon/btn_ascend.svg';
import Descend from '/public/img/icon/btn_descend.svg';
import getElemIdx from "@util/func/getElemIdx.js";




const changeArrayOrder = function (list, targetIdx, moveValue) {
  // 배열값이 없는 경우 나가기
  if (list.length < 0) return;
  // 이동할 index 값을 변수에 선언
  const newPosition = targetIdx + moveValue;

  // 이동할 값이 0보다 작거나 최대값을 벗어나는 경우 종료
  if (newPosition < 0 || newPosition >= list.length) return;

  // 임의의 변수를 하나 만들고 배열 값 저장
  const tempList = JSON.parse(JSON.stringify(list));

  // 옮길 대상을 기존 배열에서 분리 및 target 변수에 저장
  const target = tempList.splice(targetIdx, 1)[0]; // splice (n번 째배열, n개 삭제
  // console.log(tempList.splice(targetIdx, 1)[0]);

  // 새로운 위치에 옮길 대상을 추가하기
  tempList.splice(newPosition, 0, target);
  return tempList;
};


const removeArray = function (list, targetIdx) {
  if (list.length < 0) return;
  const target = list.splice(targetIdx, 1)[0]; // splice (n번 째배열, n개 삭제
  console.log(target);;
  console.log(list);

  return list;
};





export default function MainBannerList({ items, setItemList, editListOrder }) {
  console.log(items);

  useEffect(() => {
    setItemList(items);
  }, [items, setItemList]);
  
  if(!items) return;



  const onAscendingHandler = (e) => {
    // const target = e.currentTarget.closest("li");
    // const children = [...target.parentNode.children];
    // const targetIdx = children.indexOf(target);
    const target = e.currentTarget.closest("li");
    const targetIdx = getElemIdx(target);
    const newItemList = changeArrayOrder(items, targetIdx, -1);
    if (newItemList) setItemList(newItemList);
  };


  const onDescendingHandler = (e) => {
    // const target = e.currentTarget.closest("li");
    // const children = [...target.parentNode.children];
    // const targetIdx = children.indexOf(target);
    const target = e.currentTarget.closest("li");
    const targetIdx = getElemIdx(target);
    const newItemList = changeArrayOrder(items, targetIdx, 1);
    if (newItemList) setItemList(newItemList);
  };


  const SortHandle = () => (
    <span className={`${s.sortHandle}`}>
      <i className="admin_btn" animation="show" onClick={onAscendingHandler}>
        <Ascend />
      </i>
      <i className="admin_btn" animation="show" onClick={onDescendingHandler}>
        <Descend />
      </i>
    </span>
  );


  const onDeleteItemHandler = (e) => {
     const target = e.currentTarget.closest("li");
     const targetIdx = getElemIdx(target);
     //  const children = [...target.parentNode.children];
      // const targetIdx = children.indexOf(target);

     removeArray(items, targetIdx);
    //  console.log('delete');
    //  target.remove(); // view에서 안보이게 만듦
  }


  const SortableItem = ({ item, sortableItemRef }) => (
    <li className={s.item} key={`item-${item.id}`} ref={sortableItemRef}>
      {editListOrder ? <SortHandle /> : <span>{item.order}</span>}
      <span>{item.name}</span>
      <span>
        <figure className={s["img-wrap"]}>
          <Image
            src="https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1"
            alt="메인배너 이미지"
            objectFit="contain"
            layout="fill"
          ></Image>
          <Image
            src={require("/public/img/icon/Subscription.png")}
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
        <button
          className="admin_btn basic_s solid"
          onClick={onDeleteItemHandler}
        >
          삭제
        </button>
      </span>
    </li>
  );


  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <SortableItem key={`item-${index}`} index={index} item={item} />
      ))}
    </ul>
  );
}