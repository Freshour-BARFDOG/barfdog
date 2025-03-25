import s from './singleItem.module.scss';
import Link from 'next/link';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import {general_itemType} from "/store/TYPE/itemType";
import {useState} from "react";
import extractPartOfURL from "../../../../util/func/extractPartOfURL";
import Spinner from "../../../components/atoms/Spinner";

export default function SingleItemList ({items, onDeleteItem, isLoading}) {
  if ( !items || !items.length ) return;
  
  return (
    <ul className="table_body">
      {items.map( (item) => (
        <ItemList key={`item-${item.id}`} index={item.id} item={item} onDeleteItem={onDeleteItem} isLoading={isLoading}/>
      ) )}
    </ul>
  );
}


const ItemList = ({item, onDeleteItem, isLoading}) => {
  
  const [submittedDeleteApi, setSubmittedDeleteApi] = useState( false );
  
  const DATA = {
    id: item.id,
    name: item.name,
    itemType: general_itemType.KOR
      [item.itemType],
    originalPrice: transformLocalCurrency( item.originalPrice ) + '원',
    salePrice: transformLocalCurrency( item.salePrice ) + '원',
    remaining: transformLocalCurrency( item.remaining ) === '0' ? '품절' : transformLocalCurrency( item.remaining ),
    discount: item.discount === '0원' || item.discount === '0%' ? '-' : item.discount, // - REST API server에서 할인 단위(% 또는 원) 적용되어서 전달됨
    allianceDiscount: item?.allianceDiscount === null ? '-' : item.allianceDiscount, // 값이 없을 경우 'none'
    status: item.status === 'LEAKED' ? 'Y' : "N",
    reg_date: transformDate( item.createdDate ) || '-',
    apiurl: {
      update: item._links?.update_item?.href,
      delete: item._links?.delete_item?.href,
    },
  };

  const onDelete = (e) => {
    if ( submittedDeleteApi ) return console.error( "이미 제출된 양식입니다." );
    if ( !confirm( `선택된 항목(${item.name || ''})을 정말 삭제하시겠습니까?` ) ) return;
    const apiUrl = e.currentTarget.dataset.apiUrl;
    onDeleteItem( extractPartOfURL( apiUrl ).pathname, DATA.id );
    setSubmittedDeleteApi( true );
  };
  
  return (
    <li className={s.item} key={`item-${DATA.id}`} data-idx={DATA.id}>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.id}</em>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.itemType}</em>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.name}</em>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.originalPrice}</em>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.salePrice}</em>
      </span>
      <span className={`${DATA.remaining === '품절' ? 'pointColor' : ""}`}>{DATA.remaining}</span>
      <span>{DATA.discount}</span>
      <span>{DATA.allianceDiscount}</span>
      <span>{DATA.status}</span>
      <span>{DATA.reg_date}</span>
      <span>
        <Link href={`/product/single/update/${DATA.id}`} passHref>
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
