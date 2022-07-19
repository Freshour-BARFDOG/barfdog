import React, { useEffect, useState } from 'react';
import Wrapper from '/src/components/common/Wrapper';
import Layout from '/src/components/common/Layout';
import s from './blog.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Spinner from '/src/components/atoms/Spinner';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import transformDate from '/util/func/transformDate';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import { blogCategoryType } from '/store/TYPE/blogCategoryType';
import { filter_HTMLStrings } from '/util/func/filter_HTMLStrings';
import { useRouter } from 'next/router';
import { getData } from '/src/pages/api/reqData';
import sorting from '/util/func/sorting';

export default function BlogIndexPage() {
  const router = useRouter();
  const searchPageSize = 10;
  const getListApiUrl = '/api/blogs';
  const apiDataQueryString = 'queryBlogsDtoList';
  const getArticleListApiUrl = `/api/blogs/articles`;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [originItemList, setOriginItemList] = useState([]);
  // const [isInitialized, setIsInitialized] = useState( false );
  const [searchApiUrl, setSearchApiUrl] = useState(getListApiUrl);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [articles, setArticles] = useState([]);

  console.log(articles);

  // useEffect( () => {
  // ! 카테고리로 api 요청하기 전 Ver.
  //   if(!isInitialized && itemList.length > 0){
  //
  //     setOriginItemList(itemList)
  //     setIsInitialized(true);
  //   }
  // }, [itemList] );

  const onFilteringItemList = (e) => {
    const button = e.currentTarget;
    const thiscategory = button.dataset.filterCategory;
    setSelectedCategory(thiscategory);
    const endPoint = thiscategory === 'ALL' ? '' : thiscategory.toLowerCase();
    const url = `${getListApiUrl}/${endPoint}`;
    setSearchApiUrl(url);

    // Change query
    const query = router.query;
    const allQuery = { ...query, category: thiscategory };
    let newQuery = [];
    for (const key in allQuery) {
      const val = allQuery[key];
      const tempObj = `${key}=${val}`;
      newQuery.push(tempObj);
    }
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}?${newQuery.join('&')}`,
    );

    //// ! 카테고리로 api 요청하기 전 Ver.
    // UI Rendering
    // const filtredItemList = originItemList.filter((list)=>{
    //   if(thiscategory === 'ALL'){
    //     return list;
    //   } else{
    //     return list.category === thiscategory && list;
    //   }
    // });
    // setItemList(filtredItemList)
  };

  useEffect(() => {
    (async () => {
      const dataQuery = 'articlesDtoList';
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getArticleListApiUrl);
        console.log(res);
        let DATAList;
        if (res.data._embedded) {
          const tempDataList = res.data._embedded[dataQuery];
          DATAList = tempDataList.map((data) => ({
            id: data.id,
            number: data.number,
            url: data.url,
            category: data.category,
            title: data.title,
            createdDate: transformDate(data.createdDate),
          }));
        }
        setArticles(DATAList);
      } catch (err) {
        console.error(err);
        alert('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, []);

  return (
    <>
      <MetaTitle title="블로그" />
      <Layout>
        <Wrapper>
          <section className={s.title}>
            <div className={s.text1}>
              블로그
              {isLoading.fetching && <Spinner />}
            </div>
            <div className={s.text2}>
              바프독과 반려견의 모든 정보를 <br />
              이곳에서 확인하세요
            </div>
          </section>
        </Wrapper>

        <section className={s.article_box}>
          <Wrapper className={'ani-show-all-child'} bgColor={'#f5f5f5'}>
            <div className={s.article}>
              <p>추천 아티클</p>
              <ul className={s.flex_box}>
                {articles.length > 0 ? (
                  articles.map((atc) => (
                    <li key={`article-${atc.id}`} className={s.box}>
                      <Link href={`/community/blog/${atc.id}`} passHref>
                        <a>
                          <div className={`${s.image} img-wrap`}>
                            <Image
                              priority
                              src={atc.url}
                              objectFit="cover"
                              layout="fill"
                              alt="카드 이미지"
                            />
                          </div>
                          <div className={s.subject}>
                            <p>{atc.category}</p>
                            <div className={s.article_title}>{atc.title}</div>
                            <div className={s.day}>{atc.createdDate}</div>
                          </div>
                        </a>
                      </Link>
                    </li>
                  ))
                ) : (
                  <EmptyContMessage message={'추천아티클이 없습니다.'} />
                )}
              </ul>
            </div>
          </Wrapper>
        </section>

        <Wrapper className={'ani-show-all-child'}>
          <section className={s.menu_box}>
            <ul className={s.menu}>
              <li className={`${selectedCategory === 'ALL' || '' ? s.active : ''}`}>
                <button type={'button'} data-filter-category={'ALL'} onClick={onFilteringItemList}>
                  전체
                </button>
              </li>
              <li className={`${selectedCategory === blogCategoryType.NUTRITION ? s.active : ''}`}>
                <button
                  type={'button'}
                  data-filter-category={blogCategoryType.NUTRITION}
                  onClick={onFilteringItemList}
                >
                  {blogCategoryType.KOR.NUTRITION}
                </button>
              </li>
              <li className={`${selectedCategory === blogCategoryType.HEALTH ? s.active : ''}`}>
                <button
                  type={'button'}
                  data-filter-category={blogCategoryType.HEALTH}
                  onClick={onFilteringItemList}
                >
                  {blogCategoryType.KOR.HEALTH}
                </button>
              </li>
              <li className={`${selectedCategory === blogCategoryType.LIFE ? s.active : ''}`}>
                <button
                  type={'button'}
                  data-filter-category={blogCategoryType.LIFE}
                  onClick={onFilteringItemList}
                >
                  {blogCategoryType.KOR.LIFE}
                </button>
              </li>
            </ul>
          </section>

          <section className={s.content_box}>
            <ul className="cont_list">
              {itemList.length > 0 ? (
                itemList.map((item, index) => {
                  return (
                    <li key={`blog-${item.id}-${index}`}>
                      <Link href={`/community/blog/${item.id}`} passHref>
                        <a>
                          <div className={s.line}>
                            <div className={s.flex_box}>
                              <div className={s.left_box}>
                                <p>{blogCategoryType.KOR[item.category]}</p>
                                <div className={s.article_title}>{item.title}</div>
                                <div
                                  className={`${s.text} ${s['HTML-container']}`}
                                  dangerouslySetInnerHTML={{
                                    __html: filter_contentImages(item.contents),
                                  }}
                                ></div>
                                <div className={s.day}>{transformDate(item.createdDate)}</div>
                              </div>
                              <div className={s.right_box}>
                                <div className={`${s.image} img-wrap`}>
                                  <Image
                                    src={item.url}
                                    objectFit="cover"
                                    layout="fill"
                                    alt="카드 이미지"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </li>
                  );
                })
              ) : (
                <EmptyContMessage message={'등록된 블로그가 없습니다.'} />
              )}
            </ul>
          </section>
          <div className={s.pagination_box}>
            <PaginationWithAPI
              apiURL={searchApiUrl}
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

const filter_contentImages = (innerHTML) => {
  if (typeof innerHTML !== 'string') {
    console.error('* required string type of HTML value');
    return innerHTML;
  }
  let filteredHTML = innerHTML;
  filteredHTML = filter_HTMLStrings(filteredHTML, ' class="', '"'); // filter Class
  filteredHTML = filter_HTMLStrings(filteredHTML, ' style="', '"'); // filter style
  filteredHTML = filter_HTMLStrings(filteredHTML, '<img src="', '>'); // filter Image
  return filteredHTML;
};
