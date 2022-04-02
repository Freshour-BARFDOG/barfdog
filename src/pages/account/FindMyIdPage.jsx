import React from 'react'
import s from "/styles/scss/FindMyId.module.scss";

function FindMyIdPage() {
  return (
    <section id="FindMyIdPage">
      <div className="container__outer">
        <div className="container">
          <div className="row">
            <div className={s.flex__container}>
              {/* 아이디 찾기 타이틀 */}
              <div className={s.title}>
                <h2 className={s.h2}>아이디 찾기</h2>
              </div>

              {/* 이름 입력 */}
              <div className={s.search_name}>
                <h4 className={s.input__title}>이름</h4>
                <input type="text" placeholder="이름을 입력해주세요"></input>
              </div>

              {/* 휴대폰 번호 입력 */}
              <div className={s.search_phone}>
                <h4 className={s.input__title}>휴대폰 번호</h4>
                <input
                  type="text"
                  placeholder="휴대폰 번호를 입력해주세요"
                ></input>
              </div>

              {/* 아이디 찾기 버튼 */}
              <div className={s.btn__group}>
                <div className={`${s.btn} ${s.id__search}`}>
                  아이디 찾기
                </div>
              </div>
            </div>
            {/* flex-container */}
          </div>
          {/* row */}
        </div>
        {/* container */}
      </div>
    </section>
  );
}

export default FindMyIdPage