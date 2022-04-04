import React from 'react';
import "/styles/css/SignUpPage.module.scss";


function SignUp(props) {
  return (
    <section id='SignUp'>
      <div className='container-outer'>
        <div className="container">
          <div className="row">
            <div className='flex-container'>
              {/* 회원가입 타이틀 */}
              <div className='title'>
                <h2>회원가입</h2>
              </div>

              {/* 인풋 구역 */}
              <div className='join_inp'>
                {/* 이름견주 2구역*/}
                <div className='join_wrap'>
                  <div className='join_left'>
                    <label For="input_name">
                      <span>이름(견주님)</span>
                    </label>
                  </div>
                  <div className='join_right'>
                    <input type="text" id='input_name' />
                  </div>
                </div>

                {/* 이메일주소 3구역 */}
                <div className='join_wrap'>
                  <div className='join_left'>
                    <label For="input_email">
                      <span>이메일주소(아이디)</span>
                    </label>
                  </div>
                                  
                  <div className='join_middle'>
                      <input type="text" id='input_email' />
                      <div className='btn smallbtn'>중복확인</div>
                  </div>
                </div>
                
                  {/* 비밀번호 2구역 */}
                <div className='join_wrap'>
                  <div className='join_left'>
                    <label For="input_password">
                      <span>비밀번호</span>
                    </label>
                  </div>
                  <div className='join_right'>
                  <input type="password" id='input_password' />
                </div>
                </div>

                {/* 비밀번호확인 2구역 */}
                <div className='join_wrap'>
                  <div className='join_left'>
                    <label For="input_password_chk">
                      <span>비밀번호 확인</span>
                    </label>
                  </div>
                  <div className='join_right'>
                    <input type="password" id='input_password_chk' />
                  </div>
                </div>

                {/* 휴대폰 번호 3구역 */}
                <div className='join_wrap'>
                  <div className='join_left'>
                    <label For="input_phone">
                      <span>휴대폰 번호</span>
                    </label>
                  </div>
                  <div className='join_middle'>
                      <input type="text" id='input_phone' />
                      <div className='btn smallbtn'>인증번호 받기</div>
                  </div>
                </div>

                {/* 주소 2구역 버튼 */}
                <div className='join_wrap'>
                  <div className='join_left'>
                    <label>
                      <span>주소</span>
                    </label>
                  </div>
                  <div className='join_right'>
                   <div className='btn bigbtn'>주소 검색</div>
                  </div>
                </div>

                {/* 생년월일(견주) 2구역 */}
                <div className='join_wrap'>
                  <div className='join_left'>
                    <label For="input_brith">
                      <span>생년월일(견주님)</span>
                    </label>
                  </div>
                  <div className='join_right'>
                    <input type="password" id='input_brith' />
                  </div>
                </div>

                {/* 성별(견주) 2구역 */}
                <div className='join_wrap'>
                  <div className='join_left'>
                    <label>
                      <span>성별(견주님)</span>
                    </label>
                  </div>
                  <div className='join_right'>
                    여기에 라디오박스 3개 남자 여자 선택안함
                  </div>
                </div>


                {/* 추천코드 2구역 */}
                <div className='join_wrap'>
                  <div className='join_left'>
                    <label For="input_referralcode">
                      <span>추천코드</span>
                    </label>
                  </div>
                  <div className='join_right'>
                    <input type="password" id='input_referralcode' />
                  </div>
                </div>
              </div> {/* join_inp */}

              {/* 선 width값에 따라 변함*/}
              <hr className='line' />
              
              {/* 이용약관 동의 */}
              <div className='terms_accept'>
                <h4 className='agree_text'>이용약관 동의</h4>
              </div>


              {/* 동의 체크박스  */}
              <div className='checkbox'>            
                <label htmlFor="agree_all" className="chk_box">
                  <input type="checkbox" id="agree_all" />
                  <span className="on" /> 
                  <div className=''>전체 동의합니다.</div>
                </label>
                <div>선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.</div>
              </div>
              
              {/* 이용약관 동의 */}
              <div className='checkbox'>            
                <label htmlFor="agree" className="chk_box">
                  <input type="checkbox" id="agree" />
                  <span className="on" /> 
                  <div className=''>이용약관 동의 (필수)</div>
                </label>
              </div>
              {/* 개인정보 수집 이용동의  */}
              <div className='checkbox'>            
                <label htmlFor="agree" className="chk_box">
                  <input type="checkbox" id="agree" />
                  <span className="on" /> 
                  <div className=''>개인정보 수집 이용 동의 (필수)</div>
                </label>
              </div>
              {/* 무료배송, 할인쿠폰 등 혜택 / 정보 수신 동의 */}
              <div className='checkbox'>            
                <label htmlFor="agree" className="chk_box">
                  <input type="checkbox" id="agree" />
                  <span className="on" /> 
                  <div className=''>무료배송, 할인쿠폰 등 혜택/정보 수신 동의 (선택)</div>
                </label>
              </div>
              {/* SMS */}
              <div className='checkboxleft'>            
                <label htmlFor="agree" className="chk_box">
                  <input type="checkbox" id="agree" />
                  <span className="on" /> 
                  <div className=''>SMS</div>
                </label>
              </div>

              {/* 이메일 */}



              {/* 본인은 만 14세 이상입니다*/}
              <div className='checkbox'>            
                <label htmlFor="agree" className="chk_box">
                  <input type="checkbox" id="agree" />
                  <span className="on" /> 
                  <div className=''>본인은 만 14세 이상입니다.</div>
                </label>
              </div>



              
            </div> {/* flex-container */}
          </div>{/* row */}
        </div>{/* container */}
      </div>
    </section>
  )
}

export default SignUp