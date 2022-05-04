import Image from 'next/image';
import React, { useState, useEffect } from "react";
import s from "/styles/admin/mainBanner.module.scss";
import Link from 'next/link';
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
  // console.log(target);;
  // console.log(list);

  return list;
};





export default function MainBannerList({
  items,
  setItemList,
  editListOrder,
  onLeakedOrderUp,
  onLeakedOrderDown,
  onDeleteItem,
}) {
  useEffect(() => {
    setItemList(items);
  }, [items, setItemList]);

  if (!items) return;

  const onOrderUpHandler = (e) => {
    // const target = e.currentTarget.closest("li");
    // const children = [...target.parentNode.children];
    // const targetIdx = children.indexOf(target);
    const target = e.currentTarget.closest("li");
    const targetViewIdx = getElemIdx(target);
    const newItemList = changeArrayOrder(items, targetViewIdx, -1);
    const targetId = target.dataset.idx;
    if (newItemList) {
      setItemList(newItemList);
      onLeakedOrderUp(targetId);
    }
  };

  const onOrderDownHandler = (e) => {
    // const target = e.currentTarget.closest("li");
    // const children = [...target.parentNode.children];
    // const targetIdx = children.indexOf(target);
    const target = e.currentTarget.closest("li");
    const targetViewIdx = getElemIdx(target);
    const newItemList = changeArrayOrder(items, targetViewIdx, +1);
    const targetId = target.dataset.idx;
    if (newItemList) {
      setItemList(newItemList);
      onLeakedOrderDown(targetId);
    }
  };

  const SortHandle = () => (
    <span className={`${s.sortHandle}`}>
      <i className="admin_btn" animation="show" onClick={onOrderUpHandler}>
        <Ascend />
      </i>
      <i className="admin_btn" animation="show" onClick={onOrderDownHandler}>
        <Descend />
      </i>
    </span>
  );

  const onDeleteItemHandler = (e) => {
    const target = e.currentTarget.closest("li");
    const targetViewIdx = getElemIdx(target);
    const targetId = target.dataset.idx;

    const bannerName = items[targetViewIdx].name;
    if (confirm(`선택된 배너(${bannerName})를 정말 삭제하시겠습니까?`)) {
      removeArray(items, targetViewIdx);
      onDeleteItem(targetId);
      target.remove(); // view에서 안보이게 만듦;
    }
  };

  const transformDate = (d) => {
    const yy = d.split("-")[0];
    const mm = d.split("-")[1];
    const dd = d.split("-")[2].split("T")[0];
    return `${yy}-${mm}-${dd}`;
  };

  const SortableItem = ({ item, sortableItemRef }) => {
    const DATA = {
      id: item.id,
      order: item.leakedOrder,
      name: item.name,
      exp_target: item.targets,
      reg_date: transformDate(
        item.createdDate ? item.createdDate : item.modifiedDate
      ),
      url: item._links.thumbnail_pc.href,
    };

    return (
      <li
        className={s.item}
        key={`item-${DATA.id}`}
        ref={sortableItemRef}
        data-idx={DATA.id}
      >
        {editListOrder ? <SortHandle /> : <span>{DATA.order}</span>}
        <span>{DATA.name}</span>
        <span>
          <figure className={s["img-wrap"]}>
            <Image
              src={DATA.url}
              alt={`메인배너 썸네일 ${DATA.id}`}
              objectFit="contain"
              layout="fill"
            ></Image>
          </figure>
        </span>
        <span>{DATA.exp_target}</span>
        <span>{DATA.reg_date}</span>
        <span>
          <Link href="/bf-admin/banner/main-banner/editMainBanner" passHref>
            <a>
              <button className="admin_btn basic_s solid">수정</button>
            </a>
          </Link>
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
  };

  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <SortableItem key={`item-${item.id}`} index={item.id} item={item} />
      ))}
    </ul>
  );
}