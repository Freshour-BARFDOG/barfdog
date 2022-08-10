import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from './shop.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import RatingStars from '/src/components/atoms/RatingStars';
import { itemType } from '/store/TYPE/itemType';
import { itemSortQueryType } from '/store/TYPE/itemSortQueryType';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import { useRouter } from 'next/router';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import Icon_Itemlabel from '/src/components/atoms/ItemLabel';
import { searchQueryType } from '/store/TYPE/searchQueryType';
import {useSelector} from "react-redux";
import {userType} from "/store/TYPE/userAuthType";

const getListApiUrl = '/api/items';
const apiDataQueryString = 'queryItemsDtoList';
const searchPageSize = 6; // 화면에 뿌릴 상품수

const initialSearchValues = {
  sortBy: itemSortQueryType.RECENT,
  itemType: itemType.ALL, // url Query is lowerCase
};

export default function ShopPage() {
  const router = useRouter();
  const [itemList, setItemList] = useState([]);
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchQuery, setSearchQuery] = useState('');
  const auth = useSelector(state=>state.auth);
  

  // console.log(itemList);
  // console.log(searchValues.itemType)
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
      // console.log(readyToSetSearchValue);
      // console.log(router.query);
      for (const key in router.query) {
        if (key === searchQueryType.ITEMTYPE) {
          const val = router.query[key];
          setSearchValues((prevState) => {
            console.log()
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

  const onChagneItemType = (e) => {
    const button = e.currentTarget;
    const itemType = button.dataset.itemType;
    const searchKey = searchQueryType.ITEMTYPE;
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
  };
  const onClickItem = (e)=>{
    e.preventDefault();
    const thisUserType = auth.userType;
    if(thisUserType === userType.NON_MEMBER){
      alert('회원가입 후 이용가능합니다.')
    }else{
      const link = e.currentTarget.href;
      router.push(link);
    }
  }

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
                  <li className={searchValues.itemType === itemType.ALL ? s.active : ''}>
                    <button
                      type={'button'}
                      onClick={onChagneItemType}
                      data-item-type={itemType.ALL}
                    >
                      {itemType.KOR.ALL}
                    </button>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li className={searchValues.itemType === itemType.RAW ? s.active : ''}>
                    <button
                      type={'button'}
                      onClick={onChagneItemType}
                      data-item-type={itemType.RAW}
                    >
                      {itemType.KOR.RAW}
                    </button>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li className={searchValues.itemType === itemType.TOPPING ? s.active : ''}>
                    <button
                      type={'button'}
                      onClick={onChagneItemType}
                      data-item-type={itemType.TOPPING}
                    >
                      {itemType.KOR.TOPPING}
                    </button>
                  </li>
                  <li>
                    <hr />
                  </li>
                  <li className={searchValues.itemType === itemType.GOODS ? s.active : ''}>
                    <button
                      type={'button'}
                      onClick={onChagneItemType}
                      data-item-type={itemType.GOODS}
                    >
                      {itemType.KOR.GOODS}
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
            {itemList.length === 0 ? <EmptyContMessage message={'등록된 상품이 없습니다.'} /> : <ul className={s.inner}>
              {itemList.map((item, index) => (
                  <li className={`${s.shop_list} animation-show`} key={`item-${item.id}-${index}`}>
                    <Link href={`/shop/item/${item.id}`} passHref>
                      <a onClick={onClickItem}>
                        <figure className={s.shop_image}>
                          {item.itemIcons &&
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
                            ))}
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
                              <span className={s.won}>&nbsp;원</span>
                              
                              <span className={s.position_mid}>
                                {!item.inStock && <span className={s.out_of_stock}>품절</span>}
                              </span>
                            </span>
                            {item.salePrice !== 0 && (
                              <>
                                <div className={s.discount_box}>
                                  <span className={s.originPrice}>
                                    {transformLocalCurrency(item.originalPrice)}원
                                  </span>
                                  <span className={s.discount}>
                                    {Math.ceil(
                                      ((1 - item.salePrice / item.originalPrice) * 100).toFixed(2),
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
                          <p className={s.avg_score}>{item.star.toFixed(1).toString()}</p>
                          <p className={s.nuber_comment}>({item.reviewCount})</p>
                        </div>
                      </a>
                    </Link>
                  </li>
                ))}
            </ul>}
            
          </section>
          <section className={s['pagination-section']}>
            <PaginationWithAPI
              apiURL={getListApiUrl}
              size={searchPageSize}
              setItemList={setItemList}
              queryItemList={apiDataQueryString}
              urlQuery={searchQuery}
            />
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}
