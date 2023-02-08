import s from "./blog.module.scss";
import Link from 'next/link';
import {deleteData} from "/src/pages/api/reqData";
import transformDate from "/util/func/transformDate";
import React, {useState} from "react";
import extractPartOfURL from "/util/func/extractPartOfURL";
import Spinner from "/src/components/atoms/Spinner";


export default function BlogList({ items, onDeleteItem, isLoading }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, i) => (
        <ItemList key={`item-${item.id}-${i}`} item={item} onDeleteItem={onDeleteItem} isLoading={isLoading}/>
      ))}
    </ul>
  );
}



const ItemList = ({ item, onDeleteItem, isLoading }) => {
  
  const [submittedDeleteApi, setSubmittedDeleteApi] = useState( false );
  
  const DATA = {
    id: item.id,
    title: item.title || '제목이 없습니다.',
    createdDate: transformDate(item.createdDate),
    status: item.status === 'LEAKED' ? 'Y' : 'N' ,
    apiurl: {
      query_blog: item._links?.query_blog.href,
      update: item._links?.update_blog.href,
      delete: item._links.delete_blog?.href,
    },
  };
  
  const onDelete = (e) => {
    if ( submittedDeleteApi ) return console.error( "이미 제출된 양식입니다." );
    if (!confirm(`선택된 게시글(${DATA.id + '번'})을 정말 삭제하시겠습니까?`)) return;
    const apiUrl = e.currentTarget.dataset.apiUrl;
    onDeleteItem( extractPartOfURL( apiUrl ).pathname, DATA.id );
    setSubmittedDeleteApi( true );
  };
  

  return (
    <li className={s.item} key={`item-${DATA.id}`} data-idx={DATA.id}>
      <span>{DATA.id}</span>
      <span>{DATA.title}</span>
      <span>{DATA.createdDate}</span>
      <span>{DATA.status}</span>
      <span>
        <Link href={`/bf-admin/community/blog/update/${DATA.id}`} passHref>
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
          {(isLoading?.delete && isLoading.delete[DATA.id]) ? <Spinner style={{color: "white"}}/> : "삭제"}
        </button>
      </span>
    </li>
  );
};
