import s from './review.module.scss';
import Checkbox from '/src/components/atoms/Checkbox';
import transformDate from '/util/func/transformDate';
import popupWindow from '/util/func/popupWindow';
import Link from 'next/link';
import { deleteData } from '/src/pages/api/reqData';
import React from 'react';

export default function BestReviewList({ items, selectedItems, setSelectedItems }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <ItemList
          key={`item-${item.id}`}
          index={item.id}
          item={item}
          setSelectedItems={setSelectedItems}
          selectedItems={selectedItems}
        />
      ))}
    </ul>
  );
}

const ItemList = ({ item, selectedItems, setSelectedItems }) => {
  // console.log(item);
  const DATA = {
    id: item.id,
    status: item.status,
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

  const onDeleteItem = async (e) => {
    const apiURL = e.currentTarget.dataset.apiurl;
    if (confirm(`선택된 회원(${item.name || ''})님의 리뷰를 정말 삭제하시겠습니까?`)) {
      const res = await deleteData(apiURL);
      if (res.status === 200 || res.status === 201) {
        window.location.reload();
      } else {
        alert('삭제할 수 없습니다. 새로고침 후 , 다시 시도해보세요.');
      }
    }
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
          onClick={onDeleteItem}
          data-apiurl={DATA.apiurl.delete}
        >
          삭제
        </button>
      </span>
    </li>
  );
};
