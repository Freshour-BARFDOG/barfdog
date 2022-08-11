import React, { useEffect, useState } from 'react';
import MetaTitle from '@src/components/atoms/MetaTitle';
import Wrapper from '/src/components/common/Wrapper';
import Layout from '/src/components/common/Layout';
import s from './[noticeId].module.scss';
import { getData } from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import Link from 'next/link';
import transformDate from '/util/func/transformDate';
import {useRouter} from "next/router";
import 'react-quill/dist/quill.snow.css';
import {MoveToNextPrevPage} from "/src/components/common/MoveToNextPrevPage";


export default function NoticePostPage({ noticeId }) {
  const [curPageId, setCurPageId] = useState( Number(noticeId ));
  const [isLoading, setIsLoading] = useState({});
  const [itemInfo, setItemInfo] = useState({});
  const [pageInfo, setPageInfo] = useState({});
  
  useEffect(() => {
    const getFormValuesApiUrl = `/api/notices/${curPageId}`;
    const formValueQuery = 'noticeDto'
    const getIemListApiUrl = `/api/notices`;
    const itemListQuery = 'queryNoticesDtoList';
    console.log(getFormValuesApiUrl);
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getFormValuesApiUrl);

        let DATA;
        if (res.data) {
          const data = res.data[formValueQuery];
          DATA = {
            id: data.id,
            title: data.title,
            contents: data.contents,
          };
          setItemInfo(DATA);
        }
        console.log(res);
      } catch (err) {
        console.error('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();

    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getIemListApiUrl);
        console.log(res);
        if (res.data) {
          const itemListInfo = res.data._embedded[itemListQuery];
          let curItemIndex;
          const tempItemList = itemListInfo.reverse(); // 배열인덱스를 과거순을 정렬
          for (let i = 0; i < tempItemList.length; i++) {
            if (tempItemList[i].id === curPageId) {
              curItemIndex = i;
              break;
            }
          }
          const prevItemListInfo = tempItemList[curItemIndex - 1];
          const curItemListInfo = tempItemList[curItemIndex];
          const nextItemListInfo = tempItemList[curItemIndex + 1];
          setPageInfo({
            prev: prevItemListInfo,
            cur: curItemListInfo,
            next: nextItemListInfo,
          });
          // console.log(prevItemListInfo, nextItemListInfo)
        }
      } catch (err) {
        console.error('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [curPageId]);

  return (
    <>
      <MetaTitle title={`공지사항`} />
      <Layout>
        <Wrapper>
          <section className={s.title}>
            <div className={s.text}>공지사항 {isLoading.fetching && <Spinner />}</div>
          </section>
          <section className={`${s.announcement} ani-show-all-child`}>
            <div className={s.content}>
              <div className={s.flex_box}>
                <p>제목</p>
                <span>{itemInfo.title}</span>
                <p>등록일</p>
                <span>{pageInfo?.cur && transformDate(pageInfo.cur.createdDate)}</span>
              </div>
              <div
                className={`${s.content_text} view ql-editor`}
                dangerouslySetInnerHTML={{ __html: itemInfo.contents }}
              ></div>
            </div>
          </section>
          <section className={s.list_gotosee}>
            <Link href={'/community/notice'} passHref>
              <a className={s.btn}>목록 보기</a>
            </Link>
          </section>
          <MoveToNextPrevPage pageInfo={pageInfo} setCurPageId={setCurPageId} borderColor={'var(--color-line-01)'}/>
        </Wrapper>
      </Layout>
    </>
  );
}

// CF) _app.jsx SSR 적용 후 , getinitialProps에서 query가져올 수 없음
// NoticePostPage.getInitialProps = async (ctx) => {
//   console.log(ctx)
//   const { noticeId } = query;
//   return { noticeId };
// };



export async function getServerSideProps({ query }) {
  const { noticeId } = query;

  return { props: { noticeId } };
}
