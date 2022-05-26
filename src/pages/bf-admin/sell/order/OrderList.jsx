import s from './order.module.scss';
import getElemIdx from "@util/func/getElemIdx";
import Checkbox from "@src/components/atoms/Checkbox";
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
    orderId: item.orderId || "56841568",
    pruductId: item.pruductId || "20220256841568",
    orderStatus: item.orderStatus || "결제완료",
    orderDate: item.date || "05/25 15:34",
    buyerId: item.userId || "barf1234",
    buyerName: item.buyerName || "김바프",
    buyerPhone: item.buyerPhone || "01061535496",
    recipientName: item.recipientName || "나수령",
    recipientPhone: item.recipientPhone || "01031234213",
    bundleStatus: item.bundleStatus || "N",
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
        <Checkbox
          id="reviewId"
          onClick={(value) => {
            console.log(value);
          }}
        />
      </span>
      <span>
        <button
          className="admin_btn basic_s solid"
          // onClick={onDeleteItemHandler}
          // data-apiurl={DATA.apiurl.delete}
        >
          상세보기
        </button>
      </span>
      <span>
        <em className={"text-transform-ellipsis"}>{DATA.orderId}</em>
      </span>
      <span>
        <em className={"text-transform-ellipsis"}>{DATA.pruductId}</em>
      </span>
      <span>
        <em className={"text-transform-ellipsis"}>
          {DATA.orderStatus} {DATA.orderDate}
        </em>
      </span>
      <span>{DATA.buyerId}</span>
      <span>
        {DATA.buyerName} {DATA.buyerPhone}
      </span>
      <span>
        {DATA.recipientName} {DATA.recipientPhone}
      </span>
      <span>{DATA.bundleStatus}</span>
    </li>
  );
};
