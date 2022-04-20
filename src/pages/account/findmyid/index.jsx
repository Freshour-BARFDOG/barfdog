import React from 'react';
import Styles from '/styles/css/FindMyId.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
// import MypageWrapper from "/src/components/mypage/MypageWrapper";


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


export default function Mypage() {
  return (
    <Layout>
      <Wrapper>
        
      <div className={Styles.flex__container}>

        <Title name='아이디 찾기'></Title>

        <div className={Styles.input__field}>
          <InputBox name ='이름' mode = '을' ></InputBox>
          <InputBox name ='휴대폰 번호'></InputBox>
        </div>

        <Btn name ='아이디 찾기'></Btn>

        </div>

      </Wrapper>
    </Layout>
  );
}