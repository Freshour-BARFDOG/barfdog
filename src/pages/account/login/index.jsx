import React from 'react';
import Layout from '/src/components/common/Layout';
import Styles from './login.module.scss';
import Wrapper from '/src/components/common/Wrapper';
import Kakao from '/public/img/icon/kakao.png';
import Naver from '/public/img/icon/naver.png';
import Image from 'next/image';
import Link from 'next/link';

function Title (props) {
  return (
    <header className={Styles.title}>
      <h2>{props.name}</h2>
    </header>
  )
}

function InputBox (props){
  let content = null;
  if(props.mode==='을'){
    content= <input type="text" placeholder = {props.name + '을 입력해주세요.'} />
  } else {
    content =<input type="text" placeholder = {props.name + '를 입력해주세요.'} />
  }
  return (
      <div className={Styles.input__box}>
        <h4 className={Styles.input__title}>{props.name}</h4>
        {content}
      </div>
  )
}

function Btn (props) {
  return(
    <div className={Styles.btn__group}>
      <div className={`${Styles.btn} ${Styles.id__search}`}>{props.name}</div>
    </div>
  )
}

function List (props) {
  return (
    <li>
      <Link href={props.href} passHref>
        <a>{props.name}</a>
      </Link>
    </li>
  )
}

function H5 (props) {
  return (
    <h5 className={Styles.easylogin}>{props.name}</h5>
  )
}

export default function index() {
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

          {/* 체크박스 자식가능한지? */}
          <div className={Styles.auto__login__check}>
            <label htmlFor="agree" className={Styles.chk__box}>
              <input type="checkbox" id="agree" />
              <span className={Styles.on} />
              <div className={Styles.autologin}>자동 로그인</div>
            </label>
          </div>

          {/* 로그인 회원가입 버튼 */}
          <div className={Styles.btnbox}>
            <Btn name="로그인"></Btn>
          </div>

          <Btn name="회원가입"></Btn>

          {/* 아이디 선 비밀번호 찾기 */}
          <div className={Styles.id__pw__search}>
            <ul className={Styles.list}>
              <List name="아이디 찾기" href={'/account/findMyId'}/>
              <List name="비밀번호 찾기" href={"/account/findMyPw"}/>
            </ul>
          </div>

          {/* 선 */}
          <hr className={Styles.line} />

          <H5 name="간편 로그인"></H5>

          <div className={Styles.login_sns}>
            <Link href={"/"} passHref>
              <a>
                <Image
                  src={Kakao}
                  width={72}
                  height={72}
                  alt="카카오톡 아이콘"
                />
              </a>
            </Link>

            <Link href={"/"} className={Styles.anaver} passHref>
              <a>
                <Image
                  src={Naver}
                  width="72"
                  height="72"
                  alt="네이버 아이콘"
                />
              </a>
            </Link>
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}