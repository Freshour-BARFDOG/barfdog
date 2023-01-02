import s from './recipe.module.scss';
import Link from 'next/link';
import transformDate from '/util/func/transformDate';
import { putObjData } from '/src/pages/api/reqData';

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

const ItemList = ({ item, sortableItemRef }) => {
  const DATA = {
    id: item.id,
    name: item.name,
    description: item.description,
    pricePerGram: item.pricePerGram,
    gramPerKcal: item.gramPerKcal,
    ingredients: item.ingredients,
    leaked: item.leaked === 'LEAKED' ? 'Y' : 'N',
    inStock: item.inStock === true ? 'Y' : '품절',
    modifiedDate: transformDate(item.modifiedDate),
    apiurl: {
      update: item._links.update_recipe?.href,
      delete: item._links.inactive_recipe?.href,
    },
  };

  const onDeleteItemHandler = async (e) => {
    // ! 레시피는 REST API서버에서 실제 삭제되는 것이 아니라, admin단에서도 숨김처리가 된다 -> 실제 삭제가 될 경우, 결제 등의 데이터처리에 문제가 될 수 있음
    const apiURL = e.currentTarget.dataset.apiurl;
    const itemId = item.id;
    if (confirm(`선택된 레시피(${item.name || ''})를 정말 삭제하시겠습니까?`)) {
      const res = await putObjData(apiURL, itemId);
      console.log(res);
      if (res.data.status === 200 || res.data.status === 201) {
        window.location.reload();
      } else {
        alert('삭제할 수 없습니다. 새로고침 후 , 다시 시도해보세요.');
      }
    }
  };

  return (
    <li className={s.item} key={`item-${DATA.id}`} ref={sortableItemRef} data-idx={DATA.id}>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.name}</em>
      </span>
      <span>
        <em className={'overflow-x-scroll'}>{DATA.description}</em>
      </span>
      <span>{DATA.pricePerGram}</span>
      <span>{DATA.gramPerKcal}</span>
      <span>{DATA.ingredients}</span>
      <span
        style={{
          color: `${DATA.inStock === '품절' ? 'var(--color-warning)' : 'var(--color-font-def)'}`,
        }}
      >
        {DATA.inStock}
      </span>
      <span>{DATA.leaked}</span>
      <span>{DATA.modifiedDate}</span>
      <span>
        <Link href={`/bf-admin/product/recipe/update/${DATA.id}`} passHref>
          <a>
            <button className="admin_btn basic_s solid">수정</button>
          </a>
        </Link>
      </span>
      <span>
        <button
          className="admin_btn basic_s solid"
          data-apiurl={DATA.apiurl.delete}
          onClick={onDeleteItemHandler}
        >
          삭제
        </button>
      </span>
    </li>
  );
};
