import React from 'react';
import s from './footer.module.scss';
import Wrapper from '/src/components/common/Wrapper';
import Link from 'next/link';
import {
  FaYoutube,
  FaBlogger,
  FaInstagramSquare,
  FaFacebookSquare,
} from "react-icons/fa";
import Image from 'next/image';

// import FooterLogo from "/public/img/logo_footer.png";
// import FooterLogo_2x from "/public/img/logo_footer@2x.png";

import FooterLogo from '/public/img/logo(HQ).png';
// import Logo from '/public/img/logo.png';
import FooterLogo_2x from '/public/img/logo@2x.png';
import MobileLogo from '/public/img/mobile_logo.png';
import MobileLogo_2x from '/public/img/mobile_logo@2x.png';

export default function Footer() {
  return (
    <footer id={s.site_footer}>
      <Wrapper>
        <h2 className={s.logo_area}>
          <Link href="/" passHref>
            <a>
              <Image
                src={FooterLogo}
                srcSet={FooterLogo_2x}
                alt="Footer 로고"
              />
            </a>
          </Link>
        </h2>
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
            <li>
              <a
                href="https://www.facebook.com/BARFDOG_official-100623948688775"
                rel="noreferrer"
                target="_blank"
              >
                <FaFacebookSquare />
              </a>
            </li>
          </ul>
        </div>
        <div className={s.companyInfo_area}>
          {/* ORIGINAL FOOTER */}
          {/*<ul data-lang={'en'}>*/}
          {/*  <li>*/}
          {/*    <span className={s.info_title}>Business Number.</span>*/}
          {/*    <span className={s.info_cont}>486 18 01232</span>*/}
          {/*  </li>*/}
          {/*  <li>*/}
          {/*    <span className={s.info_title}>Permit Number.</span>*/}
          {/*    <span className={s.info_cont}>2020-ChungbukChungju-0634</span>*/}
          {/*  </li>*/}
          {/*  <li>*/}
          {/*    <span className={s.info_title}>Email.</span>*/}
          {/*    <span className={s.info_cont}>info@freshour.co.kr</span>*/}
          {/*  </li>*/}
          {/*  <li>*/}
          {/*    <span className={s.info_title}>Office.</span>*/}
          {/*    <span className={s.info_cont}>*/}
          {/*      4F, 208, Beonyeong daero, Chungju si,*/}
          {/*      Chungcheongbukdo, Republic of Korea*/}
          {/*    </span>*/}
          {/*  </li>*/}
          {/*  <li>*/}
          {/*    <span className={s.info_title}>Factory.</span>*/}
          {/*    <span className={s.info_cont}>*/}
          {/*      1F, 214, Beonyeong daero, Chungju si,*/}
          {/*      Chungcheongbukdo, Republic of Korea*/}
          {/*    </span>*/}
          {/*  </li>*/}
          {/*</ul>*/}
          
          {/* ! 221130 임시로 사용 => KSP 사이트키발급관련 검수로 인함   */}
          <ul data-lang={'ko'}>
            <li>
              <span className={s.info_title}>상호:</span>
              <span className={s.info_cont}>프레쉬아워</span>
            </li>
            <li>
              <span className={s.info_title}>대표:</span>
              <span className={s.info_cont}>임경호</span>
            </li>
            <li>
              <span className={s.info_title}>사업자번호:</span>
              <span className={s.info_cont}>486-18-01232</span>
            </li>
            <li>
              <span className={s.info_title}>Email.</span>
              <span className={s.info_cont}>info@freshour.co.kr</span>
            </li>
            <li>
              <span className={s.info_title}>주소:</span>
              <span className={s.info_cont}>충북 충주시 번영대로 214, 1층</span>
            </li>
            <li>
              <span className={s.info_title}>유선번호: </span>
              <span className={s.info_cont}>043-855-4995</span>
            </li>
          </ul>
        </div>
      </Wrapper>
    </footer>
  );
}