import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from './shop.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import RatingStars from '/src/components/atoms/RatingStars';
import { general_itemType } from '/store/TYPE/itemType';
import { itemSortQueryType } from '/store/TYPE/itemSortQueryType';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import { useRouter } from 'next/router';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import Icon_Itemlabel from '/src/components/atoms/ItemLabel';
import { searchQueryType } from '/store/TYPE/searchQueryType';
import { useSelector } from 'react-redux';
import { userType } from '/store/TYPE/userAuthType';
import Spinner from '/src/components/atoms/Spinner';
import ImageWithLoadingSpinner from '/src/components/atoms/ImageWithLoadingSpinner';

const getListApiUrl = '/api/items';
const apiDataQueryString = 'queryItemsDtoList';
const searchPageSize = 6; // 화면에 뿌릴 상품수

const initialSearchValues = {
  sortBy: itemSortQueryType.RECENT,
  itemType: general_itemType.ALL, // url Query is lowerCase
};

export default function ShopPage() {
  const router = useRouter();
  const [itemList, setItemList] = useState(null);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState(
    'sortBy=registration&itemType=ALL',
  );
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    // - CASE: Nav GNB에서 shop > submenu Click event
    // - IMPORTANT : to prevent Inifinite Loop when router query is changed
    let readyToSetSearchValue = true;
    for (const key in router.query) {
      if (key !== searchQueryType.ITEMTYPE) {
        readyToSetSearchValue = false;
      }
    }
    if (readyToSetSearchValue) {
      for (const key in router.query) {
        if (key === searchQueryType.ITEMTYPE) {
          const val = router.query[key];
          setSearchValues((prevState) => {
            // console.log()
            return { ...prevState, [searchQueryType.ITEMTYPE]: val };
          });
        }
      }
    }
  }, [router.query]);

  useEffect(() => {
    // 검색기능: searchValue를 통하여 query update -> 검색시작
    const newQueryArr = [];
    for (const key in searchValues) {
      const val = searchValues[key];
      newQueryArr.push(`${key}=${val}`);
    }
    setSearchQuery(newQueryArr.join('&'));
  }, [searchValues]);

  const pageInterCeptor = async (res) => {
    const newItemList = res.data?._embedded?.queryItemsDtoList;
    const pageData = res.data.page;
    const newPageInfo = {
      totalPages: pageData.totalPages,
      size: pageData.size,
      totalItems: pageData.totalElements,
      currentPageIndex: pageData.number,
      newPageNumber: pageData.number + 1,
      newItemList: newItemList || [],
    };
  };

  const onChangeItemType = (e) => {
    const button = e.currentTarget;
    const itemType = button.dataset.itemType;
    const searchKey = searchQueryType.ITEMTYPE;
    const convertTypeToQuery = itemType; // 객체로 searchValue에 넣는다.
    setSearchValues((prevState) => ({
      ...prevState,
      page: 1,
      [searchKey]: convertTypeToQuery,
    }));
  };

  const onChangeSorting = (e) => {
    const { id, value } = e.currentTarget;
    setSearchValues((prevState) => ({
      ...prevState,
      page: 1,
      [id]: value,
    }));
  };
  const onClickItem = (e, name) => {
    e.preventDefault();
    const link = e.currentTarget.href;
    const inStock = e.currentTarget.dataset.stock === 'true';
    const thisUserType = auth.userType;
    if (thisUserType === userType.NON_MEMBER) {
      alert('회원가입 후 이용가능합니다.');
    } else if (name === '바프독 생식 샘플 (100g*4팩) / N스토어 한정 판매') {
      if (typeof window !== undefined) {
        return window.open(
          'https://smartstore.naver.com/barfdog/products/6314410723',
          '_blank',
        );
      }
    } else if (name === '생식 올인원패키지 1kg / N스토어 한정 판매') {
      if (typeof window !== undefined) {
        return window.open(
          'https://smartstore.naver.com/barfdog/products/6117803121',
          '_blank',
        );
      }
    } else if (name.includes('N스토어')) {
      if (typeof window !== undefined) {
        return window.open('https://smartstore.naver.com/barfdog', '_blank');
      }
      // } else if (!inStock) {
      // alert('품절된 상품입니다.');
    } else {
      router.push(link);
    }
  };

  // // console.log(itemList);

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
                  <li
                    className={
                      searchValues.itemType === general_itemType.ALL
                        ? s.active
                        : ''
                    }
                  >
                    <button
                      type={'button'}
                      onClick={onChangeItemType}
                      data-item-type={general_itemType.ALL}
                    >
                      {general_itemType.KOR.ALL}
                    </button>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li
                    className={
                      searchValues.itemType === general_itemType.RAW
                        ? s.active
                        : ''
                    }
                  >
                    <button
                      type={'button'}
                      onClick={onChangeItemType}
                      data-item-type={general_itemType.RAW}
                    >
                      {general_itemType.KOR.RAW}
                    </button>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li
                    className={
                      searchValues.itemType === general_itemType.TOPPING
                        ? s.active
                        : ''
                    }
                  >
                    <button
                      type={'button'}
                      onClick={onChangeItemType}
                      data-item-type={general_itemType.TOPPING}
                    >
                      {general_itemType.KOR.TOPPING}
                    </button>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li
                    className={
                      searchValues.itemType === general_itemType.GOODS
                        ? s.active
                        : ''
                    }
                  >
                    <button
                      type={'button'}
                      onClick={onChangeItemType}
                      data-item-type={general_itemType.GOODS}
                    >
                      {general_itemType.KOR.GOODS}
                    </button>
                  </li>
                </ul>
                <div className={s['select-box']}>
                  <select
                    id="sortBy"
                    onChange={onChangeSorting}
                    value={searchValues.sortBy}
                  >
                    <option value={itemSortQueryType.RECENT}>
                      {itemSortQueryType.KOR.RECENT}
                    </option>
                    <option value={itemSortQueryType.REGISTRATION}>
                      {itemSortQueryType.KOR.REGISTRATION}
                    </option>
                    <option value={itemSortQueryType.SALEAMOUNT}>
                      {itemSortQueryType.KOR.SALEAMOUNT}
                    </option>
                    {/* <option value={itemSortQueryType.LOWPRICE}>
                      {itemSortQueryType.KOR.LOWPRICE}
                    </option>
                    <option value={itemSortQueryType.HIGHPRICE}>
                      {itemSortQueryType.KOR.HIGHPRICE}
                    </option>
                    <option value={itemSortQueryType.MOSTREVIEWED}>
                      {itemSortQueryType.KOR.MOSTREVIEWED}
                    </option>
                    <option value={itemSortQueryType.SCORE}>
                      {itemSortQueryType.KOR.SCORE}
                    </option> */}
                  </select>
                </div>
              </div>
            </div>
          </section>
          <section className={s.bot}>
            {!itemList ? (
              <Spinner />
            ) : itemList.length === 0 ? (
              <EmptyContMessage message={'등록된 상품이 없습니다.'} />
            ) : (
              <ul className={s.inner}>
                {itemList.map((item, index) => (
                  <li
                    className={`${s.shop_list} animation-show`}
                    key={`item-${item.id}-${index}`}
                  >
                    <Link href={`/shop/item/${item.id}`} passHref>
                      <a
                        onClick={(e) => onClickItem(e, item.name)}
                        data-stock={item.inStock}
                      >
                        <figure className={s.shop_image}>
                          {/* {item.itemIcons &&
                            (item.itemIcons?.indexOf(',') >= 0 ? (
                              item.itemIcons
                                .split(',')
                                .map((label, index) => (
                                  <Icon_Itemlabel
                                    label={label}
                                    key={`${label}-${index}`}
                                    className={label === 'NEW' ? s.new : s.best}
                                  />
                                ))
                            ) : (
                              <Icon_Itemlabel
                                label={item.itemIcons}
                                className={item.itemIcons === 'NEW' ? s.new : s.best}
                              />
                            ))} */}
                          {/* 일반상품 BEST, NEW label 각 개체의 최대 표시수 1개 */}
                          {item.itemIcons &&
                            item.itemIcons
                              .split(',')
                              .filter(
                                (label, index, self) =>
                                  (label === 'NEW' &&
                                    self.indexOf(label) === index) ||
                                  (label === 'BEST' &&
                                    self.indexOf(label) === index),
                              )
                              .map((label, index) => (
                                <Icon_Itemlabel
                                  label={label}
                                  key={`${label}-${index}`}
                                  className={label === 'NEW' ? s.new : s.best}
                                />
                              ))}
                          <div className={`${s['img-wrap']} img-wrap`}>
                            <ImageWithLoadingSpinner
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
                              {transformLocalCurrency(
                                item.salePrice || item.originalPrice,
                              )}
                              <span className={s.won}>&nbsp;원</span>

                              <span className={s.position_mid}>
                                {item.name.includes('N스토어')
                                  ? ''
                                  : !item.inStock && (
                                      <span className={s.out_of_stock}>
                                        품절
                                      </span>
                                    )}
                              </span>
                            </span>
                            {item.originalPrice !== item.salePrice &&
                              item.salePrice !== 0 && (
                                <>
                                  <div className={s.discount_box}>
                                    <span className={s.originPrice}>
                                      {transformLocalCurrency(
                                        item.originalPrice,
                                      )}
                                      원
                                    </span>
                                    <span className={s.discount}>
                                      {Math.ceil(
                                        (
                                          (1 -
                                            item.salePrice /
                                              item.originalPrice) *
                                          100
                                        ).toFixed(2),
                                      )}
                                      %
                                    </span>
                                  </div>
                                </>
                              )}
                          </div>
                        </figcaption>
                        <div className={s.grade_box}>
                          <div className={s.star_box}>
                            <RatingStars count={item.star} margin={4} />
                          </div>
                          <p className={s.avg_score}>
                            {item.star.toFixed(1).toString()}
                          </p>
                          <p className={s.nuber_comment}>
                            ({item.reviewCount})
                          </p>
                        </div>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className={s['pagination-section']}>
            <PaginationWithAPI
              apiURL={getListApiUrl}
              size={searchPageSize}
              setItemList={setItemList}
              queryItemList={apiDataQueryString}
              urlQuery={searchQuery}
              pageInterceptor={pageInterCeptor}
            />
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}
