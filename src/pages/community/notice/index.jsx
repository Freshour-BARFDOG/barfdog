import React, { useEffect, useState } from 'react';
import MetaTitle from '@src/components/atoms/MetaTitle';
import Wrapper from '/src/components/common/Wrapper';
import Layout from '/src/components/common/Layout';
import Styles from './notice.module.scss';
import Link from 'next/link';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import transformDate from '/util/func/transformDate';
import s from './[noticeId].module.scss';

//
// "id" : 270,
//   "title" : "공지사항7",
//   "createdDate" : "2022-07-15T16:52:11.942",
//   "_links" : {
//   "query_notice" : {
//     "href" : "http://localhost:8080/api/notices/270"
//   }
//
// const DUMMY_DATA = [
//   {
//     id: 140,
//     title: '공지사항10',
//     createdDate: '2022-07-15T16:51:29.883',
//     status: 'HIDDEN',
//     _links: {
//       query_notice: {
//         href: 'http://localhost:8080/api/admin/notices/140',
//       },
//       update_notice: {
//         href: 'http://localhost:8080/api/admin/notices/140',
//       },
//       delete_notice: {
//         href: 'http://localhost:8080/api/admin/notices/140',
//       },
//     },
//   },
//   {
//     id: 139,
//     title: '공지사항9',
//     createdDate: '2022-07-15T16:51:29.883',
//     status: 'LEAKED',
//     _links: {
//       query_notice: {
//         href: 'http://localhost:8080/api/admin/notices/139',
//       },
//       update_notice: {
//         href: 'http://localhost:8080/api/admin/notices/139',
//       },
//       delete_notice: {
//         href: 'http://localhost:8080/api/admin/notices/139',
//       },
//     },
//   },,
// ];

export default function NoticeIndexPage() {
  const getListApiUrl = '/api/notices';
  const apiDataQueryString = 'queryNoticesDtoList';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [pageData, setPageData] = useState({});
  // console.log(pageData);
  // console.log(itemList);
  return (
    <>
      <MetaTitle title="공지사항" />
      <Layout>
        <Wrapper className={`${Styles['notice-wrap']}`}>
          <section className={Styles.title}>
            <p className={Styles.text}>
              공지사항
              {isLoading.fetching && <Spinner />}
            </p>
          </section>

          <section className={Styles.notice_board_box}>
            <div className={Styles.grid_box}>
              <span>No.</span>
              <p>제목</p>
              <span>등록일</span>
            </div>
            <ul className="cont_list">
              {itemList.length > 0 ? (
                itemList.map((item, index) => {
                  return (
                    <li key={`notice-${item.id}-${index}`}>
                      <Link href={`/community/notice/${item.id}`} passHref>
                        <a>
                          <div className={Styles.content_box}>
                            <span className={Styles.counter_num}>{item.id}</span>
                            <p>{item.title}</p>
                            <span>{transformDate(item.createdDate) || '-'}</span>
                          </div>
                        </a>
                      </Link>
                    </li>
                  );
                })
              ) : (
                <EmptyContMessage message={'등록된 공지사항이 없습니다.'} />
              )}
            </ul>
          </section>
          <div className={Styles.page_no}>
            <PaginationWithAPI
              apiURL={getListApiUrl}
              size={searchPageSize}
              setItemList={setItemList}
              queryItemList={apiDataQueryString}
              setIsLoading={setIsLoading}
              setPageData={setPageData}
            />
          </div>
        </Wrapper>
      </Layout>
    </>
  );
}
