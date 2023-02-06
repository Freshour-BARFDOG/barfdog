import s from './bestReview.module.scss';
import React, {useState, useEffect, useCallback} from 'react';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import BestReviewList from './BestReviewList';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import {
  Button_EditListOrder,
  Button_InactiveEditListOrder,
} from '/src/components/atoms/Button_EditListOrder';
import {getData, putObjData} from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import {MirrorTextOnHoverEvent} from "/util/func/MirrorTextOnHoverEvent";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import {useModalContext} from "/store/modal-context";

export default function BestReviewPage() {
  
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [editListOrder, setEditListOrder] = useState(false);
  
  useEffect( () => {
    MirrorTextOnHoverEvent(window);
  }, [itemList] );
  // console.log(itemList);
  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const getApiUrl = '/api/admin/reviews/best';
        const res = await getData(getApiUrl, 'admin');
        // const res = DUMMY_RESPONSE; // ! TEST
        console.log(res);
        let itemList = [];
        if (res.data._embedded) {
          const DATA = res.data._embedded.queryAdminBestReviewsDtoList;
          itemList = DATA.map((data) => ({
            id: data.id,
            leakedOrder:data.leakedOrder,
            reviewId:data.reviewId,
            title:data.title,
            star:data.star,
            contents:data.contents,
            createdDate:data.createdDate,
            name:data.name,
            email:data.email,
          }));
        }
        setItemList(itemList);
      } catch (err) {
        console.error('Data Fetching Error: ', err);
      }

      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [isLoading.leakedOrderChange]);
  

  const updateLeakedOrderHandler = useCallback(async (bestReviewId, targetLeakedOrder, direction ) => {
    const updatedItemList = itemList.map((item)=>{
      let leakedOrder = item.leakedOrder;
      const targetItem = item.leakedOrder === targetLeakedOrder;
      const upperItem = item.leakedOrder === targetLeakedOrder - 1;
      const lowerItem = item.leakedOrder === targetLeakedOrder + 1;
      if(direction === 'up'){
        if(targetItem){
          leakedOrder = item.leakedOrder - 1;
        } else if(upperItem){
          leakedOrder = item.leakedOrder + 1 ;
        }
      } else if(direction === 'down') {
        if(targetItem){
          leakedOrder = item.leakedOrder + 1;
        } else if(lowerItem){
          leakedOrder = item.leakedOrder - 1 ;
        }
      }
      
      return {
        id: item.id,
        leakedOrder: leakedOrder
      }
    });
   
    try {
      setIsLoading({leakedOrderChange: true});
      const body ={
        leakedOrderDtoList: updatedItemList
      }
      const apiUrl ='/api/admin/reviews/best/leakedOrder';
      const res = await putObjData(apiUrl, body);
      // console.log(res);
      if(res.isDone){
        setItemList(updatedItemList);
      }else {
        mct.alertShow('통신오류: 순서를 변경할 수 없습니다.');
      }
    } catch (err) {
      mct.alertShow( err );
      console.error(err.response);
    } finally {
      setIsLoading({leakedOrderChange: false});
    }
  },[itemList]);

  


  return (
    <>
      <MetaTitle title="베스트리뷰 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">베스트리뷰 관리</h1>
          <div className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                목록
              </p>
              <div className="controls cont-left">
                <Button_EditListOrder itemList={itemList} setEditListOrder={setEditListOrder}  title={isLoading.leakedOrderChange ? <Spinner/> : "순서편집"}/>
                {editListOrder && (
                  <Button_InactiveEditListOrder
                    itemList={itemList}
                    setEditListOrder={setEditListOrder}
                  />
                )}
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>순서</li>
                  <li className={s.table_th}>리뷰ID</li>
                  <li className={s.table_th}>베스트리뷰ID</li>
                  <li className={s.table_th}>상품명</li>
                  <li className={s.table_th}>리뷰내용</li>
                  <li className={s.table_th}>평점</li>
                  <li className={s.table_th}>사용자 이름</li>
                  <li className={s.table_th}>사용자 ID</li>
                  <li className={s.table_th}>작성일</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length
                  ?  <BestReviewList
                    items={itemList}
                    setItemList={setItemList}
                    setEditListOrder={setEditListOrder}
                    editListOrder={editListOrder}
                    onUpdateLeakedOrder={updateLeakedOrderHandler}
                  />
                  : isLoading.fetching
                    ? <AmdinErrorMessage loading={<Spinner />} />
                    : <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                }
              </div>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && <Modal_global_alert background/>}
    </>
  );
}

