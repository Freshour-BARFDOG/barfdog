import React, {useEffect, useState} from 'react';
import s from "./[blogId].module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Wrapper from "/src/components/common/Wrapper";
import Layout from "/src/components/common/Layout";
import {getData} from "/src/pages/api/reqData";
import {MoveToNextPrevPage} from "/src/components/common/MoveToNextPrevPage";
import transformDate from "/util/func/transformDate";
import Spinner from "/src/components/atoms/Spinner";
import 'react-quill/dist/quill.snow.css';



export default function BlogPostPage({blogId}) {
  // const curPageCategory  = router.query.category;
  const [curPageId, setCurPageId] = useState( Number(blogId ));
  const [isLoading, setIsLoading] = useState({});
  const [itemInfo, setItemInfo] = useState({});
  const [pageInfo, setPageInfo] = useState({});
  
  
  useEffect(() => {
    const getFormValuesApiUrl = `/api/blogs/${curPageId}`;
    const getIemListApiUrl = `/api/blogs`;
    const itemListQuery = 'queryBlogsDtoList';
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getFormValuesApiUrl);
        console.log(res);
        let DATA;
        if (res.data) {
          const data = res.data;
          DATA = {
            id: data.id,
            title: data.title,
            contents: data.contents,
            createdDate: transformDate(data.createdDate),
          };
          setItemInfo(DATA);
        }
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
      <MetaTitle title={`블로그`} />
      <Layout>
        <Wrapper>
          <section className={s.title_box}>
            <div className={s.text}>
              {itemInfo.title} {isLoading.fetching && <Spinner />}
            </div>

            <div className={s.title_date}>{itemInfo?.createdDate}</div>
          </section>

          <section className={s.line_box}>
            <hr className={s.line} />
          </section>

          <section className={s.content_box}>
            <div
              className={`${s.content_text} view ql-editor`}
              dangerouslySetInnerHTML={{ __html: itemInfo.contents }}
            ></div>
          </section>
          <section className={s.line_box2}>
            <hr className={s.line} />
          </section>

          <section className={s.btn_box}>
            <Link href={'/community/blog'} passHref>
              <a className={s.btn}>목록 보기</a>
            </Link>
          </section>
          <MoveToNextPrevPage pageInfo={pageInfo} setCurPageId={setCurPageId} borderColor={'var(--color-line-03)'}/>
        </Wrapper>
      </Layout>
    </>
  );
}



BlogPostPage.getInitialProps = async ({ query }) => {
  const { blogId } = query;
  return { blogId };
};

