import React, {useEffect, useState} from 'react';
import s from './blog.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import BannerList from './BlogList';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import AdminBtn_moveToPage from '/src/components/atoms/AdminBtn_moveToPage';
import Modal_AdminRecommendArticle from '/src/components/modal/Modal_AdminRecommendArticle';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import {MirrorTextOnHoverEvent} from "/util/func/MirrorTextOnHoverEvent";

function BlogIndexPage() {
  const pageSize = 10;
  const getListApiUrl = '/api/admin/blogs';
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState({});
  const [activeModal, setActiveModal] = useState(false);
  
  useEffect( () => {
    MirrorTextOnHoverEvent(window);
  }, [itemList] );

  const onShowRecommendArticleModal = async (returnVal) => {
    setActiveModal(returnVal);
  };

  return (
    <>
      <MetaTitle title="블로그 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              블로그 관리
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
            <div className={`${s.cont_viewer}`}>
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
                  ? <BannerList items={itemList} setItemList={setItemList} />
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
    </>
  );
}

export default BlogIndexPage;
