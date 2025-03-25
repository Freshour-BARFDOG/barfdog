import React, { useState } from 'react';
import s from './recipe.module.scss';
import Link from 'next/link';
import transformDate from '/util/func/transformDate';
import extractPartOfURL from '/util/func/extractPartOfURL';
import Spinner from '../../../components/atoms/Spinner';

export default function RecipeList({ items, onDeleteItem, isLoading }) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <ItemList
          key={`item-${item.id}`}
          number={index + 1}
          item={item}
          onDeleteItem={onDeleteItem}
          isLoading={isLoading}
        />
      ))}
    </ul>
  );
}

const ItemList = ({
  item,
  number,
  sortableItemRef,
  onDeleteItem,
  isLoading,
}) => {
  const [submittedDeleteApi, setSubmittedDeleteApi] = useState(false);

  const DATA = {
    id: item.id,
    number,
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

  const onDelete = (e) => {
    // ! 레시피는 REST API서버에서 실제 삭제되는 것이 아니라, admin단에서도 숨김처리가 된다 -> 실제 삭제가 될 경우, 결제 등의 데이터처리에 문제가 될 수 있음
    if (submittedDeleteApi) return console.error('이미 제출된 양식입니다.');
    if (!confirm(`선택된 레시피(${item.name || ''})를 정말 삭제하시겠습니까?`))
      return;
    const apiUrl = e.currentTarget.dataset.apiUrl;
    onDeleteItem(extractPartOfURL(apiUrl).pathname, DATA.id);
    setSubmittedDeleteApi(true);
  };

  return (
    <li
      className={s.item}
      key={`item-${DATA.id}`}
      ref={sortableItemRef}
      data-idx={DATA.id}
    >
      <span>{DATA.number}</span>
      <span>{DATA.name}</span>
      <span>{DATA.description}</span>
      <span>{DATA.pricePerGram}</span>
      <span>{DATA.gramPerKcal}</span>
      <span>{DATA.ingredients}</span>
      <span
        style={{
          color: `${
            DATA.inStock === '품절'
              ? 'var(--color-warning)'
              : 'var(--color-font-def)'
          }`,
        }}
      >
        {DATA.inStock}
      </span>
      <span>{DATA.leaked}</span>
      <span>{DATA.modifiedDate}</span>
      <span>
        <Link href={`/product/recipe/update/${DATA.id}`} passHref>
          <a>
            <button className="admin_btn basic_s solid">수정</button>
          </a>
        </Link>
      </span>
      <span>
        <button
          className="admin_btn basic_s solid"
          data-api-url={DATA.apiurl.delete}
          onClick={onDelete}
        >
          {isLoading?.delete && isLoading.delete[DATA.id] ? (
            <Spinner style={{ color: 'white' }} />
          ) : (
            '삭제'
          )}
        </button>
      </span>
    </li>
  );
};
