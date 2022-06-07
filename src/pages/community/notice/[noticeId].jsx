import React from 'react';
import MetaTitle from "@src/components/atoms/MetaTitle";
import Wrapper from "/src/components/common/Wrapper";
import Layout from "/src/components/common/Layout";
import { useRouter } from "next/router";
import Styles from './[noticeId].module.scss';
import Image from "next/image";

function NoticePostPage() {
    const router = useRouter();
    if(!router.isReady) return;
    const { noticeId } = router.query;
    

  return (
    <>
      <MetaTitle title={`공지사항`} />
      <Layout>
        <Wrapper>
          <section className={Styles.title}>
            <div className={Styles.text}>공지사항</div>
          </section>

          {/* 게시판 */}
          <section className={Styles.announcement}>
            <div className={Styles.content}>
              <div className={Styles.flex_box}>
                <p>제목</p>
                <span>타이틀영역입니다</span>
                <p>등록일</p>
                <span>2022.01.20</span>
              </div>

              {/* 내용 텍스트 */}
              <div className={Styles.content_text}>
                텍스트 영역입니다.
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                <br />
                Ultrices eu ullamcorper at ut aliquam nulla non nec. Massa arcu,
                non commodo lectus suspendisse.
                <br />
                At amet, est malesuada laoreet. Integer feugiat nibh mattis
                neque tincidunt. Mattis ut ac imperdiet tempor leo at viverra.
                <br />
                <br />
                Phasellus id facilisi amet quisque. In enim, sagittis, nibh
                luctus arcu gravida. Molestie ullamcorper id potenti fringilla
                dolor suspendisse id non.
                <br />
                Vel vestibulum egestas viverra quam felis gravida. Risus ut
                interdum in ligula sit lorem eu ultrices. Elementum mauris donec
                mauris cras nullam non.
                <br />
                Commodo nunc, est quis netus urna malesuada.
                <br />
                <br />
                Sed aliquam, dictum velit non a. Nunc risus aliquet est posuere.
                Maecenas eget a nam at congue. Vitae elementum in at malesuada
                tellus.
                <br />
                ullamcorper pellentesque turpis vitae lorem morbi. Id sapien
                lacus interdum dolor.
                <br />
                <br />
                Turpis adipiscing in sed placerat massa. Fringilla id cursus
                turpis lobortis in congue. Porttitor id ut odio metus, ultrices.
                Porttitor orci mauris, velit risus. Est sapien enim commodo diam
                id vitae pulvinar faucibus. Augue tellus faucibus tortor arcu a
                tortor sollicitudin nullam sem.
              </div>
            </div>
          </section>

          <section className={Styles.list_gotosee}>
            <div className={Styles.btn}>목록 보기</div>
          </section>

          <section className={Styles.before_after}>
            <div className={Styles.grid_box}>
              <p>다음글</p>
              <div>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority="false"
                    src={require("/public/img/pages/community/up_arrow.png")}
                    objectFit="contain"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>
              <div>제목 영역입니다</div>

              <p>이전글</p>
              <div>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority="false"
                    src={require("/public/img/pages/community/down_arrow.png")}
                    objectFit="contain"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>
              <div>설날 배송 안내~~~텍스트 영역</div>
            </div>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export default NoticePostPage;