// const DUMMY_RESPONSE = {
//   data: {
//     _embedded: {
//       queryAdminBestReviewsDtoList: [
//         {
//           id: 11583,
//           leakedOrder: 1,
//           reviewId: 507,
//           title: '상품1',
//           star: 1,
//           contents: '열글자 이상의 내용 1',
//           createdDate: '2022-07-25',
//           name: '관리자',
//           email: 'admin@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/507',
//             },
//             delete_best_review: {
//               href: 'http://localhost:8080/api/admin/reviews/11583/best',
//             },
//           },
//         },
//         {
//           id: 11587,
//           leakedOrder: 2,
//           reviewId: 508,
//           title: '상품1',
//           star: 2,
//           contents: '열글자 이상의 내용 2',
//           createdDate: '2022-07-25',
//           name: '관리자',
//           email: 'admin@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/508',
//             },
//             delete_best_review: {
//               href: 'http://localhost:8080/api/admin/reviews/11587/best',
//             },
//           },
//         },
//         {
//           id: 11591,
//           leakedOrder: 3,
//           reviewId: 509,
//           title: '상품1',
//           star: 3,
//           contents: '열글자 이상의 내용 3',
//           createdDate: '2022-07-25',
//           name: '관리자',
//           email: 'admin@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/509',
//             },
//             delete_best_review: {
//               href: 'http://localhost:8080/api/admin/reviews/11591/best',
//             },
//           },
//         },
//         {
//           id: 11595,
//           leakedOrder: 4,
//           reviewId: 510,
//           title: '상품1',
//           star: 4,
//           contents: '열글자 이상의 내용 4',
//           createdDate: '2022-07-25',
//           name: '관리자',
//           email: 'admin@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/510',
//             },
//             delete_best_review: {
//               href: 'http://localhost:8080/api/admin/reviews/11595/best',
//             },
//           },
//         },
//         {
//           id: 11599,
//           leakedOrder: 5,
//           reviewId: 511,
//           title: '상품1',
//           star: 0,
//           contents: '열글자 이상의 내용 5',
//           createdDate: '2022-07-25',
//           name: '관리자',
//           email: 'admin@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/511',
//             },
//             delete_best_review: {
//               href: 'http://localhost:8080/api/admin/reviews/11599/best',
//             },
//           },
//         },
//         {
//           id: 11555,
//           leakedOrder: 6,
//           reviewId: 502,
//           title: '구독 상품',
//           star: 3,
//           contents: '열글자 이상의 구독 리뷰6',
//           createdDate: '2022-08-18',
//           name: '김회원',
//           email: 'user@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/502',
//             },
//             delete_best_review: {
//               href: 'http://localhost:8080/api/admin/reviews/11555/best',
//             },
//           },
//         },
//         {
//           id: 11561,
//           leakedOrder: 7,
//           reviewId: 503,
//           title: '구독 상품',
//           star: 3,
//           contents: '열글자 이상의 구독 리뷰7',
//           createdDate: '2022-08-17',
//           name: '김회원',
//           email: 'user@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/503',
//             },
//             delete_best_review: {
//               href: 'http://localhost:8080/api/admin/reviews/11561/best',
//             },
//           },
//         },
//         {
//           id: 11567,
//           leakedOrder: 8,
//           reviewId: 504,
//           title: '구독 상품',
//           star: 3,
//           contents: '열글자 이상의 구독 리뷰8',
//           createdDate: '2022-08-16',
//           name: '김회원',
//           email: 'user@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/504',
//             },
//             delete_best_review: {
//               href: 'http://localhost:8080/api/admin/reviews/11567/best',
//             },
//           },
//         },
//         {
//           id: 11573,
//           leakedOrder: 9,
//           reviewId: 505,
//           title: '구독 상품',
//           star: 3,
//           contents: '열글자 이상의 구독 리뷰9',
//           createdDate: '2022-08-15',
//           name: '김회원',
//           email: 'user@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/505',
//             },
//             delete_best_review: {
//               href: 'http://localhost:8080/api/admin/reviews/11573/best',
//             },
//           },
//         },
//         {
//           id: 11579,
//           leakedOrder: 10,
//           reviewId: 506,
//           title: '구독 상품',
//           star: 3,
//           contents: '열글자 이상의 구독 리뷰10',
//           createdDate: '2022-08-14',
//           name: '김회원',
//           email: 'user@gmail.com',
//           _links: {
//             query_review: {
//               href: 'http://localhost:8080/api/admin/reviews/506',
//             },
//             delete_best_review: {
//               href: 'http://localhost:8080/api/admin/reviews/11579/best',
//             },
//           },
//         },
//       ],
//     },
//     _links: {
//       self: {
//         href: 'http://localhost:8080/api/admin/reviews/best',
//       },
//       update_leakedOrder: {
//         href: 'http://localhost:8080/api/admin/reviews/leakedOrder',
//       },
//       profile: {
//         href: '/docs/index.html#resources-admin-query-best-reviews',
//       },
//     },
//   },
// };
