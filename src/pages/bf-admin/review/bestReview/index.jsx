import s from "./bestReview.module.scss";
import React, { useState, useEffect } from "react";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import BestReviewList from "./BestReviewList";
import axios from "axios";
import axiosConfig from "/src/pages/api/axios.config";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import {
  Button_EditListOrder,
  Button_InactiveEditListOrder,
} from "/src/components/atoms/Button_EditListOrder";
import {getData} from "/src/pages/api/reqData";
import Spinner from "/src/components/atoms/Spinner";


const getApiUrl = '/api/admin/reviews/best';
const dataQuery = 'queryAdminBestReviewsDtoList'

function BestReviewPage() {
  
  
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [editListOrder, setEditListOrder] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getApiUrl);
        console.log(res);
        let itemList = []
        if(res.data._embedded){
          const dataList = res.data._embedded[dataQuery];
          itemList = dataList.map((data) => ({
            label: data.name,
            value: data.id,
          })) ;
        }
        setItemList(itemList);
      } catch (err) {
        console.error('Data Fetching Error: ',err);
      }
    
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
    
  }, []);

  const onLeakedOrderUp = (url) => {
    const data = ""; // ! PutData : 빈값 보내기
    axios
      .put(url, data, axiosConfig())
      .then(() => {
        // getDataWithSettingState("/api/banners/main", setItemList);
      })
      .catch((err) => {
        alert("전송실패: ", err);
      });
  };

  const onLeakedOrderDown = (url) => {
    const data = ""; // ! PutData : 빈값 보내기
    axios
      .put(url, data, axiosConfig())
      .then(() => {
        // getDataWithSettingState("/api/banners/main", setItemList);
      })
      .catch((err) => {
        alert("전송실패: ", err);
      });
  };

  const onDeleteItem = (url) => {
    axios
      .delete(url, axiosConfig())
      .then((res) => {
        console.log(res);
        getDataWithSettingState("/api/banners/main", setItemList);
        setModalMessage("배너가 삭제되었습니다.");
      })
      .catch((err) => {
        setModalMessage("삭제 실패: ", err);
      });
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
                {isLoading.fetching && <Spinner style={{ color: '#fff' }} />}
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
                  <li className={s.table_th}>고유번호</li>
                  <li className={s.table_th}>상품명</li>
                  <li className={`${s.table_th}`}>리뷰내용</li>
                  <li className={s.table_th}>평점</li>
                  <li className={s.table_th}>사용자 이름</li>
                  <li className={s.table_th}>사용자 ID</li>
                  <li className={s.table_th}>작성일</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
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
          {/* inner */}
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default BestReviewPage;
