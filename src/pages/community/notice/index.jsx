import React, { useEffect, useState } from 'react';
import MetaTitle from '@src/components/atoms/MetaTitle';
import Wrapper from '/src/components/common/Wrapper';
import Layout from '/src/components/common/Layout';
import s from './notice.module.scss';
import Link from 'next/link';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import transformDate from '/util/func/transformDate';




export default function NoticeIndexPage() {
  const getListApiUrl = '/api/notices';
  const apiDataQueryString = 'queryNoticesDtoList';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  // // console.log(itemList);
  return (
    <>
      <MetaTitle title="공지사항" />
      <Layout>
        <Wrapper className={`${s['notice-wrap']}`}>
          <section className={s.title}>
            <p className={s.text}>
              공지사항
              {isLoading.fetching && <Spinner />}
            </p>
          </section>

          <section className={s.notice_board_box}>
            <div className={s.grid_box}>
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
                          <div className={s.content_box}>
                            <span className={s.counter_num}>{item.id}</span>
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
          <div className={s.page_no}>
            <PaginationWithAPI
              apiURL={getListApiUrl}
              size={searchPageSize}
              setItemList={setItemList}
              queryItemList={apiDataQueryString}
              setIsLoading={setIsLoading}
            />
          </div>
        </Wrapper>
      </Layout>
    </>
  );
}
