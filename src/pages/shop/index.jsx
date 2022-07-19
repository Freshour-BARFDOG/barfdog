import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from './shop.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import RatingStars from '/src/components/atoms/RatingStars';
import { global_itemType } from '/store/TYPE/itemType';
import { itemSortQueryType } from '/store/TYPE/itemSortQueryType';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import { useRouter } from 'next/router';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import ItemLabel from "../../components/atoms/ItemLabel";
import rem from "../../../util/func/rem";
import Icon_Itemlabel from "../../components/atoms/ItemLabel";

const getListApiUrl = '/api/items';
const apiDataQueryString = 'queryItemsDtoList';
const searchPageSize = 10;

const initialSearchValues = {
  sortBy: itemSortQueryType.RECENT,
  itemType: global_itemType.ALL, // url Query is lowerCase
};

function ShopPage() {
  const router = useRouter();
  const queryOnURL = router.query;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');

  console.log(itemList);
  useEffect(() => {
    const queryArr = [];
    for (const key in searchValues) {
      const val = searchValues[key];
      queryArr.push(`${key}=${val}`);
    }
    const query = `${queryArr.join('&')}`;
    setSearchQuery(query);
    console.log(router.query); // 헤더에선느 query만 변경시켜서 접속한디

    // query에 itemType=ALL <--이것만 추가하면, 검색결과에 반영되도록 만드는거지

    window.history.replaceState(window.history.state, '', `${window.location.pathname}?${query}`);
    // const curPath = router.pathname;
    // router.push({search: `${query}`});

    // router.query가 변경되면 이게 실행되도록 만든다
    // router가 변경되어서, searchQuery는.....
  }, [searchValues]);

  const onChagneItemType = (e) => {
    const button = e.currentTarget;
    const itemType = button.dataset.itemType;
    const searchKey = 'itemType';
    const convertTypeToQuery = itemType; // 객체로 searchValue에 넣는다.
    setSearchValues((prevState) => ({
      ...prevState,
      [searchKey]: convertTypeToQuery,
    }));
  };

  const onChangeSorting = (e) => {
    const { id, value } = e.currentTarget;
    setSearchValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));
    console.log(id, value);
  };


  return (
    <>
      <MetaTitle title="샵" />
      <Layout>
        <Wrapper>
          <section className={s.top}>
            <div className={s.inner}>
              <div className={s.title}>SHOP</div>
            </div>
          </section>
          <section className={s.mid}>
            <div className={s.inner}>
              <div className={s.menu_box}>
                <ul className={s.menu}>
                  <li className={s.active}>
                    <button
                      type={'button'}
                      onClick={onChagneItemType}
                      data-item-type={global_itemType.ALL}
                    >
                      {global_itemType.KOR.ALL}
                    </button>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li>
                    <button
                      type={'button'}
                      onClick={onChagneItemType}
                      data-item-type={global_itemType.RAW}
                    >
                      {global_itemType.KOR.RAW}
                    </button>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li>
                    <button
                      type={'button'}
                      onClick={onChagneItemType}
                      data-item-type={global_itemType.TOPPING}
                    >
                      {global_itemType.KOR.TOPPING}
                    </button>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li>
                    <button
                      type={'button'}
                      onClick={onChagneItemType}
                      data-item-type={global_itemType.GOODS}
                    >
                      {global_itemType.KOR.GOODS}
                    </button>
                  </li>
                </ul>
                <div className={s['select-box']}>
                  <select id="sortBy" onChange={onChangeSorting} value={searchValues.sortBy}>
                    <option value={itemSortQueryType.RECENT}>{itemSortQueryType.KOR.RECENT}</option>
                    <option value={itemSortQueryType.REGISTRATION}>
                      {itemSortQueryType.KOR.REGISTRATION}
                    </option>
                    <option value={itemSortQueryType.SALEAMOUNT}>
                      {itemSortQueryType.KOR.SALEAMOUNT}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </section>
          <section className={s.bot}>
            <ul className={s.inner}>
              {itemList.length > 0 ? (
                itemList.map((item, index) => (
                  <li className={s.shop_list} key={`item-${item.id}-${index}`}>
                    <Link href={`/shop/item/${item.id}`} passHref>
                      <a>
                        <figure className={s.shop_image}>
                          {item.itemIcons && (item.itemIcons?.indexOf(',') >= 0 ? item.itemIcons.split(',').map((label) => (
                            <Icon_Itemlabel
                              label={label}
                              className={label === 'NEW' ? s.new : s.best}
                            />
                          )) : <Icon_Itemlabel
                            label={item.itemIcons}
                            className={item.itemIcons === 'NEW' ? s.new : s.best}
                          />)}
                          <div className={`${s['img-wrap']} img-wrap`}>
                            <Image
                              src={item.thumbnailUrl}
                              objectFit="cover"
                              layout="fill"
                              alt={`상품 ${item.name}`}
                            />
                          </div>
                        </figure>
                        <figcaption className={s.text_box}>
                          <p className={s.title}>{item.name}</p>
                          <div className={s.price_box}>
                            <span className={s.price}>
                              {transformLocalCurrency(item.salePrice || item.originalPrice)}
                            </span>
                            <span className={s.won}>원</span>
                            {item.salePrice !== 0 && (
                              <>
                                <span className={s.originPrice}>
                                  {transformLocalCurrency(item.originalPrice)}원
                                </span>
                                <span className={s.discount}>
                                  {Math.ceil(
                                    ((1 - item.salePrice / item.originalPrice) * 100).toFixed(2),
                                  )}
                                  %
                                </span>
                              </>
                            )}
                            <span className={s.position_mid}>
                              {!item.inStock && <span className={s.out_of_stock}>품절</span>}
                            </span>
                          </div>
                        </figcaption>
                        <div className={s.grade_box}>
                          <div className={s.star_box}>
                            <RatingStars count={item.star} margin={4} />
                          </div>
                          <p className={s.avg_score}>{item.star.toFixed(1).toString()}</p>
                          <p className={s.nuber_comment}>({item.reviewCount})</p>
                        </div>
                      </a>
                    </Link>
                  </li>
                ))
              ) : (
                <EmptyContMessage message={'등록된 상품이 없습니다.'} />
              )}
            </ul>
          </section>
          <div className={s['pagination-section']}>
            <PaginationWithAPI
              apiURL={getListApiUrl}
              size={searchPageSize}
              setItemList={setItemList}
              queryItemList={apiDataQueryString}
              urlQuery={searchQuery}
              setIsLoading={setIsLoading}
            />
          </div>
          {/*<section className={s['btn-section']}>*/}
          {/*  <Pagination itemTotalCount={100} itemCountPerGroup={9} />*/}
          {/*</section>*/}
        </Wrapper>
      </Layout>
    </>
  );
}

export default ShopPage;
