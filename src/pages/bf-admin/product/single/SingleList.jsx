import s from "./single.module.scss";
import getElemIdx from "@util/func/getElemIdx";
import Link from "next/link";
import transformDate from "@util/func/transformDate";




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
    id: item.id || "0",
    pruductId: item.pruductId || "20220256841568",
    category: item.category || "생식단품",
    itemName: item.itemName || "바프레드",
    price: item.price || "7,700",
    stockQuantity: item.stockQuantity || "999",
    discount: item.discount || "10%",
    status: item.status || "N",
    apiurl: {
      // self: item._links.query_banner.href,
      // orderUp: item._links.mainBanner_leakedOrder_up.href,
      // orderDown: item._links.mainBanner_leakedOrder_down.href,
      // delete: item._links.delete_banner.href,
    },
  };

  const onDeleteItemHandler = (e) => {
    const target = e.currentTarget.closest("li");
    const targetViewIdx = getElemIdx(target);
    const apiURL = e.currentTarget.dataset.apiurl;
    const reviewName = items[targetViewIdx]?.name;
    if (confirm(`선택된 리뷰(${reviewName})를 정말 삭제하시겠습니까?`)) {
      onDeleteItem(apiURL);
    }
  };

  return (
    <li
      className={s.item}
      key={`item-${DATA.id}`}
      ref={sortableItemRef}
      data-idx={DATA.id}
    >
      <span>
        <em className={"text-transform-ellipsis"}>{DATA.pruductId}</em>
      </span>
      <span>{DATA.category}</span>
      <span>
        <em className={"text-transform-ellipsis"}>{DATA.itemName}</em>
      </span>
      <span>{DATA.price}</span>
      <span>{DATA.stockQuantity}</span>
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
          // data-apiurl={DATA.apiurl.delete}
        >
          삭제
        </button>
      </span>
    </li>
  );
};
