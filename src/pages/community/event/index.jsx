import React, { useState } from 'react';
import MetaTitle from '@src/components/atoms/MetaTitle';
import Wrapper from '/src/components/common/Wrapper';
import Layout from '/src/components/common/Layout';
import s from './event.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import Spinner from '/src/components/atoms/Spinner';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';

function EventIndexPage() {
  const getListApiUrl = '/api/events';
  const apiDataQueryString = 'queryEventsDtoList';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [pageData, setPageData] = useState({});

  console.log(itemList);

  return (
    <>
      <MetaTitle title="이벤트" />
      <Layout>
        <Wrapper className={`${s['event-wrap']}`}>
          <section className={s.title}>
            <p>
              진행중인 이벤트
              {isLoading.fetching && <Spinner />}
            </p>
          </section>

          <section className={s.event_box}>
            <ul className="cont_list">
              {itemList.length > 0 ? (
                itemList.map((item, index) => {
                  return (
                    <li key={`event-${item.id}-${index}`}>
                      <Link href={`/community/event/${item.id}`} passHref>
                        <a>
                          <Image
                            priority={item.id < 3}
                            src={item.thumbnailUrl}
                            objectFit="cover"
                            layout="fill"
                            alt="카드 이미지"
                          />
                        </a>
                      </Link>
                    </li>
                  );
                })
              ) : (
                <EmptyContMessage message={'등록된 이벤트가 없습니다.'} />
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
              setPageData={setPageData}
            />
          </div>
        </Wrapper>
      </Layout>
    </>
  );
}

export default EventIndexPage;
