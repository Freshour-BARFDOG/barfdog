import Image from 'next/image';
import s from "./mainBanner.module.scss";
import Link from 'next/link';
import Ascend from '/public/img/icon/btn_ascend.svg';
import Descend from '/public/img/icon/btn_descend.svg';
import getElemIdx from "@util/func/getElemIdx.js";
import changeArrayOrder from '@util/func/changeArrayOrder'
import {exposeTargetTYPE} from "@store/TYPE/exposeTargetTYPE";
import React, {useState} from "react";
import transformDate from "@util/func/transformDate";
import extractPartOfURL from "@util/func/extractPartOfURL";


export default function MainBannerList (
  {
    items,
    orderEditMode,
    onEditLeakedOrder,
    onDeleteItem,
  }
) {
  
  if ( !items || !items.length ) return;
  
  return (
    <ul className="table_body">
      {items.map( (item, index) => (
        <SortableItem
          key={`item-${item.id}`}
          index={item.id}
          item={item}
          items={items}
          orderEditMode={orderEditMode}
          onDeleteItem={onDeleteItem}
          onEditLeakedOrder={onEditLeakedOrder}
        />
      ) )}
    </ul>
  );
}


const SortableItem = ({item, items, sortableItemRef, orderEditMode, onDeleteItem, onEditLeakedOrder}) => {
  
  const [submittedDeleteApi, setSubmittedDeleteApi] = useState( false );
  
  const DATA = {
    id: item.id,
    leakedOrder: item.leakedOrder,
    name: item.name,
    exp_target: item.targets,
    reg_date: transformDate(
      item.createdDate || item.modifiedDate, ''),
    url: item._links.thumbnail_pc.href,
    apiurl: { // ! 서버에서 받은 api url사용 시, 프로토콜이 맞지 않는 오류 발생힘
      orderUp: item._links?.mainBanner_leakedOrder_up.href,
      orderDown: item._links?.mainBanner_leakedOrder_down.href,
      delete: item._links?.delete_banner.href,
      update: item._links?.update_banner.href,
    },
  };
  
  const onDelete = (e) => {
    if ( submittedDeleteApi ) return console.error( "이미 제출된 양식입니다." );
    if ( !confirm( `정말 삭제하시겠습니까?\n배너명: ${item.name}` ) ) return;
    const apiUrl = e.currentTarget.dataset.apiUrl;
    onDeleteItem( extractPartOfURL( apiUrl ).pathname );
    setSubmittedDeleteApi( true )
  };
  
  
  return (
    <li
      className={s.item}
      key={`item-${DATA.id}`}
      ref={sortableItemRef}
      data-idx={DATA.id}
    >
      {orderEditMode ? (
        <SortHandle items={items} apiurl={DATA.apiurl} onEditLeakedOrder={onEditLeakedOrder}/>
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
      <span>{exposeTargetTYPE.KOR[DATA.exp_target]}</span>
      <span>{DATA.reg_date}</span>
      <span>
          <Link
            href={`/bf-admin/banner/main-banner/update/${DATA.id}`}
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
            onClick={onDelete}
            data-api-url={DATA.apiurl.delete}
          >
            삭제
          </button>
        </span>
    </li>
  );
};


const SortHandle = ({items, apiurl, onEditLeakedOrder}) => {
  
  const onChangeOrderHandler = (e) => {
    const btn = e.currentTarget;
    const target = btn.closest( "li" );
    const url = btn.dataset.apiurl;
    const apiUrl = extractPartOfURL( url ).pathname;
    const targetViewIdx = getElemIdx( target );
    const dir = btn.dataset.direction;
    const toBeDirection = dir === 'up' ? -1 : +1;
    const isValid = !!changeArrayOrder( items, targetViewIdx, toBeDirection );
    if ( isValid ) {
      onEditLeakedOrder( apiUrl );
    }
  };
  
  
  return (
    <span className={`${s.sortHandle}`}>
      <i
        className="admin_btn"
        animation="show"
        onClick={onChangeOrderHandler}
        data-direction={"up"}
        data-apiurl={apiurl.orderUp}
      >
        <Ascend/>
      </i>
      <i
        className="admin_btn"
        animation="show"
        onClick={onChangeOrderHandler}
        data-direction={"down"}
        data-apiurl={apiurl.orderDown}
      >
        <Descend/>
      </i>
    </span>);
  
}
