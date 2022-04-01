import React from 'react'
import Styles from "/styles/scss/FindMyId.module.scss";

function FindMyIdPage() {
  return (
    <section id="FindMyIdPage">
      <div className="container__outer">
        <div className="container">
          <div className="row">
            <div className={Styles.flex__container}>
              {/* 아이디 찾기 타이틀 */}
              <div className={Styles.title}>
                <h2 className={Styles.h2}>아이디 찾기</h2>
              </div>

              {/* 이름 입력 */}
              <div className={Styles.search_name}>
                <h4 className={Styles.input__title}>이름</h4>
                <input type="text" placeholder="이름을 입력해주세요"></input>
              </div>

              {/* 휴대폰 번호 입력 */}
              <div className={Styles.search_phone}>
                <h4 className={Styles.input__title}>휴대폰 번호</h4>
                <input
                  type="text"
                  placeholder="휴대폰 번호를 입력해주세요"
                ></input>
              </div>

              {/* 아이디 찾기 버튼 */}
              <div className={Styles.btn__group}>
                <div className={`${Styles.btn} ${Styles.id__search}`}>
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