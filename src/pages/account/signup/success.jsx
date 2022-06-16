import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from "./success.module.scss";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Link from "next/link";
import {useRouter} from "next/router";



export default function SignupSuccessPage() {
  const router = useRouter();
  const query = router.query;
  const username = query.username;
  return (
    <>
      <MetaTitle title="SNS계정 연동확인" />
      <Layout>
        <Wrapper>
          <div className={s.flex_container}>
            <h1 className={s.title}>
              <b>회원가입</b>이 <b>완료</b>되었습니다.
            </h1>
            <div className={s.cont}>
              <p><b>{username}</b>님 회원가입을 축하합니다!</p>
              <p>이제 사이트의 모든 기능을 사용하실 수 있습니다.</p>
            </div>
            <div className={s['btn-section']}>
              <Link href={'/account/login'} passHref>
                <a>
                  로그인
                </a>
              </Link>
            </div>
          </div>
        </Wrapper>
      </Layout>
    </>
);
}
