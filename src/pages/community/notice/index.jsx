import React from 'react';
import MetaTitle from "@src/components/atoms/MetaTitle";
import Wrapper from "/src/components/common/Wrapper";
import Layout from "/src/components/common/Layout";
import Styles from './notice.module.scss'
import Pagination from "@src/components/atoms/Pagination";
import Link from 'next/link';

function NoticeIndexPage() {
  const data = []

  for(let i =0; i < 50; i++ ){
    data.push(i+1)
  }
  data.reverse();

  return (
    <>
      <MetaTitle title="공지사항" />
      <Layout>
        <Wrapper>
          <section className={Styles.title}>
            <p className={Styles.text}>공지사항</p>
          </section>

          <section className={Styles.notice_board_box}>
            <div className={Styles.grid_box}>
              <span>No.</span>
              <p>제목</p>
              <span>등록일</span>
            </div>

            <ul className="cont_list">
              {data.map((item, index) => {
                return (
                  <li key={index}>
                    <Link href="/community/notice/1" passHref>
                      <a>
                        <div className={Styles.content_box}>
                          <span className={Styles.counter_num}>{item}</span>
                          <p>설날 배송 안내</p>
                          <span>2022.01.20</span>
                        </div>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className={Styles.page_no}>
            <Pagination itemCountPerGroup={10} itemTotalCount={100} />
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export default NoticeIndexPage;