import React from 'react';
import Layout from '../../../components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import Styles from '/styles/css/SignUpPage.module.scss';
import {IoChevronForwardOutline} from "react-icons/io5"
import DaumPostcode from 'react-daum-postcode';


function Title(props) {
  return (
    <header className={Styles.title}>
      <h2>{props.name}</h2>
    </header>
  )
}

function Post(props) {
  const address = props.address;
  const setAddress = props.setAddress;
  const setZonecode = props.setZonecode;

  const onCompletePost = (data) => {
    console.log(data);
    console.log(data.address);
    setAddress(data.address);
    setZonecode(data.zonecode);
  };

  return (
    <DaumPostcode
      className={Styles.addresspopup}
      autoClose
      onComplete={onCompletePost}
    />
  );

};

function Postcode() {
  // 주소 검색 팝업화면
  const [popup, setPopup] = React.useState(false);
  // 주소
  const [address, setAddress] = React.useState("");
  // 상세주소
  const [detailAddress, setDetailAddress] = React.useState("");
  // 우편번호
  const [zonecode, setZonecode] = React.useState("");

  return (
    <>
      <div className={Styles.join__wrap}>
        <div className={Styles.join__left}>
          <label>
            <span>주소</span>
          </label>
        </div>
        <div className={Styles.join__right}>
          {address === '' ?
            <div className={`${Styles.btn} ${Styles.bigbtn}`}
                 onClick={() => {
                   setPopup(!popup);
                 }}
            >주소 검색</div>
            :
            <div>
              <label onClick={(e) => {
                e.preventDefault();
                setPopup(!popup);
              }}>
                <input type="text" value={`${zonecode} ${address}`}/>
              </label>


            </div>
          }
        </div>
      </div>
      {
        address !== '' ?
          <div className={Styles.join__wrap}>
            <div className={Styles.join__right}>

              <input type="text" value={detailAddress}
                onChange={(e) => {
                  setDetailAddress(e.target.value)
                }}
              />
            </div>
          </div>
          : null
      }
      {
        popup &&
        <div>
          <Post address={address} setAddress={setAddress} setZonecode={setZonecode}/>
        </div>
      }
    </>

  );

}

