import Link from 'next/link';
import React from 'react';
import s from 'src/pages/mainPage.module.scss';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';

export function Main_wedo() {
  // 4. 따져볼수록
  return (
    <>
      {dataList.map((data, idx) => (
        <ul key={idx}>
          <li>
            <div className={s.wedo_right}>
              <div className={s.wedo_title}>
                {data.title1} <br />
                {data.title2}
              </div>

              <div className={s.wedo_content}>
                {data.content1} <br />
                {data.content2}
                <br />
                {data.content3}
              </div>

              {data.link === 'AI 추천 문진 진행하기' && (
                <div className={s.wedo_link_box}>
                  <Link href="/survey">
                    <a>
                      {data.link}
                      <FaArrowRight />
                    </a>
                  </Link>
                </div>
              )}

              {data.link === '상담하러 가기' && (
                <div className={s.wedo_link_box}>
                  <a
                    href="https://36o2x.channel.io/home"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {data.link}
                    <FaArrowRight />
                  </a>
                </div>
              )}
            </div>
            <Image
              src={require(`/public/img/pages/main/Wedo${idx + 1}.jpg`)}
              alt="레시피 이미지"
              priority
            />
          </li>
        </ul>
      ))}
    </>
  );
}

const dataList = [
  {
    title1: '수의 영양사가 설계한 레시피',
    content1: '육고기, 뼈, 내장, 채소, 영양제의',
    content2: '완벽한 포뮬러로 우리 아이에게 ',
    content3: '맞춤 식단을 제공합니다',
    link: 'AI 추천 문진 진행하기',
  },
  {
    title1: '한 끼 한 팩',
    title2: '편리하게 소분된 맞춤 식단',
    content1: '위생적인 저온 생산 공정 후',
    content2: '멸균 처리된 한 끼 한 팩 식사를',
    content3: '간편하게 급여할 수 있습니다',
  },
  {
    title1: '어렵다면',
    title2: '모든 과정 상담 가능',
    content1: '설문 및 플랜 선택이 조금 어려우신가요?',
    content2: '더 궁금하신 부분이 있으시면',
    content3: '바프독 전문 상담팀이 도와드리겠습니다',
    link: '상담하러 가기',
  },
];
