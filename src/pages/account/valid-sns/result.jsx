import React, {useEffect} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import { Title } from '/src/components/atoms/Checkbox';
import s from './result.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import {snsProviderType} from "/store/TYPE/snsProviderType";

export default function ValidSnsResultPage() {
  const auth = useSelector((s) => s.auth);
  const userInfo = auth.userInfo;
  useEffect(() => {
    if (!userInfo?.email) {
      alert('조회된 계정이 없습니다.');
      window.location.href = '/account/login';
    }
  }, []);
  
  if (!userInfo?.email) {
    return;
  }
  return (
    <>
      <MetaTitle title="SNS계정 연동결과" />
      <Layout>
        <Wrapper>
          <div className={s.flex_container}>
            <Title name="계정이 연동되었습니다." />
            <section className={s.linebox}>
              <div className={s.frontline}>
                <span className={s.title}>가입된 이메일</span>
                <span className={s.email}>{userInfo.email}</span>
              </div>
              <div className={s.secondline}>
                <span className={s.title}>연결된 SNS</span>
                {!userInfo.provider && <span>현재 연결된 SNS가 없습니다.</span>}
                {userInfo.provider === snsProviderType.KAKAO && <figure className={`${s.image} img-wrap`}>
                  <Image
                    src={require('/public/img/icon/kakao.png')}
                    objectFit="cover"
                    layout="fill"
                    alt="카카오톡 아이콘"
                  />
                </figure>}
                {userInfo.provider === snsProviderType.NAVER && <figure className={`${s.image} img-wrap`}>
                  <Image
                    src={require('/public/img/icon/naver.png')}
                    objectFit="cover"
                    layout="fill"
                    alt="카카오톡 아이콘"
                  />
                </figure>}
              </div>
            </section>
            <Link href={'/'} passHref>
              <button type={'button'} className={s.btn}>
                홈으로
              </button>
            </Link>
          </div>
        </Wrapper>
      </Layout>
    </>
  );
}