export default function signup() {
  return (
    <Layout>
      <Wrapper>
        <div className={Styles.flex__container}>

          {/* 회원가입 타이틀 */}
          <div className={Styles.title}>
            <Title name='회원가입'></Title>
          </div>

          {/* 인풋 구역 */}
          <div className={Styles.join__inp}>
            {/* 이름견주 2구역*/}
            <div className={Styles.join__wrap}>
              <div className={Styles.join__left}>
                <label htmlFor="input_name">
                  <span>이름(견주님)</span>
                </label>
              </div>
              <div className={Styles.join__right}>
                <input type="text" id='input_name'/>
              </div>
            </div>

            {/* 이메일주소 3구역 */}
            <div className={Styles.join__wrap}>
              <div className={Styles.join__left}>
                <label htmlFor="input_email">
                  <span>이메일주소(아이디)</span>
                </label>
              </div>
              <div className={Styles.join__middle}>
                <input type="text" id='input_email'/>
                <div className={`${Styles.btn} ${Styles.smallbtn}`}>중복확인</div>
              </div>
            </div>

            {/* 비밀번호 2구역 */}
            <div className={Styles.join__wrap}>
              <div className={Styles.join__left}>
                <label htmlFor="input_password">
                  <span>비밀번호</span>
                </label>
              </div>
              <div className={Styles.join__right}>
                <input type="password" id='input_password'/>
              </div>
            </div>

            {/* 비밀번호확인 2구역 */}
            <div className={Styles.join__wrap}>
              <div className={Styles.join__left}>
                <label htmlFor="input_password_chk">
                  <span>비밀번호 확인</span>
                </label>
              </div>
              <div className={Styles.join__right}>
                <input type="password" id='input_password_chk'/>
              </div>
            </div>

            {/* 휴대폰 번호 3구역 */}
            <div className={Styles.join__wrap}>
              <div className={Styles.join__left}>
                <label htmlFor="input_phone">
                  <span>휴대폰 번호</span>
                </label>
              </div>
              <div className={Styles.join__middle}>
                <input type="text" id='input_phone'/>
                <div className={`${Styles.btn} ${Styles.smallbtn}`}>인증번호 받기</div>
              </div>
            </div>

            {/* 주소 2구역 버튼 */}
            <Postcode/>

            {/* 생년월일(견주) 2구역 */}
            <div className={Styles.join__wrap}>
              <div className={Styles.join__left}>
                <label htmlFor="input_brith">
                  <span>생년월일(견주님)</span>
                </label>
              </div>
              <div className={Styles.join__right}>
                <input type="password" id='input_brith'/>
              </div>
            </div>

            {/* 성별(견주) 2구역 */}
            <div className={Styles.join__wrap}>
              <div className={Styles.join__left}>
                <label>
                  <span>성별(견주님)</span>
                </label>
              </div>
              <div className={Styles.join__right}>
                여기에 라디오박스 3개 남자 여자 선택안함
              </div>
            </div>


            {/* 추천코드 2구역 */}
            <div className={Styles.join__wrap}>
              <div className={Styles.join__left}>
                <label htmlFor="input_referralcode">
                  <span>추천코드</span>
                </label>
              </div>
              <div className={Styles.join__right}>
                <input type="password" id='input_referralcode'/>
              </div>
            </div>
          </div>
          {/* join_inp */}

          {/* 선 width값에 따라 변함*/}
          <hr className={Styles.line}/>

          {/* 이용약관 동의 */}
          <div className={Styles.terms__accept}>
            <h4 className={Styles.agree__text}>이용약관 동의</h4>
          </div>


          {/* 동의 체크박스  */}
          <div className={Styles.checkbox}>
            <label htmlFor="agree_all" className={Styles.chk__box}>
              <input type="checkbox" id="agree_all"/>
              <span className={Styles.on}/>
              <div className=''>전체 동의합니다.</div>
            </label>
            <div>선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.</div>
          </div>

          {/* 이용약관 동의 */}
          <div className={Styles.checkbox}>
            <label htmlFor="agree" className={Styles.chk__box}>
              <input type="checkbox" id="agree"/>
              <span className={Styles.on}/>
              <div className=''>이용약관 동의 (필수)</div>
            </label>


            {/* 약관보기 부분 */}
            <div className={Styles.terms__view}>약관보기
              <IoChevronForwardOutline/>
            </div>
          </div>

          {/* 개인정보 수집 이용동의  */}
          <div className={Styles.checkbox}>
            <label htmlFor="agree_info" className={Styles.chk__box}>
              <input type="checkbox" id="agree_info"/>
              <span className={Styles.on}/>
              <div className=''>개인정보 수집 이용 동의 (필수)</div>
            </label>

            {/* 약관보기 부분 */}
            <div className={Styles.terms__view}>약관보기
              <IoChevronForwardOutline/>
            </div>
          </div>


          {/* 무료배송, 할인쿠폰 등 혜택 / 정보 수신 동의 */}
          <div className={Styles.checkbox}>
            <label htmlFor="agree_coupon" className={Styles.chk__box}>
              <input type="checkbox" id="agree_coupon"/>
              <span className={Styles.on}/>
              <div className=''>무료배송, 할인쿠폰 등 혜택/정보 수신 동의 (선택)</div>
            </label>
          </div>


          {/* SMS */}
          <div className={Styles.checkbox1}>
            <div className={Styles.checkboxleft}>
              <label htmlFor="agree_sms" className={Styles.chk__box}>
                <input type="checkbox" id="agree_sms"/>
                <span className={Styles.on}/>
                <div className=''>SMS</div>
              </label>
            </div>

            <div className={Styles.checkboxright}>
              <label htmlFor="agree_email" className={Styles.chk__box}>
                <input type="checkbox" id="agree_email"/>
                <span className={Styles.on}/>
                <div className=''>이메일</div>
              </label>
            </div>

            <div className={Styles.guidetext}>
              <i className={`${Styles.icon} ${Styles.recycle}`}>
                {/* <img clssName = 'guide' src = {guide} /> */}
              </i>
              모두 동의 시 적립금 1,000원 적립 (첫 주문 후 적용)
            </div>
          </div>


          {/* 본인은 만 14세 이상입니다*/}
          <div className={Styles.checkbox}>
            <label htmlFor="agree_age" className={Styles.chk__box}>
              <input type="checkbox" id="agree_age"/>
              <span className={Styles.on}/>
              <div className=''>본인은 만 14세 이상입니다.</div>
            </label>
          </div>

          {/* 회원가입버튼 */}
          <div className={Styles.join}>
            <div className={`${Styles.btn} ${Styles.joinbtn}`}>회원가입</div>
          </div>

        </div>
        {/* flex__container */}
      </Wrapper>
    </Layout>
  );
}