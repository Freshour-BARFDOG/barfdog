import Image from 'next/image';
import React from 'react';
import s from './popup.module.scss';
import Link from 'next/link';
import Ascend from '/public/img/icon/btn_ascend.svg';
import Descend from '/public/img/icon/btn_descend.svg';
import getElemIdx from '/util/func/getElemIdx.js';
import changeArrayOrder from '/util/func/changeArrayOrder';
import transformDate from '/util/func/transformDate';
import { deleteData, putObjData } from '/src/pages/api/reqData';
import extractPartOfURL from '/util/func/extractPartOfURL';



export default function PopupList({ items, orderEditMode, onUpdateList }) {
  if (!items || !items.length) return;

  const onDeleteItemHandler = async (e) => {
    const button = e.currentTarget;
    const target = button.closest('li');
    const apiURL = button.dataset.apiUrl;
    const targetLeakedOrder = Number(target.dataset.order);
    const targetIndex = targetLeakedOrder - 1;
    const bannerName = items[targetIndex].name;
    if (confirm(`정말 삭제하시겠습니까?\n배너명: ${bannerName}`)) {
      const res = await deleteData(apiURL);
      console.log(res)
      if(res.isDone){
        window.location.reload();
      } else {
        alert('삭제에 실패하였습니다.');
      }
    }
  };

  return (
    <ul className="table_body">
      {items.map((item) => (
        <SortableItem
          key={`item-${item.id}`}
          index={item.id}
          item={item}
          items={items}
          onDeleteHandler={onDeleteItemHandler}
          onUpdateList={onUpdateList}
          orderEditMode={orderEditMode}
        />
      ))}
    </ul>
  );
}



const SortableItem = ({ item, items,  sortableItemRef, onDeleteHandler, onUpdateList, orderEditMode }) => {

  const DATA = {
    id: item.id || Math.floor(Math.random() * 100),
    leakedOrder: item.leakedOrder,
    name: item.name || '',
    reg_date: transformDate(item.createdDate ? item.createdDate : item.modifiedDate),
    url: item._links?.thumbnail_pc.href,
    apiurl: {
      orderUp: item._links?.update_popupBanner_order_up.href,
      orderDown: item._links?.update_popupBanner_order_down.href,
      delete: item._links?.delete_popupBanner.href,
      update: item._links?.update_popupBanner.href,
    },
  };

  return (
    <li
      className={s.item}
      key={`item-${DATA.id}`}
      ref={sortableItemRef}
      data-idx={DATA.id}
    >
      {orderEditMode ? (
        <SortHandle items={items} onUpdateList={onUpdateList} apiurl={DATA.apiurl} />
      ) : (
        <span>{DATA.leakedOrder}</span>
      )}
      <span>{DATA.name}</span>
      <span>
        <figure className={s['img-wrap']}>
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
        <Link href={`/bf-admin/banner/popup/update/${DATA.id}`} passHref>
          <a>
            <button className="admin_btn basic_s solid">수정</button>
          </a>
        </Link>
      </span>
      <span>
        <button
          className="admin_btn basic_s solid"
          onClick={onDeleteHandler}
          data-api-url={DATA.apiurl.delete}
        >
          삭제
        </button>
      </span>
    </li>
  );
};






const SortHandle = ({ items, apiurl, onUpdateList }) => {

  const onOrderUpHandler = (e) => {
    const button = e.currentTarget;
    changeOrder(button, 'up');
  };

  const onOrderDownHandler = (e) => {
    const button = e.currentTarget;
    changeOrder(button, 'down');
  };

  const changeOrder = async (button, direction)=>{
    onUpdateList(false);
    let dir;
    if(direction === 'down') {
      dir = +1
    }else if(direction === 'up'){
      dir = -1;
    }

    const target = button.closest('li');
    const url = button.dataset.apiurl;
    const apiURL = extractPartOfURL(url).pathname;
    const targetIndex = getElemIdx(target);
    const newItemList = changeArrayOrder(items, targetIndex, dir);
    console.log(newItemList)
    if (newItemList) {
      const emptyData = '';
      await putObjData(apiURL, emptyData);
      onUpdateList(true);
    }
  }


  return (
    <>
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
    </>
  );
};

