import React from 'react';
import Styles from "/styles/css/FindMyId.module.scss";
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
// import MypageWrapper from "/src/components/mypage/MypageWrapper";
// import Checkbox from '../../components/atoms/checkbox';

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

export default function FindMyPassword() {
  return (
    <Layout>
      <Wrapper>
      <div className={Styles.flex__container}>

        {/* 비밀번호 찾기 타이틀 */}
        <Title name='비밀번호 찾기'></Title>

        {/* 아이디(이메일주소) 입력 */}
        <div className={Styles.input__field}>
          <InputBox name='아이디(이메일주소)'></InputBox>
          <InputBox name='이름' mode ='을'></InputBox>
          <InputBox name='휴대폰 번호'></InputBox>
        </div>

        {/* 임시비밀번호 받기 버튼 */}
        <Btn name='임시비밀번호 받기'></Btn>

      </div>
      </Wrapper>
    </Layout>
  );
}
