import React, { useEffect, useState } from 'react';
import s from './[eventId].module.scss';
import MetaTitle from '@src/components/atoms/MetaTitle';
import Wrapper from '/src/components/common/Wrapper';
import Layout from '/src/components/common/Layout';
import { useRouter } from 'next/router';
import { getData } from '/src/pages/api/reqData';
import transformDate from '/util/func/transformDate';
import Spinner from '/src/components/atoms/Spinner';
import { MoveToNextPrevPage } from '/src/components/common/MoveToNextPrevPage';

export default function EventPostPage({ eventId }) {
  const router = useRouter();
  const [curPageId, setCurPageId] = useState(Number(eventId));
  const [isLoading, setIsLoading] = useState({});
  const [itemInfo, setItemInfo] = useState({});
  const [pageInfo, setPageInfo] = useState({});
  console.log(itemInfo);

  useEffect(() => {
    const getFormValuesApiUrl = `/api/events/${curPageId}`;
    const formValueQuery = 'eventDto';
    const getIemListApiUrl = `/api/events`;
    const itemListQuery = 'queryEventsDtoList';
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
          const data = res.data[formValueQuery];
          DATA = {
            id: data.id,
            title: data.title,
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
      <MetaTitle title="이벤트" />
      <Layout>
        <Wrapper className={'ani-show-all-child'}>
          <section className={s.title_box}>
            <div className={s.text}>
              {itemInfo.title}
              {isLoading.fetching && <Spinner />}
            </div>

            <div className={s.title_date}>등록일 : {itemInfo.createdDate}</div>
          </section>
          <section className={s.picture_box}>
            <div className={s.picture}>
              {/*<Image*/}
              {/*  priority="false"*/}
              {/*  // src={itemInfo.thum}*/}
              {/*  objectFit="contain"*/}
              {/*  layout="fill"*/}
              {/*  alt="카드 이미지"*/}
              {/*/>*/}
            </div>
          </section>
          <section className={s.btn_box}>
            <div className={s.btn}>목록 보기</div>
          </section>
          <MoveToNextPrevPage pageInfo={pageInfo} setCurPageId={setCurPageId}/>
        </Wrapper>
      </Layout>
    </>
  );
}



EventPostPage.getInitialProps = async ({ query }) => {
  const { eventId } = query;
  return { eventId };
};





