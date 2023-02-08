import React, {useState} from "react";
import s from './bestReview.module.scss';
import Ascend from '/public/img/icon/btn_ascend.svg';
import Descend from '/public/img/icon/btn_descend.svg';
import transformDate from '/util/func/transformDate';
import extractPartOfURL from "/util/func/extractPartOfURL";
import Spinner from "/src/components/atoms/Spinner";

export default function BestReviewList ({
                                          items,
                                          onDeleteItem,
                                          isLoading,
                                          editListOrder,
                                          onUpdateLeakedOrder,
}) {
  if ( !items || !items.length ) return;
  
  const lastIndex = items.length;
  return (
    <ul className="table_body">
      {items.map( (item, i) => (
        <SortableItem
          key={`item-${item.id}-${i}`}
          item={item}
          onDeleteItem={onDeleteItem}
          isLoading={isLoading}
          onUpdateLeakedOrder={onUpdateLeakedOrder}
          editListOrder={editListOrder}
          lastIndex={lastIndex}
        />
      ) )}
    </ul>
  );
}

const SortableItem = ({
                        item,
                        sortableItemRef,
                        onDeleteItem,
                        isLoading,
                        onUpdateLeakedOrder,
                        editListOrder,
                        lastIndex
                      }) => {
  
  const [submittedDeleteApi, setSubmittedDeleteApi] = useState( false );
  
  const DATA = {
    id: item.id, // 베스트리뷰 id
    leakedOrder: item.leakedOrder, // 노출 순서
    reviewId: item.reviewId, // 리뷰 id
    title: item.title, // 상품명
    contents: item.contents, // 리뷰 내용
    star: item.star,
    name: item.name, // 리뷰 작성자 이름
    email: item.email, // 작성자 아이디
    createdDate: transformDate( item.createdDate ) || '-', // 리뷰 등록일자 // 필드 중 modifiedDate는 없음
    apiurl: {
      delete: item._links?.delete_best_review.href,
    },
  };
  
  const onDelete = (e) => {
    if ( submittedDeleteApi ) return console.error( "이미 제출된 양식입니다." );
    if ( !confirm( `선택된 회원(${item.name})님의 베스트 리뷰를 삭제하시겠습니까?` ) ) return;
    const apiUrl = e.currentTarget.dataset.apiUrl;
    onDeleteItem( extractPartOfURL( apiUrl ).pathname, DATA.id );
    setSubmittedDeleteApi( true );
  };
  
  
  const SortHandle = () => {
    const onOrderUpHandler = () => {
      const curleakedOrder = item.leakedOrder;
      const bestReviewId = item.id;
      if ( curleakedOrder === 1 ) return console.error( '이미 첫 번째 순서입니다.' );
      onUpdateLeakedOrder( bestReviewId, curleakedOrder, 'up' );
      
    };
    
    const onOrderDownHandler = () => {
      const curleakedOrder = item.leakedOrder;
      const bestReviewId = item.id;
      if ( curleakedOrder === lastIndex ) return console.error( '이미 마지막 순서입니다.' );
      onUpdateLeakedOrder( bestReviewId, curleakedOrder, 'down' );
    };
    
    return (
      <span className={`${s.sortHandle}`}>
        <i
          className="admin_btn"
          animation="show"
          onClick={onOrderUpHandler}
        >
          <Ascend/>
        </i>
        <i
          className="admin_btn"
          animation="show"
          onClick={onOrderDownHandler}
        >
          <Descend/>
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
      {editListOrder ? <SortHandle/> : <span>{DATA.leakedOrder}</span>}
      <span>{DATA.reviewId}</span>
      <span>{DATA.id}</span>
      <span>{DATA.title}</span>
      <span>
        <p className={'overflow-x-scroll'}>{DATA.contents}</p>
      </span>
      <span>{DATA.star}</span>
      <span>{DATA.name}</span>
      <span>{DATA.email}</span>
      <span>{DATA.createdDate}</span>
      <span>
        <button className="admin_btn basic_s solid" onClick={onDelete} data-api-url={DATA.apiurl.delete}>
          {(isLoading?.delete && isLoading.delete[DATA.id]) ? <Spinner style={{color: "white"}}/> : "삭제"}
        </button>
      </span>
    </li>
  );
};
