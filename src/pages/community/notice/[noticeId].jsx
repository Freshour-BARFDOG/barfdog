import React, { useEffect, useState } from 'react';
import MetaTitle from '@src/components/atoms/MetaTitle';
import Wrapper from '/src/components/common/Wrapper';
import Layout from '/src/components/common/Layout';
import s from './[noticeId].module.scss';
import Image from 'next/image';
import { getData } from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import Link from 'next/link';
import transformDate from '/util/func/transformDate';
import {useRouter} from "next/router";
import {itemExposureType} from "../../../../store/TYPE/itemExposureType";
import 'react-quill/dist/quill.snow.css';

export default function NoticePostPage({ noticeId }) {
  const router = useRouter();
  const [curPageId, setCurPageId] = useState( Number(noticeId ));
  const [isLoading, setIsLoading] = useState({});
  const [itemInfo, setItemInfo] = useState({});
  const [pageInfo, setPageInfo] = useState({});
  
  
  const onChangePageId = (e)=>{
    const endPointIndexOnPath = 3;
    const targetPageId = Number(e.currentTarget.dataset.pageId);
    const curPath = router.asPath;
    router.query = targetPageId;
    const path = curPath.split('/')
    const newPath = path.map((p,index)=>index === endPointIndexOnPath ? targetPageId : p).join('/');
    router.push(newPath);
    setCurPageId(targetPageId)
  }
  
  useEffect(() => {
    const getFormValuesApiUrl = `/api/notices/${curPageId}`;
    const formValueQuery = 'noticeDto'
    const getIemListApiUrl = `/api/notices`;
    const itemListQuery = 'queryNoticesDtoList';
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
            status: data.status,
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
                <span>{transformDate(pageInfo.cur?.createdDate) || ''}</span>
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
          <section className={`${s.before_after} ani-show-all-child`}>
            <ul className={s.grid_box}>
              <li>
                <p>
                  다음 글
                  <i className={`${s.image} img-wrap`}>
                    <Image
                      priority="false"
                      src={require('/public/img/pages/community/up_arrow.png')}
                      objectFit="contain"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </i>
                </p>
                {pageInfo.next ? (
                  <button type={'button'} onClick={onChangePageId} data-page-id={pageInfo.next.id}>
                    {pageInfo.next.title}
                  </button>
                ) : (
                  <p>다음 글이 없습니다.</p>
                )}
              </li>
              <li>
                <p>
                  이전 글
                  <i className={`${s.image} img-wrap`}>
                    <Image
                      priority="false"
                      src={require('/public/img/pages/community/down_arrow.png')}
                      objectFit="contain"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </i>
                </p>
                {pageInfo.prev ? (
                  <button type={'button'} onClick={onChangePageId} data-page-id={pageInfo.prev.id}>
                    {pageInfo.prev.title}
                  </button>
                ) : (
                  <p>이전 글이 없습니다.</p>
                )}
              </li>
            </ul>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

NoticePostPage.getInitialProps = async ({ query }) => {
  const { noticeId } = query;
  return { noticeId };
};
