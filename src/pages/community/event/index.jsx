import React from 'react';
import MetaTitle from "@src/components/atoms/MetaTitle";
import Pagination from "@src/components/atoms/Pagination";
import Wrapper from "/src/components/common/Wrapper";
import Layout from "/src/components/common/Layout";
import Styles from '/styles/css/community/event/index.module.scss'
import Image from 'next/image';

function EventIndexPage() {
  return (
    <>
      <MetaTitle title="이벤트" />
      <Layout>
        <Wrapper>
          <section className={Styles.title}>
            <p>진행중인 이벤트</p>
          </section>

          <section className={Styles.event_picture_box}>
            <div className={Styles.event_box}>
              <div className={`${Styles.image} img-wrap`}>
                <Image
                  priority="false"
                  src={require("public/img/pages/community/event_1.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
                <div className={Styles.text_box}>
                  정기구독 신청하고
                  <p>최대 50%할인 받자</p>
                  <span>~ 2월 21일까지</span>
                </div>
              </div>
            </div>

            <div className={Styles.event_box}>
              <div className={`${Styles.image} img-wrap`}>
                <Image
                  priority="false"
                  src={require("public/img/pages/community/event_1.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
                <div className={Styles.text_box}>
                  생자연식 레시피
                  <p>리얼 바프 15% 할인</p>
                  <span>~ 2월 21일까지</span>
                </div>
              </div>
            </div>

            <div className={Styles.event_box}>
              <div className={`${Styles.image} img-wrap`}>
                <Image
                  priority="false"
                  src={require("public/img/pages/community/event_1.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
                <div className={Styles.text_box}>
                  친구 초대하면
                  <p>친구도 나도 3000원씩</p>
                  <span>자세히 보러가기</span>
                </div>
              </div>
            </div>
          </section>
          <section className={`hide pagination-section`}>
            <Pagination itemCountPerGroup={5} itemTotalCount={100} />
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export default EventIndexPage;