import React from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from '/src/pages/healthcare/healthcare.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import VetImg from '/public/img/healthcare/vet.jpg';
import SubscribeImg from '/public/img/healthcare/subscribe.jpg';
import KitImg from '/public/img/healthcare/kit.png';

export default function HealthcarePage() {
  return (
    <>
      <MetaTitle title="건강케어" />
      <Layout>
        <Wrapper>
          <section className={s.body_container}>
            <ul>
              <li>
                <div className={s.box_wrap}>
                  <div className={s.img_wrap_sub}>
                    <Image src={SubscribeImg} alt="SubscribeImg" />
                  </div>
                  <div className={s.box_title}>
                    <p>AI 추천 식단</p>

                    <Link href="/survey">
                      <a className={s.menu_sub_title}>바로가기</a>
                    </Link>
                  </div>
                </div>
                <div className={s.box_text}>
                  반려견에게 가장 적합한 영양소를 제공하기 위해, AI가 반려동물의
                  나이, 견종, 건강 상태 등을 고려하여 최적화된 한 끼 맞춤형
                  식단을 추천합니다
                </div>
              </li>

              <li>
                <div className={s.box_wrap}>
                  <div className={s.img_wrap}>
                    <Image src={KitImg} alt="KitImg" />
                  </div>
                  <div className={s.box_title}>
                    <p>진단 기기</p>
                    <Link href="/healthcare/kit">
                      <a className={s.menu_sub_title}>바로가기</a>
                    </Link>
                  </div>
                </div>
                <div className={s.box_text}>
                  반려견의 변을 분석해 건강 상태를 확인하는 서비스로 이 서비스를
                  통해 반려견의 기본적인 건강 지표를 측정하여 질병의 조기 발견에
                  기여할 수 있습니다
                </div>
              </li>

              <li>
                <div className={s.box_wrap}>
                  <div className={s.img_wrap_vet}>
                    <Image src={VetImg} alt="VetImg" />
                  </div>
                  <div className={s.box_title}>
                    <p>AI 수의사</p>
                    <Link href="/healthcare/vet">
                      <a className={s.menu_sub_title}>바로가기</a>
                    </Link>
                  </div>
                </div>
                <div className={s.box_text}>
                  다년간 쌓아온 바프독의 데이터를 머신러닝하여 반려견의 건강
                  문제에 대한 신속하고 정확한 상담을 연중무휴 24시간 제공하는
                  서비스입니다
                </div>
              </li>
            </ul>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}
