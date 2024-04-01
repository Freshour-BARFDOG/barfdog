import React, { useState } from 'react';
import s from './footer.module.scss';
import Wrapper from '/src/components/common/Wrapper';
import Link from 'next/link';
import {
  FaYoutube,
  FaBlogger,
  FaInstagramSquare,
  FaFacebookSquare,
} from 'react-icons/fa';
import Image from 'next/image';

// import FooterLogo from "/public/img/logo_footer.png";
// import FooterLogo_2x from "/public/img/logo_footer@2x.png";

import FooterLogo from '/public/img/logo(HQ).png';
import Freshour from '/public/img/freshour.png';
import FooterLogo_2x from '/public/img/logo@2x.png';
import MobileLogo from '/public/img/mobile_logo.png';
import MobileLogo_2x from '/public/img/mobile_logo@2x.png';
import MenuLayout, { SubmenuList } from '../header/MenuLayout';
import { general_itemType } from '../../../store/TYPE/itemType';

export default function Footer() {
  const [isArrowActive, setIsArrowActive] = useState(true);
  const [rotation, setRotation] = useState(0);

  const onClickArrowIcon = (e) => {
    e.preventDefault();
    setIsArrowActive(!isArrowActive);
    setRotation((prevRotation) => (prevRotation + 180) % 360);
  };

  return (
    <footer id={s.site_footer}>
      {/* ---- 상단 Footer ----- */}
      <Wrapper bgColor="#7b1616">
        <section className={s.main_footer_area}>
          <div className={s.main_footer_left}>
            <h2>소통 가능 시간</h2>
            <div className={s.contact_container}>
              <div className={s.contact_box}>
                <span>월 - 금요일</span>
                <div className={s.contact_line}></div>
                <div>오전 10시 - 오후 7시</div>
              </div>
              <div className={s.contact_box}>
                <span>점심시간</span>
                <div className={s.contact_line}></div>
                <div>오전 12시-오후 1시</div>
              </div>
            </div>
            <div className={s.sns_area}>
              <ul>
                <li>
                  <a
                    href="https://www.youtube.com/channel/UCf_VpnXwfLu6wQ1ADcXSphA/featured"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <FaYoutube />
                  </a>
                </li>
                <li>
                  <a
                    href="https://blog.naver.com/barfdog"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <FaBlogger />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/barfdog_official/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <FaInstagramSquare />
                  </a>
                </li>
                {/* <li>
                  <a
                    href="https://www.facebook.com/BARFDOG_official-100623948688775"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <FaFacebookSquare />
                  </a>
                </li> */}
              </ul>
            </div>
          </div>

          <div className={s.main_footer_right}>
            <nav id="gnb" className={`${s.gnb_nav} pc`}>
              <ul>
                <li>
                  <Link href="/healthcare">
                    <a className={s.menu_title}>건강케어</a>
                  </Link>
                  <ul>
                    <li>
                      <Link href={`/shop?itemType=${general_itemType.ALL}`}>
                        <a className={s.menu_sub_title}>AI 추천 식단</a>
                      </Link>
                    </li>
                    <li>
                      <Link href={`/shop?itemType=${general_itemType.RAW}`}>
                        진단 기기
                      </Link>
                    </li>
                    <li>
                      <Link href={`/shop?itemType=${general_itemType.RAW}`}>
                        AI 수의사
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link href={`/shop?itemType=${general_itemType.ALL}`}>
                    <a className={s.menu_title}>스토어</a>
                  </Link>
                  <ul>
                    <li>
                      <Link href={`/shop?itemType=${general_itemType.ALL}`}>
                        <a className={s.menu_sub_title}>ALL</a>
                      </Link>
                    </li>
                    <li>
                      <Link href={`/shop?itemType=${general_itemType.RAW}`}>
                        생식
                      </Link>
                    </li>
                    <li>
                      <Link href={`/shop?itemType=${general_itemType.TOPPING}`}>
                        토핑
                      </Link>
                    </li>
                    <li>
                      <Link href={`/shop?itemType=${general_itemType.GOODS}`}>
                        굿즈
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link href="/membership">
                    <a className={s.menu_title}>멤버십</a>
                  </Link>
                </li>
                <li>
                  <Link href="/community/notice">
                    <a className={s.menu_title}>커뮤니티</a>
                  </Link>
                  <ul>
                    <li>
                      <Link href="/community/notice">
                        <a className={s.menu_sub_title}>공지사항</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/community/event">이벤트</Link>
                    </li>
                    <li>
                      <Link href="/community/blog">블로그</Link>
                    </li>
                    <li>
                      <Link href="/community/about">어바웃</Link>
                    </li>
                    <li>
                      <Link href="/faq">FAQ</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link href="/review">
                    <a className={s.menu_title}>리뷰</a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </section>
      </Wrapper>

      {/* ----- 하단 Footer ----- */}
      <Wrapper bgColor="#1a0909">
        <section className={s.sub_footer_area}>
          <div className={s.sub_footer_top}>
            <h3>(주) 프레쉬아워 Freshour INC.</h3>
            <Image
              src="/img/icon/footer-arrow.svg"
              alt="arrow"
              width={16}
              height={16}
              className={s.arrow_icon}
              onClick={onClickArrowIcon}
              style={{ transform: `rotate(${rotation}deg)` }}
            />
          </div>

          <div
            className={`${s.sub_footer_container} ${
              isArrowActive ? s.active : ''
            }`}
          >
            <div className={s.sub_footer_left}>
              <div className={s.companyInfo_area}>
                <ul data-lang={'ko'}>
                  <li>
                    <span className={s.info_title}>CEO :</span>
                    <span className={s.info_cont}>임경호</span>
                  </li>
                  <li>
                    <span className={s.info_title}>사업자번호:</span>
                    <span className={s.info_cont}>351-87-02455</span>
                    <a
                      href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=7038801843"
                      rel="noreferrer"
                      target="_blank"
                      className={s.info_site}
                    >
                      사업자정보 확인
                    </a>
                  </li>
                  <li>
                    <span className={s.info_title}>통신판매신고번호:</span>
                    <span className={s.info_cont}>2022-충북충주-0578</span>
                  </li>
                  <li>
                    <span className={s.info_title}>Email.</span>
                    <span className={s.info_cont}>info@freshour.co.kr</span>
                    <a
                      href="mailto:MAIL_ADDRESS"
                      className={s.info_cont_mobile}
                    >
                      info@freshour.co.kr
                    </a>
                  </li>
                  <li>
                    <span className={s.info_title}>주소:</span>
                    <span className={s.info_cont}>
                      충북 충주시 번영대로 214, 1층
                    </span>
                  </li>
                  <li>
                    <span className={s.info_title}>유선번호: </span>
                    <span className={s.info_cont}>043-855-4995</span>
                    <a href="tel:070-7770-7916" className={s.info_cont_mobile}>
                      043-855-4995
                    </a>
                  </li>
                </ul>
              </div>

              <div className={s.policy_area}>
                <ul>
                  <li>
                    <a href="/policy/privacy" rel="noreferrer" target="_blank">
                      Privacy policy
                    </a>
                  </li>
                  <li>
                    <a href="/policy/terms" rel="noreferrer" target="_blank">
                      Terms&Conditions
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className={s.sub_footer_right}>
              <Image
                src="/img/freshour.png"
                alt="Footer 로고"
                width={250}
                height={85}
              />
            </div>
          </div>
        </section>
      </Wrapper>
    </footer>
  );
}
