import React from 'react';
import s from '/styles/css/footer.module.scss';
import Wrapper from '/src/components/common/Wrapper';
import Link from 'next/link';
import IMG from '/src/components/atoms/IMG';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import { faFaceGrinStars, faFaceAngry } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-regular-svg-icons';





function Footer() {
  return (
    <footer className={s.site_footer}>
      <FontAwesomeIcon icon={faFaceAngry} size="lg" />
      <FontAwesomeIcon icon={faFaceGrinStars} spin-reverse/>
      <Wrapper>
        <h2 className={s.logo_area}><Link href="/" passHref><a><IMG src="/img/icon/logo.png" srcSet="/img/icon/logo.png"></IMG></a></Link></h2>
        <div className={s.policy_area}>
          <ul>
            <li>
              <a href="/policy/privacy" rel='noreferrer' target="_blank">Privacy policy</a>
            </li>
            <li>
              <a href="/policy/terms" rel='noreferrer' target="_blank">Terms&Conditions</a>
            </li>
            {/* <FontAwesomeIcon icon={regular('coffee')} />  */}
          </ul>
 
        </div>
        <div className={s.sns_area}>
          <ul>
            <li>
              <i className="fa-solid fa-user"></i>
              {/* <a href="https://www.youtube.com/channel/UCf_VpnXwfLu6wQ1ADcXSphA/featured" rel='noreferrer' target="_blank"><FontAwesomeIcon icon={regular("brand youtube")} /></a> */}
              {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg> */}
            </li>
            <li>
              <a href="https://blog.naver.com/barfdog" rel='noreferrer' target="_blank"><IMG src="/img/icon/logo.png"></IMG></a>
            </li>
            <li>
              <a href="https://www.facebook.com/BARFDOG_official-100623948688775" rel='noreferrer' target="_blank"><IMG src="/img/icon/logo.png"></IMG></a>
            </li>
            <li>
              <a href="https://www.instagram.com/barfdog_official/" rel='noreferrer' target="_blank"><IMG src="/img/icon/logo.png"></IMG></a>
            </li>
          </ul>
        </div>
        <div className={s.companyInfo_area}>
          <ul>
            <li>
              <span className={s.info_title}>Business Number.</span>
              <span className={s.info_cont}>2020-ChungbukChungju-0634</span>
            </li>
             <li>
              <span className={s.info_title}>Permit Number.</span>
              <span className={s.info_cont}>486 18 01232</span>
            </li>
             <li>
              <span className={s.info_title}>Email.</span>
              <span className={s.info_cont}>info@freshour.co.kr</span>
            </li>
             <li>
              <span className={s.info_title}>Office.</span>
              <span className={s.info_cont}>4F, 208, Beonyeong daero, Chungju si,
Chungcheongbukdo, Republic of Korea</span>
            </li>
             <li>
              <span className={s.info_title}>Factory.</span>
              <span className={s.info_cont}>1F, 214, Beonyeong daero, Chungju si,
Chungcheongbukdo, Republic of Korea</span>
            </li>
          </ul>
        </div>
      </Wrapper>
    </footer>
  )
}

export default Footer;