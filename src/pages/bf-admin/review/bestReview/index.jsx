import s from './bestReview.module.scss';
import React, { useState, useEffect } from 'react';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import BestReviewList from './BestReviewList';
import axios from 'axios';
import axiosConfig from '/src/pages/api/axios.config';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import {
  Button_EditListOrder,
  Button_InactiveEditListOrder,
} from '/src/components/atoms/Button_EditListOrder';
import {getData, putObjData} from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';

export default function BestReviewPage() {
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [editListOrder, setEditListOrder] = useState(false);

  // console.log(itemList);
  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const getApiUrl = '/api/admin/reviews/best';
        const res = await getData(getApiUrl);
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
  
  // 순서 올리기 버튼==== 해당 녀석은 자기 leakedOrder보다 -1
  // 순서 내리기 버튼 == 해당 녀석은 자기 leakedOrder보다 +1
  // 전체 리스트를 보내긴해야한다.

  const onLeakedOrderUp = async (bestReviewId, targetLeakedOrder) => {
    const changedOrderList = itemList.map((item)=>{
      if(item.leakedOrder === targetLeakedOrder -1){ // 이전 항목은 1단계 순위 내림
        return {id:item.id, leakedOrder: item.leakedOrder + 1}
      } else if(item.leakedOrder === targetLeakedOrder){ // 현재 항목은 1단계 순위 올림
        return {id:item.id, leakedOrder: item.leakedOrder - 1}
      } else {
        return {id:item.id, leakedOrder: item.leakedOrder};
      }
    });
   
    try {
      setIsLoading({leakedOrderChange: true});
      const body ={
        leakedOrderDtoList: changedOrderList
      }
      const apiUrl ='/api/admin/reviews/best/leakedOrder';
      const res = await putObjData(apiUrl, body);
      if(res.done){
        setItemList(changedOrderList);
      }else {
        alert('순서를 변경할 수 없습니다.');
      }
    } catch (err) {
        console.error(err.response);
    }
    setIsLoading({leakedOrderChange: false});
  };

  const onLeakedOrderDown = async( bestReviewId, targetLeakedOrder) => {
    const changedOrderList = itemList.map((item)=>{
      if(item.leakedOrder === targetLeakedOrder + 1){ // 다음 항목은 1단계 순위 올림
        return {id:item.id, leakedOrder: item.leakedOrder - 1}
      } else if(item.leakedOrder === targetLeakedOrder){ // 현재 항목은 1단계 순위 내림
        return {id:item.id, leakedOrder: item.leakedOrder + 1}
      } else {
        return {id:item.id, leakedOrder: item.leakedOrder};
      }
    });
    try {
      setIsLoading({leakedOrderChange: true});
      const body ={
        leakedOrderDtoList: changedOrderList
      }
      const apiUrl ='/api/admin/reviews/best/leakedOrder';
      const res = await putObjData(apiUrl, body);
      if(res.done){
        setItemList(changedOrderList);
      }else {
        alert('순서를 변경할 수 없습니다.');
      }
    } catch (err) {
      console.error(err.response);
    }
    setIsLoading({leakedOrderChange: false});
  };


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
                {isLoading.fetching && <Spinner />}
              </p>
              <div className="controls cont-left">
                <Button_EditListOrder itemList={itemList} setEditListOrder={setEditListOrder} />
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
                  <li className={`${s.table_th}`}>리뷰내용</li>
                  <li className={s.table_th}>평점</li>
                  <li className={s.table_th}>사용자 이름</li>
                  <li className={s.table_th}>사용자 ID</li>
                  <li className={s.table_th}>작성일</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length > 0 ? (
                  <BestReviewList
                    items={itemList}
                    setItemList={setItemList}
                    setEditListOrder={setEditListOrder}
                    editListOrder={editListOrder}
                    onLeakedOrderUp={onLeakedOrderUp}
                    onLeakedOrderDown={onLeakedOrderDown}
                  />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
              </div>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

const DUMMY_RESPONSE = {
  data: {
    _embedded: {
      queryAdminBestReviewsDtoList: [
        {
          id: 11583,
          leakedOrder: 1,
          reviewId: 507,
          title: '상품1',
          star: 1,
          contents: '열글자 이상의 내용 1',
          createdDate: '2022-07-25',
          name: '관리자',
          email: 'admin@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/507',
            },
            delete_best_review: {
              href: 'http://localhost:8080/api/admin/reviews/11583/best',
            },
          },
        },
        {
          id: 11587,
          leakedOrder: 2,
          reviewId: 508,
          title: '상품1',
          star: 2,
          contents: '열글자 이상의 내용 2',
          createdDate: '2022-07-25',
          name: '관리자',
          email: 'admin@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/508',
            },
            delete_best_review: {
              href: 'http://localhost:8080/api/admin/reviews/11587/best',
            },
          },
        },
        {
          id: 11591,
          leakedOrder: 3,
          reviewId: 509,
          title: '상품1',
          star: 3,
          contents: '열글자 이상의 내용 3',
          createdDate: '2022-07-25',
          name: '관리자',
          email: 'admin@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/509',
            },
            delete_best_review: {
              href: 'http://localhost:8080/api/admin/reviews/11591/best',
            },
          },
        },
        {
          id: 11595,
          leakedOrder: 4,
          reviewId: 510,
          title: '상품1',
          star: 4,
          contents: '열글자 이상의 내용 4',
          createdDate: '2022-07-25',
          name: '관리자',
          email: 'admin@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/510',
            },
            delete_best_review: {
              href: 'http://localhost:8080/api/admin/reviews/11595/best',
            },
          },
        },
        {
          id: 11599,
          leakedOrder: 5,
          reviewId: 511,
          title: '상품1',
          star: 0,
          contents: '열글자 이상의 내용 5',
          createdDate: '2022-07-25',
          name: '관리자',
          email: 'admin@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/511',
            },
            delete_best_review: {
              href: 'http://localhost:8080/api/admin/reviews/11599/best',
            },
          },
        },
        {
          id: 11555,
          leakedOrder: 6,
          reviewId: 502,
          title: '구독 상품',
          star: 3,
          contents: '열글자 이상의 구독 리뷰6',
          createdDate: '2022-08-18',
          name: '김회원',
          email: 'user@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/502',
            },
            delete_best_review: {
              href: 'http://localhost:8080/api/admin/reviews/11555/best',
            },
          },
        },
        {
          id: 11561,
          leakedOrder: 7,
          reviewId: 503,
          title: '구독 상품',
          star: 3,
          contents: '열글자 이상의 구독 리뷰7',
          createdDate: '2022-08-17',
          name: '김회원',
          email: 'user@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/503',
            },
            delete_best_review: {
              href: 'http://localhost:8080/api/admin/reviews/11561/best',
            },
          },
        },
        {
          id: 11567,
          leakedOrder: 8,
          reviewId: 504,
          title: '구독 상품',
          star: 3,
          contents: '열글자 이상의 구독 리뷰8',
          createdDate: '2022-08-16',
          name: '김회원',
          email: 'user@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/504',
            },
            delete_best_review: {
              href: 'http://localhost:8080/api/admin/reviews/11567/best',
            },
          },
        },
        {
          id: 11573,
          leakedOrder: 9,
          reviewId: 505,
          title: '구독 상품',
          star: 3,
          contents: '열글자 이상의 구독 리뷰9',
          createdDate: '2022-08-15',
          name: '김회원',
          email: 'user@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/505',
            },
            delete_best_review: {
              href: 'http://localhost:8080/api/admin/reviews/11573/best',
            },
          },
        },
        {
          id: 11579,
          leakedOrder: 10,
          reviewId: 506,
          title: '구독 상품',
          star: 3,
          contents: '열글자 이상의 구독 리뷰10',
          createdDate: '2022-08-14',
          name: '김회원',
          email: 'user@gmail.com',
          _links: {
            query_review: {
              href: 'http://localhost:8080/api/admin/reviews/506',
            },
            delete_best_review: {
              href: 'http://localhost:8080/api/admin/reviews/11579/best',
            },
          },
        },
      ],
    },
    _links: {
      self: {
        href: 'http://localhost:8080/api/admin/reviews/best',
      },
      update_leakedOrder: {
        href: 'http://localhost:8080/api/admin/reviews/leakedOrder',
      },
      profile: {
        href: '/docs/index.html#resources-admin-query-best-reviews',
      },
    },
  },
};
