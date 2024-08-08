import Link from 'next/link';
import React from 'react';
import s from 'src/pages/mainPage.module.scss';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';

export function Main_family() {
  // 4. 따져볼수록
  return (
    <>
      <div className={s.family_line}></div>
      {dataList.map((data, idx) => (
        <ul key={idx}>
          <li>
            <div className={s.family_title}>
              {data.title1} <br />
              {data.title2}
            </div>

            <div
              className={`${s.family_content} ${idx === 2 ? s.third_item : ''}`}
            >
              {data.content1} <br />
              {data.content2}
              <br />
              {data.content3}
              <br />
              {data.content4}
            </div>

            <div className={s.img_box}>
              <Image
                src={require(`/public/img/pages/main/Family${idx + 1}.png`)}
                alt="레시피 이미지"
                priority
              />
            </div>
          </li>
        </ul>
      ))}
      <div className={s.family_line}></div>
    </>
  );
}

const dataList = [
  {
    title1: '75만 건 이상의 빅데이터 기반',
    title2: 'AI 추천 알고리즘',
    content1: '국내외 논문과 75만건 이상의 빅데이터로',
    content2: 'AI 맞춤 서비스를 제공합니다 ',
  },
  {
    title1: '100% 사람이 먹는 재료만',
    title2: '사용하여 건강하게',
    content1: '우리 가족이 먹을 수 있는 재료 이상의 품질로',
    content2: '최상 등급의 식단을 제공합니다',
  },
  {
    title1: 'AAFCO는 물론',
    title2: '제조실 ISO 국제 표준 인증으로 안전하게능',
    content1: '당연히 지켜야하는 AAFCO 기준 충족은 물론,',
    content2: 'NRC, Fediaf 기준까지 모두 충족합니다',
    content3: '또한, 제조 시설은 ISO 22000, 9001, 14001의',
    content4: '국제 표준 인증을 취득해 위생적으로 생산됩니다',
  },
  {
    title1: '선 주문 후 생산으로',
    title2: '항상 신선하게',
    content1: '15도 이하로 유지되는 인증 받은 자체 저온 시설에서',
    content2: '주문 후 바로 만들어 신선하게 전달됩니다',
  },
];
