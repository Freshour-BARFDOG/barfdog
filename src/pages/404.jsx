import React from 'react';
import Button_moveToPage from '../components/atoms/Button_moveToPage';
import Wrapper from '/src/components/common/Wrapper';


function Custom404() {
  return (
    <Wrapper>
      <div className='inner'  style={{padding:"20vh 0 0"}}>
        <h1 style={{fontSize: '60px', fontWeight:'bold', textAlign:'center'}}>404 Not Found</h1>
        <h2 style={{fontSize: '30px', fontWeight:'500', textAlign:'center'}}>요청하신 페이지를 찾을 수 없습니다.</h2>
        <div style={{textAlign:'center', marginTop:'5vh'}}>
          <Button_moveToPage text="홈으로 돌아가기" path="/" />
        </div>
      </div>
      </Wrapper>
  )
}

export default Custom404