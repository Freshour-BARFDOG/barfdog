import s from "./bestReview.module.scss";
import Ascend from '/public/img/icon/btn_ascend.svg';
import Descend from '/public/img/icon/btn_descend.svg';
import getElemIdx from "@util/func/getElemIdx.js";
import changeArrayOrder from '@util/func/changeArrayOrder'








export default function BestReviewList({
  items,
  editListOrder,
  onLeakedOrderUp,
  onLeakedOrderDown,
  onDeleteItem,
}) {
  if (!items || !items.length) return;


  const onOrderUpHandler = (e) => {
    const target = e.currentTarget.closest("li");
    const targetViewIdx = getElemIdx(target);
    const apiURL = e.currentTarget.dataset.apiurl;
    const newItemList = changeArrayOrder(items, targetViewIdx, -1);
    if (newItemList) {
      onLeakedOrderUp(apiURL);
    }
  };

  const onOrderDownHandler = (e) => {
    const target = e.currentTarget.closest("li");
    const targetViewIdx = getElemIdx(target);
    const apiURL = e.currentTarget.dataset.apiurl;
    const newItemList = changeArrayOrder(items, targetViewIdx, +1);
    if (newItemList) {
      onLeakedOrderDown(apiURL);
    }
  };

  const onDeleteItemHandler = (e) => {
    const target = e.currentTarget.closest("li");
    const targetViewIdx = getElemIdx(target);
    const apiURL = e.currentTarget.dataset.apiurl;
    const bannerName = items[targetViewIdx]?.name;
    if (confirm(`선택된 배너(${bannerName})를 정말 삭제하시겠습니까?`)) {
      onDeleteItem(apiURL);
    }
  };

  const transformDate = (d) => {
    const yy = d.split("-")[0];
    const mm = d.split("-")[1];
    const dd = d.split("-")[2].split("T")[0];
    return `${yy}-${mm}-${dd}`;
  };

  const SortHandle = ({ apiurl }) => (
    <span className={`${s.sortHandle}`}>
      <i
        className="admin_btn"
        animation="show"
        onClick={onOrderUpHandler}
        data-apiurl={apiurl.orderUp}
      >
        <Ascend />
      </i>
      <i
        className="admin_btn"
        animation="show"
        onClick={onOrderDownHandler}
        data-apiurl={apiurl.orderDown}
      >
        <Descend />
      </i>
    </span>
  );



  const SortableItem = ({ item, sortableItemRef }) => {
    const DATA = {
      id: item.id || "0 이거때문에 console에서 key오류나는거다.", // ! -----
      leakedOrder: item.leakedOrder || "0",
      reviewId: item.id || "15401234",
      itemName: item.itemName || "상품명",
      innerText: item.innerText || "텍스트내용텍스트내용텍스트내용텍스트내용",
      rating: item.rating || "3",
      userName: item.userName || "김바프",
      userId: item.userId || "barf",
      exp_target: item.targets,
      reg_date:
        "22-02-22" ||
        transformDate(item.createdDate ? item.createdDate : item.modifiedDate),
      // url: item._links.thumbnail_pc.href,
      apiurl: {
        // self: item._links.query_banner.href,
        // orderUp: item._links.mainBanner_leakedOrder_up.href,
        // orderDown: item._links.mainBanner_leakedOrder_down.href,
        // delete: item._links.delete_banner.href,
      },
    };
   

    return (
      <li
        className={s.item}
        key={`item-${DATA.id}`}
        ref={sortableItemRef}
        data-idx={DATA.id}
        data-leaked-order={DATA.leakedOrder}
      >
        {editListOrder ? (
          <SortHandle apiurl={DATA.apiurl} />
        ) : (
          <span>{DATA.leakedOrder}</span>
        )}
        <span>{DATA.reviewId}</span>
        <span>{DATA.itemName}</span>
        <span>
          <p className={"overflow-x-scroll"}>{DATA.innerText}</p>
        </span>
        <span>{DATA.rating}</span>
        <span>{DATA.userName}</span>
        <span>{DATA.userId}</span>
        <span>{DATA.reg_date}</span>
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

  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <SortableItem key={`item-${item.id}`} index={item.id} item={item} />
      ))}
    </ul>
  );
}