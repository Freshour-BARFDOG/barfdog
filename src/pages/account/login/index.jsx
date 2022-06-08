import React from 'react';
import Layout from '/src/components/common/Layout';
import Styles from './login.module.scss';
import Wrapper from '/src/components/common/Wrapper';
import Kakao from '/public/img/icon/kakao.png';
import Naver from '/public/img/icon/naver.png';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';

function Title(props) {
  return (
    <header className={Styles.title}>
      <h2>{props.name}</h2>
    </header>
  )
}

function InputBox(props) {
  let content = null;
  if (props.mode === '을') {
    content = <input type="text" placeholder={props.name + '을 입력해주세요.'}/>
  } else {
    content = <input type="text" placeholder={props.name + '를 입력해주세요.'}/>
  }
  return (
    <div className={Styles.input__box}>
      <h4 className={Styles.input__title}>{props.name}</h4>
      {content}
    </div>
  )
}

function Btn(props) {
  return (
    <div className={Styles.btn__group}>
      <button type={'button'} className={`${Styles.btn} ${Styles.id__search}`}>{props.name}</button>
    </div>
  )
}

function List(props) {
  return (
    <li>
      <Link href={props.href} passHref>
        <a>{props.name}</a>
      </Link>
    </li>
  )
}

export default function index() {

  const router = useRouter();

  function kakaoLoginFunc() {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    router.push(KAKAO_AUTH_URL)
  }

  return (
    <Layout>
      <Wrapper>
        <div className={Styles.flex__container}>
          {/* 로그인타이틀 */}
          <div className={Styles.titlebox}>
            <Title name="로그인"></Title>
          </div>

          {/* 아이디 비밀번호 인풋박스 */}
          <div className={Styles.inputbox}>
            <InputBox name="아이디"></InputBox>
            <InputBox name="비밀번호"></InputBox>
          </div>

          <div className={Styles.auto__login__check}>
            <label htmlFor="agree" className={Styles.chk__box}>
              <input type="checkbox" id="agree"/>
              <span className={Styles.on}/>
              <div className={Styles.autologin}>자동 로그인</div>
            </label>
          </div>

          <div className={Styles.btnbox}>
            <button type={'button'} className={`${Styles.btn} ${Styles.btn_login}`}>로그인</button>
            <Link href={"/account/signup"} passHref>
              <a>
                <button type={'button'} className={`${Styles.btn} ${Styles.btn_signup}`}>회원가입</button>
              </a>
            </Link>
          </div>
          {/* 아이디 선 비밀번호 찾기 */}
          <div className={Styles.id__pw__search}>
            <ul className={Styles.list}>
              <List name="아이디 찾기" href={'/account/findMyId'}/>
              <List name="비밀번호 찾기" href={"/account/findMyPw"}/>
            </ul>
          </div>
          <h5 className={Styles.easylogin}>간편로그인</h5>
          <div className={Styles.login_sns}>
            <button type={"button"} className={Styles.kakao}
                    onClick={kakaoLoginFunc}
            >
              <Image
                src={Kakao}
                width={72}
                height={72}
                alt="카카오톡 아이콘"
              />
            </button>
            <button className={Styles.naver} type={"button"}>
              <Image
                src={Naver}
                width="72"
                height="72"
                alt="네이버 아이콘"
              />
            </button>
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}