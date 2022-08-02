import React, { useEffect } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import { Title } from '/src/components/atoms/Checkbox';
import s from '../valid-sns/result.module.scss';
import { useSelector } from 'react-redux';
import { snsProviderType } from '/store/TYPE/snsProviderType';
import Image from 'next/image';
import Link from 'next/link';
import MetaTitle from "/src/components/atoms/MetaTitle";

export default function FindMyIdResultPage() {
  const userState = useSelector((s) => s.userState);
  const userInfo = userState.tempMyAccount;
  useEffect(() => {
    if (!userInfo.email) {
      alert('조회된 계정이 없습니다.');
      window.location.href = '/account/login';
    }
  }, []);

  if (!userInfo.email) {
    return;
  }
  return (
    <>
      <MetaTitle title="아이디 찾기 결과" />
      <Layout>
        <Wrapper>
          <div className={s.flex_container}>
            <div className={s.titlebox}>
              <Title name="아이디 찾기"></Title>
            </div>
            <ul className={s.linebox}>
              <li className={s.frontline}>
                <span className={s.title}>가입된 이메일</span>
                <span className={s.email}>{userInfo.email}</span>
              </li>
              <li className={s.secondline}>
                <span className={s.title}>연결된 SNS</span>
                {!userInfo.provider && <span>현재 연결된 SNS가 없습니다.</span>}
                {userInfo.provider === snsProviderType.KAKAO && (
                  <figure className={`${s.image} img-wrap`}>
                    <Image
                      src={require('/public/img/icon/kakao.png')}
                      objectFit="cover"
                      layout="fill"
                      alt="카카오톡 아이콘"
                    />
                  </figure>
                )}
                {userInfo.provider === snsProviderType.NAVER && (
                  <figure className={`${s.image} img-wrap`}>
                    <Image
                      src={require('/public/img/icon/naver.png')}
                      objectFit="cover"
                      layout="fill"
                      alt="카카오톡 아이콘"
                    />
                  </figure>
                )}
              </li>
            </ul>
            <Link href={'/account/login'} passHref>
              <button type={'button'} className={s.btn}>
                로그인
              </button>
            </Link>
          </div>
        </Wrapper>
      </Layout>
    </>
  );
}
