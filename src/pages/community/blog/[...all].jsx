import React, { useEffect } from 'react';
import Wrapper from "/src/components/common/Wrapper";
import Layout from "/src/components/common/Layout";
import { useRouter } from "next/router";
import Styles from "./[...all].module.scss";
import MetaTitle from "@src/components/atoms/MetaTitle";




function BlogPostPage() {
  const router = useRouter();
  // ! 렌더링 2번 중, 첫번째 될 때 URL값이 없으므로 ,undefined
  if (!router.isReady) return;
  const { all } = router.query;
  const type = all[0];
  const pid = all[1];
  // console.log(type, pid);

  return (
    <>
      <MetaTitle title={`블로그`} />
      <Layout>
        <Wrapper>
          <section className={Styles.title_box}>
            반려동물 사료를 바꿔야 하는 7가지 이유
          </section>

          <section className={Styles.line_box}>
            <hr className={Styles.line} />
          </section>

          <section className={Styles.content_box}>
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

export default BlogPostPage