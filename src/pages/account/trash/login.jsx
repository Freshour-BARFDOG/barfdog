import React from 'react'
import Styles from '../../../styles/css/LoginPage.module.scss';
import Wrapper from '../../components/common/Wrapper';
import Image from 'next/image'

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
      <a href="javascript:void(0)">{props.name}</a>
    </li>
  )
}

function H5 (props) {
  return (
    <h5 className={Styles.easylogin}>{props.name}</h5>
  )
}

export default function Login() {
  return (
    <Wrapper>
      <div className={Styles.flex__container}>
        
        {/* 로그인타이틀 */}
        <div className={Styles.titlebox}>
          <Title name='로그인'></Title>
        </div>

        {/* 아이디 비밀번호 인풋박스 */}
        <div className={Styles.inputbox}>
          <InputBox name='아이디'></InputBox>
          <InputBox name='비밀번호'></InputBox>
        </div>

        {/* 체크박스 자식가능한지? */}
        <div className={Styles.auto__login__check}>            
          <label htmlFor='agree' className={Styles.chk__box}>
            <input type="checkbox" id='agree' />
            <span className={Styles.on} /> 
            <div className={Styles.autologin}>자동 로그인</div>
          </label>
        </div>

        {/* 로그인 회원가입 버튼 */}
        <div className={Styles.btnbox}>
          <Btn name='로그인'></Btn>
        </div>
        
        <Btn name='회원가입'></Btn>

        {/*  */}
        <div className={Styles.id__pw__search}>
          <ul className={Styles.list}>
            <List name='아이디 찾기'></List>
            <List name='비밀번호 찾기'></List>
          </ul>
        </div>

         {/* 선 */}
         <hr className={Styles.line} />

         <H5 name='간편 로그인'></H5>

         <div className='login_sns'>
          <a href="javascript:void(0)" className='akakao'>
            
            {/* <Image src ='/img/icon/kakao.png' alt='kakao.log' className='pic-kakao'/> */}
          </a>
          
          <a href="javascript:void(0)" className='anaver'>
            {/* <Image src ='/img/icon/naver.png' alt='naver.log' className='pic-naver'/> */}
          </a>
        </div>
      </div>
    </Wrapper>
  )
}


