import React, {useState} from 'react';
import s from './review.module.scss';
import Checkbox from '/src/components/atoms/Checkbox';
import transformDate from '/util/func/transformDate';
import popupWindow from '/util/func/popupWindow';
import Link from 'next/link';
import { global_reviewStateType } from '/store/TYPE/reviewStateType';
import Spinner from "/src/components/atoms/Spinner";
import extractPartOfURL from "/util/func/extractPartOfURL";

export default function ReviewList({ items,onDeleteItem,
                                     isLoading, selectedItems, setSelectedItems }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <ItemList
          key={`item-${item.id}`}
          item={item}
          onDeleteItem={onDeleteItem}
          isLoading={isLoading}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
        />
      ))}
    </ul>
  );
}

const ItemList = ({ item,
                    onDeleteItem,
                    isLoading,
                    selectedItems,
                    setSelectedItems
}) => {

  let itemStatus;
  global_reviewStateType.forEach((type) => {
    if (type.ENG === item.status) {
      itemStatus = type.KOR;
    }
  });
  
  const [submittedDeleteApi, setSubmittedDeleteApi] = useState( false );
  
  const DATA = {
    id: item.id,
    status: itemStatus,
    title: item.title,
    contents: item.contents,
    star: item.star,
    name: item.name,
    email: item.email,
    createdDate: transformDate(item.createdDate) || '-',
    apiurl: {
      delete: item._links?.delete_review.href,
    },
  };
  
  const onDelete = async (e) => {
    if ( submittedDeleteApi ) return console.error ( "이미 제출된 양식입니다." );
    if ( !confirm( `선택된 회원(${item.name})님의 리뷰를 삭제하시겠습니까?` ) ) return;
    const apiUrl = e.currentTarget.dataset.apiUrl;
    onDeleteItem( extractPartOfURL( apiUrl ).pathname, DATA.id );
    setSubmittedDeleteApi( true );
  };
  

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, { width: 640, height: 810 });
  };

  const onSelectHandler = (checked, thisId) => {
    const selectedId = Number(thisId);
    if (checked) {
      setSelectedItems((prevState) => prevState.concat(selectedId));
    } else {
      setSelectedItems((prevState) => prevState.filter((id) => id !== selectedId));
    }
  };

  //
  return (
    <li className={s.item} key={`item-${DATA.id}`} data-idx={DATA.id}>
      <span>
        <Checkbox
          id={DATA.id}
          onClick={onSelectHandler}
          checked={selectedItems.indexOf(DATA.id) >= 0}
        />
      </span>
      <span>{DATA.id}</span>
      <span>{DATA.status}</span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.title}</em>
      </span>
      <span>
        <Link href={`/bf-admin/review/popup/${DATA.id}`} passHref>
          <a className={'overflow-x-scroll btn_link'} onClick={onPopupHandler}>
            <em className={'overflow-x-scroll'}>{DATA.contents}</em>
          </a>
        </Link>
      </span>
      <span>{DATA.star}</span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.name}</em>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.email}</em>
      </span>
      <span>{DATA.createdDate}</span>
      <span>
        <button
          className="admin_btn basic_s solid"
          onClick={onDelete}
          data-api-url={DATA.apiurl.delete}
        >
          {(isLoading?.delete && isLoading.delete[DATA.id]) ? <Spinner style={{color: "white"}}/> : "삭제"}
        </button>
      </span>
    </li>
  );
};
