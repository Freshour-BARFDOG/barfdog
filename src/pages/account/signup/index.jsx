import React, {useState} from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from './signup.module.scss';
import {IoChevronForwardOutline} from "react-icons/io5"
import PureCheckbox from "../../../components/atoms/PureCheckbox";
import CustomRadio from "/src/components/atoms/CustomRadio";
import SignupInput from "./SignupInput";

/*
* MEMO 유효성검사
*
* MEMO 비밀번호 추가 내용 덧붙이기
* MEMO : 유효성 검사 추가하기
*
* */

const valid_isEmpty = (value) => {
  const errors = value ? '' : '항목이 비어있습니다.';
  return errors;
};


const validate = (obj) => {
  let errors = {};
  const keys = Object.keys(obj);

  keys.forEach((key) => {
    const val = obj[key];

    switch (key) {
      case "name":
        valid_isEmpty(val) && (errors[key] = "필수항목입니다.");
        break;

      default:
        break;
    }
  });

  // valid_isEmpty(file_pc.file) &&
  // (errors["file_pc"] = valid_isEmpty(file_pc.file));
  // valid_isEmpty(file_mobile.file) &&
  // (errors["file_mobile"] = valid_isEmpty(file_mobile.file));

  console.log("Validation Result: ", errors);
  return errors;
};
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
      <SignupInput type={"text"} required={true} id={"address"} title={"주소 검색"} addedClassName={'add-btn-section'}
                           disabled
                           setFormValues={setFormValues}
        >
          <div className={`${s.btn} ${s.bigbtn}`}>주소 검색</div>
        </SignupInput>
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
function SignupPage() {

  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  console.log(formValues);


  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
    setFormErrors(validate(formValues));
    // if (Object.keys(formErrors).length) return console.error(formErrors);
  }


  return (
    <Layout>
      <Wrapper>
        <div className={s.main}>
          <div className={s['main-title']}>
            <h2>회원가입</h2>
          </div>

          <div className={s['join-form']} method={'post'} encType={"application/x-www-form-urlencoded"}
               onSubmit={onSubmit}
          >
            <section className={s['input-section']}>
              <SignupInput type={"text"} required={true} id={"name"} title={"이름(견주님)"} setFormValues={setFormValues}/>
              <SignupInput type={"text"} required={true} id={"email"} title={"이메일주소(아이디)"}
                           addedClassName={'add-btn-section'}
                           setFormValues={setFormValues}
              >
                <div className={`${s.btn} ${s.smallbtn}`}>중복확인</div>
              </SignupInput>
              <SignupInput type={"password"} required={true} id={"pw"} title={"비밀번호"} setFormValues={setFormValues}/>
              <SignupInput type={"password"} required={true} id={"pw-confirm"} title={"비밀번호 확인"} setFormValues={setFormValues}/>
              <SignupInput type={"text"} required={true} id={"phone"} title={"휴대폰 번호"} addedClassName={'add-btn-section'} setFormValues={setFormValues}>
                <div className={`${s.btn} ${s.smallbtn}`}>인증번호 받기</div>
              </SignupInput>
              <SignupInput type={"text"} required={true} id={"address"} title={"주소 검색"} addedClassName={'add-btn-section'}
                           disabled
                           setFormValues={setFormValues}
              >
                <div className={`${s.btn} ${s.bigbtn}`}>주소 검색</div>
              </SignupInput>
              <SignupInput type={"text"} required={true} id={"birthday"} title={"생년월일(견주님)"} placeholder={'YYYY      /      MM      /      DD'}/>
              <div className={s['join__wrap']}>
                <div className={s['input-title-wrap']}>
                  <label htmlFor={'radios-gender'}>
                    <span className={`${s['inp-title']} ${s['required']}`}>{'성별(견주님)'}</span>
                  </label>
                </div>
                <div className={`${s['input-wrap']}`}>
                  <CustomRadio className={s['gender']}
                               name={"gender"}
                               labelList={[
                                 {label: '남자', value: 'man'},
                                 {label: '여자', value: 'woman'},
                                 {
                                   label: '선택안함', value: 'non-selected'
                                 }]} type={'radio'} setValue={setFormValues}/>
                </div>
              </div>
              <SignupInput type={"text"} required={false} id={"recommend-code"} title={"추천코드"} placeholder={'추천코드는 계정 당 한 번만 입력 가능합니다.'}/>
            </section>
            <section className={s['terms-section']}>
              <h4 className={`${s['main-title']}`}>이용약관 동의</h4>
              {/* 이용약관 동의 */}
              <div className={`${s['checkbox-wrap']} ${s['select-all']}`}>
                <PureCheckbox id={'agree-all'} className={s['agree-all']}>
                  <div className={s['desc-section']}>
                    <p className={s['title']}>전체 동의합니다.</p>
                    <p className={s['desc']}>선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.</p>
                  </div>
                </PureCheckbox>
              </div>

              <div className={`${s['checkbox-wrap']} ${s['space-between']}`}>
                <PureCheckbox id={'agree-service'}>
                  <p className={s['title']}>이용약관 동의 (필수)</p>
                </PureCheckbox>
                <div className={s.terms__view}>약관보기
                  <IoChevronForwardOutline/>
                </div>
              </div>

              {/* 개인정보 수집 이용동의  */}
              <div className={`${s['checkbox-wrap']} ${s['space-between']}`}>
                <PureCheckbox id={'agree-privacy'}>
                  <p className={s.title}>개인정보 수집 이용 동의 (필수)</p>
                </PureCheckbox>
                <div className={s.terms__view}>약관보기
                  <IoChevronForwardOutline/>
                </div>
              </div>
              {/* 무료배송, 할인쿠폰 등 혜택 / 정보 수신 동의 */}
              <div className={`${s['checkbox-wrap']} ${s['receive-event']}`}>
                <PureCheckbox id={'agree-event-channel-all'}>
                  <p className=''>무료배송, 할인쿠폰 등 혜택/정보 수신 동의 (선택)</p>
                </PureCheckbox>
                <div className={s['select-channel']}>
                  <div className={s['flex-wrap']}>
                    <PureCheckbox id={'agree-sms'} onChange={(val) => {
                      console.log(val)
                    }}>
                      <p>SMS</p>
                    </PureCheckbox>
                    <PureCheckbox id={'agree-email'}>
                      <p>이메일</p>
                    </PureCheckbox>
                  </div>
                  <p className={s.guidetext}>
                    <i className={s.icon}/>
                    모두 동의 시 적립금 1,000원 적립 (첫 주문 후 적용)
                  </p>
                </div>
              </div>
              <div className={s['checkbox-wrap']}>
                <PureCheckbox id={'agree-age'}>
                  <div>본인은 만 14세 이상입니다. (필수)</div>
                </PureCheckbox>
              </div>
            </section>
            <section className={s['btn-section']}>
              <button type={'submit'} className={`${s.btn} ${s.join}`} onClick={onSubmit}>회원가입</button>
            </section>
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}


export default SignupPage;

