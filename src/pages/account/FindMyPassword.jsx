import React from 'react'
import '../../styles/css/FindMyPassword.scss';

function FindMyPassword() {
  return (
    <section id ='FindMyPassword'>
      <div className='container-outer'>
        <div className='container'>
          <div className='row'>
            <div className='flex-container'>
              {/* 비밀번호 찾기 타이틀 */}
              <div className='title'>
                <h2>비밀번호 찾기</h2>
              </div>

              {/* 아이디(이메일주소) 입력 */}
              <div className='search_id'>
                <h4 className='input_title'>아이디(이메일주소)</h4>
                <input type="text" placeholder="아이디(이메일주소)를 입력해주세요" ></input>
              </div>

              {/* 이름 입력 */}
              <div className='search_name'>
                <h4 className='input_title'>이름</h4>
                <input type="text" placeholder="이름을 입력해주세요"></input>
              </div>

              {/* 휴대폰 번호 입력 입력양식 어떻게 처리?*/}
              <div className='search_phone'>
                <h4 className='input_title'>휴대폰번호</h4>
                <input type="text" placeholder="휴대폰 번호를 입력해주세요"></input>
              </div>

              {/* 임시비밀번호 받기 버튼 */}
              <div className='btn-group'>
                <div className='btn pw-search'>임시비밀번호 받기</div>
              </div>

            </div>{/* flex-container */}
          </div>{/* row */}
        </div>{/* container */}
      </div>
    </section>
  )
}

export default FindMyPassword