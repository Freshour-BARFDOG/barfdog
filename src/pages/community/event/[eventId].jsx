import React from 'react';
import Wrapper from "/src/components/common/Wrapper";
import Layout from "/src/components/common/Layout";
import { useRouter } from "next/router";
import Styles from '/styles/css/community/event/[eventId].module.scss'

function EventPostPage() {
  const router = useRouter();
  if (!router.isReady) return;

  // console.log(router);
  const { eventId } = router.query;

  return (
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
          <div className={Styles.picture}>

          </div>
        </section>

        <section className={Styles.line_box2}>
          <hr className={Styles.line} />
        </section>

        <section className= {Styles.btn_box}>
          <div className={Styles.btn}>목록 보기</div>
        </section>





        <div>
          EventPostPage
          <p>event pid: {eventId}</p>
        </div>
      </Wrapper>
    </Layout>
  );
}

export default EventPostPage