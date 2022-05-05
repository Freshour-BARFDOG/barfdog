import React from 'react';
import Wrapper from "/src/components/common/Wrapper";
import Layout from "/src/components/common/Layout";
import Styles from "/styles/css/community/blog/index.module.scss"
import Image from 'next/image';
import Link from 'next/link';

function BlogIndexPage() {
  return (
    <Layout>
      <Wrapper>
        <section className={Styles.title}>
          <div className={Styles.text1}>
            블로그
          </div>
          <div className = {Styles.text2}>
            바프독과 반려견의 모든 정보를 이곳에서 확인하세요
          </div>
        </section>

        <section className={Styles.article_box}>
          <div className={Styles.article}>
            <p>추천 아티클</p>

            <div className={Styles.flex_box}>
              <div className={Styles.left_box}>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority="false"
                    src={require("public/img/pages/community/left_pic.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>

                <p>영양</p>
                <div className={Styles.article_title}>
                  반려동물 사료를 바꿔야 하는 7가지 이유
                </div>
                <div className={Styles.day}>
                  2022.02.08
                </div>

              </div>
              <div className={Styles.right_box}>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority="false"
                    src={require("public/img/pages/community/right_pic.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>

                <p>영양</p>
                <div className={Styles.article_title}>
                  우리의 댕댕이가 배고프다는 신호를 어떻게 알까?
                </div>
                <div className={Styles.day}>
                  2022.02.08
                </div>

              </div>

            </div>

          </div>
        </section>

        <section className={Styles.menu_box}>
            <ul className={Styles.menu}>
              <li>
                <Link href="/community/blog" passHref>
                  <a>전체</a>
                </Link>
              </li>
              <li>
                <Link href="/community/blog" passHref>
                  <a>영양</a>
                </Link>
              </li>
              <li>
                <Link href="/community/blog" passHref>
                  <a>건강</a>
                </Link>
              </li>
              <li>
                <Link href="/community/blog" passHref>
                  <a>생애</a>
                </Link>
              </li>
            </ul>
        </section>


        <section className={Styles.content_box}>
          <div className={Styles.line}>
            <div className={Styles.flex_box}>
              <div className={Styles.left_box}>
                <p>영양</p>
                <div className={Styles.article_title}>
                  반려동물 사료를 바꿔야 하는 7가지 이유
                </div>
                <div className={Styles.text}>
                텍스트 영역입니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices eu ullamcorper at ut aliquam nulla non nec. Massa arcu, non commodo lectus suspendisse. At amet, est malesuada laoreet. Integer feugiat nibh  mattis neque tincidunt. Mattis ut ac imperdiet n...
                </div>
                <div className={Styles.day}>
                  2022.02.08
                </div>

              </div>
              <div className={Styles.right_box}>

                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority="false"
                    src={require("public/img/pages/community/right_pic.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>

              </div>
            </div>
          </div>


          <div className={Styles.line}>
            <div className={Styles.flex_box}>
              <div className={Styles.left_box}>
                <p>영양</p>
                <div className={Styles.article_title}>
                  반려동물 사료를 바꿔야 하는 7가지 이유
                </div>
                <div className={Styles.text}>
                텍스트 영역입니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices eu ullamcorper at ut aliquam nulla non nec. Massa arcu, non commodo lectus suspendisse. At amet, est malesuada laoreet. Integer feugiat nibh  mattis neque tincidunt. Mattis ut ac imperdiet n...
                </div>
                <div className={Styles.day}>
                  2022.02.08
                </div>

              </div>
              <div className={Styles.right_box}>

                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority="false"
                    src={require("public/img/pages/community/right_pic.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>

              </div>
            </div>
          </div>



          <div className={Styles.line}>
            <div className={Styles.flex_box}>
              <div className={Styles.left_box}>
                <p>영양</p>
                <div className={Styles.article_title}>
                  반려동물 사료를 바꿔야 하는 7가지 이유
                </div>
                <div className={Styles.text}>
                텍스트 영역입니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices eu ullamcorper at ut aliquam nulla non nec. Massa arcu, non commodo lectus suspendisse. At amet, est malesuada laoreet. Integer feugiat nibh  mattis neque tincidunt. Mattis ut ac imperdiet n...
                </div>
                <div className={Styles.day}>
                  2022.02.08
                </div>

              </div>
              <div className={Styles.right_box}>

                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority="false"
                    src={require("public/img/pages/community/right_pic.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>

              </div>
            </div>
          </div>



          <div className={Styles.line}>
            <div className={Styles.flex_box}>
              <div className={Styles.left_box}>
                <p>영양</p>
                <div className={Styles.article_title}>
                  반려동물 사료를 바꿔야 하는 7가지 이유
                </div>
                <div className={Styles.text}>
                텍스트 영역입니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultrices eu ullamcorper at ut aliquam nulla non nec. Massa arcu, non commodo lectus suspendisse. At amet, est malesuada laoreet. Integer feugiat nibh  mattis neque tincidunt. Mattis ut ac imperdiet n...
                </div>
                <div className={Styles.day}>
                  2022.02.08
                </div>

              </div>
              <div className={Styles.right_box}>

                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority="false"
                    src={require("public/img/pages/community/right_pic.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>

              </div>
            </div>
          </div>
        </section>


        <div className={Styles.pagination_box}>
        <div className={Styles.content}>
          <div> &#60;</div>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>...</div>
          <div>11</div>
          <div> &#62;</div>
        </div>
      </div>



      </Wrapper>
    </Layout>
  );
}

export default BlogIndexPage;