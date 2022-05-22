import s from "../adminReview.module.scss";
import getElemIdx from "@util/func/getElemIdx";
import Checkbox from "@src/components/atoms/Checkbox";
import transformDate from "@util/func/transformDate";







export default function BestReviewList({
  items,
  onDeleteItem,
}) {
  if (!items || !items.length) return;



  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <SortableItem key={`item-${item.id}`} index={item.id} item={item} />
      ))}
    </ul>
  );
}






  const SortableItem = ({ item, sortableItemRef }) => {
    const DATA = {
      id: item.id || '0',
      status: item.status || "처리 중",
      itemName: item.itemName || "상품명상품명상품명상품명상품명",
      innerText: item.innerText || "텍스트내용텍스트내용텍스트내용텍스트내용",
      rating: item.rating || "4",
      userName: item.userName || "김바프",
      userId: item.userId || "barf",
      reg_date: transformDate(item.createdDate ? item.createdDate : '22-02-22'),
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

        <span>{DATA.id}</span>
        <span>{DATA.status}</span>
        <span>
          <em className={"text-transform-ellipsis"}>{DATA.itemName}</em>
        </span>
        <span>
          <button
            data-review-id={DATA.id}
            className={"text-transform-ellipsis btn_link"}
          >
            {DATA.innerText}
          </button>
        </span>
        <span>{DATA.rating}</span>
        <span>{DATA.userName}</span>
        <span>{DATA.userId}</span>
        <span>{DATA.reg_date}</span>
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
