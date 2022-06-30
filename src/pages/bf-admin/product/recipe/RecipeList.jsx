import s from "./recipe.module.scss";
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
    itemName: item.itemName || "바프레드",
    priceConst: item.priceConst || "36.649",
    weightConst: item.weightConst || "1.49462",
    soldoutStatus: item.soldoutStatus || "N",
    leakedStatus: item.leakedStatus || "Y",
    createdDate: "22-02-22" || transformDate(item.createdDate),
    modifiedDate: "22-06-22" || transformDate(item.modifiedDate),
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
        <em className={"overflow-x-scroll"}>{DATA.itemName}</em>
      </span>
      <span>{DATA.priceConst}</span>
      <span>{DATA.weightConst}</span>
      <span>{DATA.soldoutStatus}</span>
      <span>{DATA.leakedStatus}</span>
      <span>{DATA.createdDate}</span>
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
          onClick={onDeleteItemHandler}
          // data-apiurl={DATA.apiurl.delete}
        >
          삭제
        </button>
      </span>
    </li>
  );
};
