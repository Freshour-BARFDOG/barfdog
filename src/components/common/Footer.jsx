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
