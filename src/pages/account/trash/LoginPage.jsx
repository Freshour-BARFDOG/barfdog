import React from 'react';
import Img from '/src/components/atoms/Img';
// import kakao from '/img/icon/kakao.png';
// import naver from '/img/icon/naver.png';
import '/styles/css/LoginPage.module.scss'

function login() {
  return (
    <section id="login">
      <div className='container-outer'>
        <div className="container">
          <div className="row">
            <div className='flex-container'>
              {/* 타이틀 */}
              <h2>로그인</h2>

              {/* 아이디 인풋박스 */}
              <div className='login_id'>
                <h4 className='input_title'>아이디</h4>
                <input type="text" placeholder="아이디를 입력해주세요" ></input>
              </div>

              {/* 비밀번호 인풋박스 */}
              <div className='login_pw'>
                <h4 className='input_title'>비밀번호</h4>
                <input type="password" placeholder="비밀번호를 입력해주세요"></input>
              </div>

              {/* 인풋 체크 및 자동 로그인 */}
              <div className='auto_login_check'>            
                <label htmlFor="agree" className="chk_box">
                  <input type="checkbox" id="agree" />
                  <span className="on" /> 
                  <div className='autologin'>자동 로그인</div>
                </label>
              </div>
              
              {/* 로그인 회원가입 버튼 */}
              <div className='btn-group'>
                <div className='btn login'>로그인</div>
                <div className='btn sign-up'>회원가입</div>
              </div>

              {/* 아이디 및 비번 찾기 리스트 */}
              <div className='id-pw-search'>
                <ul className='list'>
                  <li>
                    <a href="javascript:void(0)">아이디 찾기</a>
                  </li>
                  <li>
                    <a href="javascript:void(0)">비밀번호 찾기</a>
                  </li>
                </ul>
              </div>

              {/* 선 */}
              <hr className='line' />
              
              {/* 간편로그인 */}
              

              <div className='login_sns'>
                <a href="javascript:void(0)" className='akakao'>
                  <Img src ='/img/icon/kakao.png' alt='kakao.log' className='pic-kakao'/>
                </a>
                
                <a href="javascript:void(0)" className='anaver'>
                  <Img src ='/img/icon/naver.png' alt='naver.log' className='pic-naver'/>
                </a>
              </div>


            </div>{/* flex-container */}
          </div>{/* row */}
        </div>{/* container */}
      </div>
    </section>
  )
}

export default login;