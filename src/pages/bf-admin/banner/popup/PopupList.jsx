import Image from "next/image";
import React, { useState, useEffect } from "react";
import s from "./popup.module.scss";
import Link from "next/link";
import Ascend from "/public/img/icon/btn_ascend.svg";
import Descend from "/public/img/icon/btn_descend.svg";
import getElemIdx from "@util/func/getElemIdx.js";
import changeArrayOrder from "@util/func/changeArrayOrder";
import transformDate from "@util/func/transformDate";



function sorting(arr, key) {
  // 내림차순 : b - a
  // 오름차순 : a - b
  const newArr = arr.sort((a, b) => {
    if (a[key] - b[key]) {
      return a[key] - b[key];
    }
  });

  return newArr;
}

const removeArray = function (list, targetIdx) {
  if (list.length < 0) return;
  const target = list.splice(targetIdx, 1)[0]; // splice (n번 째배열, n개 삭제
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
  console.log();

  if (!items || !items.length) return;

  const items_sorted = sorting(items, "leakedOrder");

  const onOrderUpHandler = (e) => {
    const target = e.currentTarget.closest("li");
    // const targetLeakedOrder = Number(target.dataset.order);
    // const calcedIndex = targetLeakedOrder -1;
    const targetViewIdx = getElemIdx(target);
    const apiURL = e.currentTarget.dataset.apiurl;
    const newItemList = changeArrayOrder(items_sorted, targetViewIdx, -1);
    if (newItemList) {
      // setItemList(newItemList);
      onLeakedOrderUp(apiURL);
    }
  };

  const onOrderDownHandler = (e) => {
    const target = e.currentTarget.closest("li");
    // const targetLeakedOrder = Number(target.dataset.order);
    // const calcedIndex = targetLeakedOrder -1;
    const targetViewIdx = getElemIdx(target);
    const apiURL = e.currentTarget.dataset.apiurl;
    const newItemList = changeArrayOrder(items_sorted, targetViewIdx, +1);
    if (newItemList) {
      // setItemList(newItemList);
      onLeakedOrderDown(apiURL);
    }
  };

  const onDeleteItemHandler = (e) => {
    const target = e.currentTarget.closest("li");
    const targetLeakedOrder = Number(target.dataset.order);
    const apiURL = e.currentTarget.dataset.apiurl;
    const bannerName = items_sorted[targetLeakedOrder].name;
    if (confirm(`선택된 배너(${bannerName})를 정말 삭제하시겠습니까?`)) {
      removeArray(items_sorted, targetViewIdx);
      onDeleteItem(apiURL);
      // target.remove();
    }
  };

  const SortHandle = ({ apiurl }) => (
    <span className={`${s.sortHandle}`}>
      <i
        className="admin_btn"
        animation="show"
        onClick={onOrderUpHandler}
        data-apiurl={apiurl.orderUp}
      >
        <Ascend />
      </i>
      <i
        className="admin_btn"
        animation="show"
        onClick={onOrderDownHandler}
        data-apiurl={apiurl.orderDown}
      >
        <Descend />
      </i>
    </span>
  );

  const SortableItem = ({ item, sortableItemRef }) => {
    const DATA = {
      id: item.id || 0,
      leakedOrder: item.leakedOrder || 0,
      name: item.name || "팝업이름",
      reg_date:
        "22-02-22" ||
        transformDate(item.createdDate ? item.createdDate : item.modifiedDate),
      url:
        item._links?.thumbnail_pc.href ||
        "https://images.unsplash.com/photo-1638913970675-b5ec36292665?crop=entropy&cs=tinysrgb&fm=jpg&ixlib=rb-1.2.1&q=80&raw_url=true&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932",
      apiurl: {
        // self: item._links.query_banner.href,
        // orderUp: item._links.mainBanner_leakedOrder_up.href,
        // orderDown: item._links.mainBanner_leakedOrder_down.href,
        // delete: item._links.delete_banner.href,
      },
    };


    return (
      <li
        className={s.item}
        key={`item-${DATA.id}`}
        ref={sortableItemRef}
        data-idx={DATA.id}
        data-order={DATA.leakedOrder}
      >
        {editListOrder ? (
          <SortHandle apiurl={DATA.apiurl} />
        ) : (
          <span>{DATA.leakedOrder}</span>
        )}
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
        <span>{DATA.reg_date}</span>
        <span>
          <Link
            href={`/bf-admin/banner/popup/update/${DATA.id}`}
            passHref
          >
            <a>
              <button className="admin_btn basic_s solid">수정</button>
            </a>
          </Link>
        </span>
        <span>
          <button
            className="admin_btn basic_s solid"
            onClick={onDeleteItemHandler}
            apiurl={DATA.apiurl.delete}
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
