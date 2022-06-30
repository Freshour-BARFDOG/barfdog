import s from './single.module.scss';
import getElemIdx from '@util/func/getElemIdx';
import Link from 'next/link';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from "/util/func/transformLocalCurrency";

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
  const DATA = {
    id: item.id,
    name: item.name,
    category: item.category,
    originalPrice: transformLocalCurrency(item.originalPrice+1231231231231) + '원',
    salePrice: transformLocalCurrency(item.salePrice) + '원',
    remaining: transformLocalCurrency(item.remaining),
    discount: item.discount || '10%',
    status: item.status === 'LEAKED' ? 'Y':"N",
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
        <em className={'overflow-x-scroll'}>{DATA.category}</em>
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
      <span>{DATA.remaining}</span>
      <span>{DATA.discount}</span>
      <span>{DATA.status}</span>
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
