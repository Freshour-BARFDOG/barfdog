import React, { useState } from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import Styles from "../../../styles/css/shop/shop.module.scss"
import Link from 'next/link';
/* Images */
import Image from "next/image";



const Stars = ({count}) => {
  const AllStars = [];
  const maxStartCount = 5;
  const yellowStarCount = Number(count);
  const darkStarCount = maxStartCount - yellowStarCount;


  const YellowStar = () => {
    return (
      <div className={`${Styles.yellow_star} img-wrap`}>
        <Image
          src={require("/public/img/shop/shop_yellow_star.png")}
          objectFit="cover"
          layout="fill"
          alt="카드 이미지"
        />
      </div>
    )
  }

  const DarkStar = () => {
    return (
      <div className={`${Styles.dark_star} img-wrap`}>
        <Image
          src={require("/public/img/shop/shop_dark_star.png")}
          objectFit="cover"
          layout="fill"
          alt="카드1 이미지"
        />
      </div>
    );
  };

  for ( let i = 0; i < yellowStarCount; i++) {
    AllStars.push(<YellowStar />);
  }

  for (let i = 0; i < darkStarCount; i++) {
    AllStars.push(<DarkStar />);
  }

  return AllStars;
}




function ShopPage() {
  return (
    <>
      <MetaTitle title="Shop" />
      <Layout>
        <Wrapper>
          <section className={Styles.top}>
            <div className={Styles.inner}>
              <div className={Styles.title}>SHOP</div>
            </div>
          </section>
        </Wrapper>

        <Wrapper>
          <section className={Styles.mid}>
            <div className={Styles.inner}>
              <div className={Styles.menu_box}>
                <ul className={Styles.menu}>
                  <li>
                    <Link href="/shop?all" passHref>
                      <a>전체</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?raw" passHref>
                      <a>생식</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?topping" passHref>
                      <a>토핑</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?etc" passHref>
                      <a>기타</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?goods" passHref>
                      <a>굿즈</a>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </Wrapper>

        <Wrapper>
          <section className={Styles.bot}>
            <ul className={Styles.inner}>
              <li className={Styles.shop_list}>
                <figure className={Styles.shop_image}>
                  <div className={`${Styles["img-wrap"]} img-wrap`}>
                    <Image
                      src={require("/public/img/shop/shop_1.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </figure>
                <figcaption className={Styles.text_box}>
                  <p className={Styles.title}>
                    강아지 고양이 냄새제거 살균 소독 탈취제 바프레쉬 BARF, FRESH
                    500ml
                  </p>
                  <div className={Styles.price_box}>
                    <span className={Styles.price}>37,900</span>
                    <span className={Styles.won}>원</span>
                    <span className={Styles.position_mid}>
                      <span className={Styles.out_of_stock}>SOLD OUT</span>
                    </span>
                  </div>
                </figcaption>
                <div className={Styles.grade_box}>
                  <div className={Styles.star_box}>
                    <Stars count='4'/>
                  </div>
                  <p className={Styles.avg_score}>4.0</p>
                  <p className={Styles.nuber_comment}>(49)</p>
                </div>
              </li>
            </ul>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export default ShopPage;