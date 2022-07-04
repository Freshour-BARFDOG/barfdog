import s from './single.module.scss';
import getElemIdx from '@util/func/getElemIdx';
import Link from 'next/link';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import {global_itemType} from "/store/TYPE/itemType";
export default function SearchResultList({ items, onDeleteItem }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <ItemList key={`item-${item.id}`} index={item.id} item={item} />
      ))}
    </ul>
  );
}


const ItemList = ({ item }) => {
  console.log(item)
  const DATA = {
    id: item.id,
    name: item.name,
    itemType: global_itemType
      [item.itemType],
    originalPrice: transformLocalCurrency(item.originalPrice) + '원',
    salePrice: transformLocalCurrency(item.salePrice) + '원',
    remaining: transformLocalCurrency(item.remaining) === '0' ? '품절' : transformLocalCurrency(item.remaining),
    discount: item.discount || '10%',
    status: item.status === 'LEAKED' ? 'Y':"N",
    reg_date: transformDate(item.createdDate) || '-',
    apiurl: {
      update: item._links.update_item.href,
      delete: item._links.delete_item.href,
    },
  };
  
  const onDeleteItemHandler = (e) => {
    const target = e.currentTarget.closest('li');
    const targetViewIdx = getElemIdx(target);
    const apiURL = e.currentTarget.dataset.apiurl;
    const reviewName = items[targetViewIdx]?.name;
    if (confirm(`선택된 리뷰(${reviewName})를 정말 삭제하시겠습니까?`)) {
      onDeleteItem(apiURL);
    }
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
      <span>{DATA.status}</span>
      <span>{DATA.reg_date}</span>
      <span>
        <Link href={`/bf-admin/product/single/update/${DATA.id}`} passHref>
          <a>
            <button className="admin_btn basic_s solid">수정</button>
          </a>
        </Link>
      </span>
      <span>
        <button
          className="admin_btn basic_s solid"
          onClick={onDeleteItemHandler}
          data-apiurl={DATA.apiurl.delete}
        >
          삭제
        </button>
      </span>
    </li>
  );
};
