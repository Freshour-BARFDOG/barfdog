import React, { useState } from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import s from "./shop.module.scss"
import Link from 'next/link';
/* Images */
import Image from "next/image";
import RatingStars from "/src/components/atoms/RatingStars";
import Pagination from "/src/components/atoms/Pagination";



function ShopPage() {
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
                  <li>
                    <Link href="/shop?category=all" passHref>
                      <a>전체</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=raw" passHref>
                      <a>생식</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=topping" passHref>
                      <a>토핑</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=etc" passHref>
                      <a>기타</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=goods" passHref>
                      <a>굿즈</a>
                    </Link>
                  </li>
                </ul>
                <div className={s['select-box']}>
                  <select name="sort-order" id="sort-order">
                    <option value="recent" selected={true}>
                      최근순
                    </option>
                    <option value="resistered">등록순</option>
                    <option value="sold">판매순</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
          <section className={s.bot}>
            <ul className={s.inner}>
              <li className={s.shop_list}>
                <Link href="/shop/single" passHref>
                  <a href="">
                    <figure className={s.shop_image}>
                      <div className={`${s['img-wrap']} img-wrap`}>
                        <Image
                          src={require('/public/img/shop/shop_1.png')}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </div>
                    </figure>
                    <figcaption className={s.text_box}>
                      <p className={s.title}>
                        강아지 고양이 냄새제거 살균 소독 탈취제 바프레쉬 BARF, FRESH 500ml
                      </p>
                      <div className={s.price_box}>
                        <span className={s.price}>37,900</span>
                        <span className={s.won}>원</span>
                        <span className={s.position_mid}>
                          <span className={s.out_of_stock}>SOLD OUT</span>
                        </span>
                      </div>
                    </figcaption>
                    <div className={s.grade_box}>
                      <div className={s.star_box}>
                        <RatingStars count="4" />
                      </div>
                      <p className={s.avg_score}>4.0</p>
                      <p className={s.nuber_comment}>(49)</p>
                    </div>
                  </a>
                </Link>
              </li>
            </ul>
          </section>
          <section className={s['btn-section']}>
            <Pagination itemTotalCount={100} itemCountPerGroup={9} />
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export default ShopPage;