import s from './bestReview.module.scss';
import Ascend from '/public/img/icon/btn_ascend.svg';
import Descend from '/public/img/icon/btn_descend.svg';
import getElemIdx from '/util/func/getElemIdx.js';
import changeArrayOrder from '/util/func/changeArrayOrder';
import { deleteData } from '/src/pages/api/reqData';
import transformDate from '/util/func/transformDate';

export default function BestReviewList({
  items,
  editListOrder,
  onLeakedOrderUp,
  onLeakedOrderDown,
}) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item) => (
        <SortableItem
          key={`item-${item.id}`}
          index={item.id}
          item={item}
          onLeakedOrderUp={onLeakedOrderUp}
          onLeakedOrderDown={onLeakedOrderDown}
          editListOrder={editListOrder}
        />
      ))}
    </ul>
  );
}

const SortableItem = ({
  item,
  sortableItemRef,
  onLeakedOrderUp,
  onLeakedOrderDown,
  editListOrder,
}) => {
  const DATA = {
    id: item.id, // 베스트리뷰 id
    leakedOrder: item.leakedOrder, // 노출 순서
    reviewId: item.reviewId, // 리뷰 id
    title: item.title, // 상품명
    contents: item.contents, // 리뷰 내용
    star: item.star,
    name: item.name, // 리뷰 작성자 이름
    email: item.email, // 작성자 아이디
    createdDate: transformDate(item.createdDate) || '-', // 리뷰 등록일자
    apiurl: {
      delete: item._links?.delete_best_review.href,
    },
  };

  const onDeleteItem = async (e) => {
    const apiURL = e.currentTarget.dataset.apiurl;
    if (confirm(`선택된 회원(${item.name || ''})님의 베스트 리뷰를 정말 삭제하시겠습니까?`)) {
      const res = await deleteData(apiURL);
      if (res.status === 200 || res.status === 201) {
        window.location.reload();
      } else {
        alert('삭제할 수 없습니다. 새로고침 후 , 다시 시도해보세요.');
      }
    }
  };

  const SortHandle = ({ apiurl }) => {
    const onOrderUpHandler = (e) => {
      // param: Best 리뷰의 id / 변경 시킬 노출 순서
      const target = e.currentTarget.closest('li');
      const targetViewIdx = getElemIdx(target);
      const apiURL = e.currentTarget.dataset.apiurl;
      const newItemList = changeArrayOrder(items, targetViewIdx, -1);
      if (newItemList) {
        onLeakedOrderUp(apiURL);
      }
    };

    const onOrderDownHandler = (e) => {
      const target = e.currentTarget.closest('li');
      const targetViewIdx = getElemIdx(target);
      const apiURL = e.currentTarget.dataset.apiurl;
      const newItemList = changeArrayOrder(items, targetViewIdx, +1);
      if (newItemList) {
        onLeakedOrderDown(apiURL);
      }
    };

    return (
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
  };

  return (
    <li
      className={s.item}
      key={`item-${DATA.id}`}
      ref={sortableItemRef}
      data-idx={DATA.id}
      data-leaked-order={DATA.leakedOrder}
    >
      {editListOrder ? <SortHandle apiurl={DATA.apiurl} /> : <span>{DATA.leakedOrder}</span>}
      <span>{DATA.reviewId}</span>
      <span>{DATA.title}</span>
      <span>
        <p className={'overflow-x-scroll'}>{DATA.contents}</p>
      </span>
      <span>{DATA.star}</span>
      <span>{DATA.name}</span>
      <span>{DATA.email}</span>
      <span>{DATA.createdDate}</span>
      <span>
        <button
          className="admin_btn basic_s solid"
          onClick={onDeleteItem}
          data-apiurl={DATA.apiurl.delete}
        >
          삭제
        </button>
      </span>
    </li>
  );
};
