import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import s from './sns.module.scss';
import {useSelector} from "react-redux";
import {snsProviderType} from "/store/TYPE/snsProviderType";
import Image from "next/image";

export default function SNSManagementPage() {
  
  const auth = useSelector(s=>s.auth);
  const userInfo = auth.userInfo;
  
  return (
    <>
      <MetaTitle title="마이페이지 SNS연동"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
                <div>
                  연동SNS
                </div>
            </section>

            <section className={s.content}>
              <div className={s.gray_box}>

                <div className={s.row_1}>
                  연동된 SNS
                </div>
                <div className={s.row_2}>
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
                </div>
              </div>
            </section>
            
            <section className={s.btn}>
              <div className={s.btn_box}>
                <button className={`${s.red_btn } ${!userInfo.provider ? 'disabled' : ''}`} disabled={!userInfo.provider}>
                  연동 해제하기
                </button>
              </div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}
