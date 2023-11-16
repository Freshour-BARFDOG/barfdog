import React, {useEffect, useState} from 'react';
import s from './blog.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import BlogList from './BlogList';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import AdminBtn_moveToPage from '/src/components/atoms/AdminBtn_moveToPage';
import Modal_AdminRecommendArticle from '/src/components/modal/Modal_AdminRecommendArticle';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import {MirrorTextOnHoverEvent} from "/util/func/MirrorTextOnHoverEvent";
import {useModalContext} from "/store/modal-context";
import Modal_global_alert from "../../../../components/modal/Modal_global_alert";
import {deleteData} from "../../../api/reqData";

function BlogIndexPage() {
  
  const pageSize = 10;
  const getListApiUrl = '/api/admin/blogs';
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState({});
  const [activeModal, setActiveModal] = useState(false);
  
  useEffect( () => {
    MirrorTextOnHoverEvent(window);
  }, [itemList] );

  const onShowRecommendArticleModal = async (returnVal) => {
    setActiveModal(returnVal);
  };
  
  const onDeleteItem = async (apiUrl, targetId) => {
    // console.log(apiUrl, targetId);
    try {
      setIsLoading(prevState => ({
        ...prevState,
        delete:{
          [targetId]: true
        }
      }));
      const res = await deleteData(apiUrl);
      // console.log(res);
      if(res.isDone){
        mct.alertShow( "게시글을 삭제하였습니다.", onSuccessCallback );
      } else {
        const serverErrorMessage =res.error;
        mct.alertShow(serverErrorMessage || '삭제에 실패하였습니다.');
      }
    } catch (err) {
      mct.alertShow('삭제 요청 중 에러가 발생하였습니다.');
      console.error(err);
    } finally {
      setIsLoading(prevState => ({
        ...prevState,
        delete:{
          [targetId]: false
        }
      }));
    }
  };
  const onSuccessCallback = () => {
    window.location.reload();
  };

  return (
    <>
      <MetaTitle title="블로그" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              블로그
            </h1>
          </div>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
              <div className="cont-right">
                <AdminBtn_moveToPage
                  text="블로그 작성"
                  href="/bf-admin/community/blog/create"
                  className="admin_btn confirm_m solid"
                  animation="show"
                />
              </div>
              <div className="controls cont-left">
                <button
                  type="button"
                  id="set_order"
                  className="admin_btn line basic_m autoWidth"
                  onClick={onShowRecommendArticleModal}
                >
                  추천 아티클
                </button>
              </div>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>글번호</li>
                  <li className={s.table_th}>제목</li>
                  <li className={s.table_th}>작성일</li>
                  <li className={s.table_th}>노출여부</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length
                  ? <BlogList items={itemList}  onDeleteItem={onDeleteItem} isLoading={isLoading}/>
                  : isLoading.fetching
                    ? <AmdinErrorMessage loading={<Spinner />} />
                    : <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                }
              </div>
            </div>
            <div className={s['pagination-section']}>
              <PaginationWithAPI
                apiURL={getListApiUrl}
                size={pageSize}
                theme={'square'}
                setItemList={setItemList}
                queryItemList={'queryBlogsAdminDtoList'}
                setIsLoading={setIsLoading}
              />
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
      {activeModal && <Modal_AdminRecommendArticle setActiveModal={setActiveModal} />}
      {hasAlert && <Modal_global_alert background />}
    </>
  );
}

export default BlogIndexPage;
