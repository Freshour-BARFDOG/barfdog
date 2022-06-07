import React from 'react';
import Styles from './[eventId].module.scss'
import MetaTitle from "@src/components/atoms/MetaTitle";
import Wrapper from "/src/components/common/Wrapper";
import Layout from "/src/components/common/Layout";
import { useRouter } from "next/router";

function EventPostPage() {
  const router = useRouter();
  if (!router.isReady) return;

  const { eventId } = router.query;

  return (
    <>
      <MetaTitle title="이벤트" />
      <Layout>
        <Wrapper>
          <section className={Styles.title_box}>
            <div className={Styles.text}>
              정기구독 신청하고 최대 50%할인 받자
            </div>
          </section>

          <section className={Styles.line_box}>
            <hr className={Styles.line} />
          </section>

          <section className={Styles.picture_box}>
            <div className={Styles.picture}></div>
          </section>

          <section className={Styles.line_box2}>
            <hr className={Styles.line} />
          </section>

          <section className={Styles.btn_box}>
            <div className={Styles.btn}>목록 보기</div>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

export default EventPostPage;