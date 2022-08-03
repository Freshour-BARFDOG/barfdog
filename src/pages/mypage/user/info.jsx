import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './info.module.scss';
import SignInputList from '/src/components/user_signup/EditUserInfoInputList';
import { useModalContext } from '/store/modal-context';
import { useSelector } from 'react-redux';
import EditUserInfoPolicyList from '/src/components/user_signup/EditUserInfoPolicyList';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { validate } from '/util/func/validation/validation_editUserInfo';
import {
  valid_hasFormErrors,
} from '/util/func/validation/validationPackage';
import { putObjData } from '/src/pages/api/reqData';
import Spinner from "/src/components/atoms/Spinner";
import {useRouter} from "next/router";

export default function UserInfoPage() {
  const mct = useModalContext();
  const router = useRouter();
  const auth = useSelector((s) => s.auth);
  const userInfo = auth.userInfo;

  const initialFormValues = {
    name: userInfo.name,
    email:userInfo.email,
    password: null,
    phoneNumber:userInfo.phoneNumber,
    address: {
      zipcode: userInfo.address.zipcode,
      street: userInfo.address.street,
      city: userInfo.address.city,
      detailAddress: userInfo.address.detailAddress,
    },
    birthday: userInfo.birthday,
    gender: userInfo.gender,
    agreement: {
      receiveSms: userInfo.receiveSms,
      receiveEmail: userInfo.receiveEmail,
    },
    provider: userInfo.provider || null,
    providerId: userInfo.providerId || null,
  };

  // console.log('userState: ',userState)
  // console.log('initialFormValues: ',initialFormValues)
  const [alertModalMessage, setAlertModalMessage] = useState('');
  const [form, setForm] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [isSubmitted, setIsSubmitted] = useState( false);
  
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(form)
    if(isSubmitted)return console.error('이미 제출된 양식입니다.');
    const errObj = validate(form, formErrors);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    // console.log(form);
    if (!isPassed) {
      mct.alertShow();
      setAlertModalMessage('유효하지 않은 항목이 있습니다.');
      return;
    }
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const body = {
        name: form.name,
        password: form.password,
        phoneNumber: form.phoneNumber,
        address: {
          zipcode: form.address.zipcode,
          city: form.address.city,
          street: form.address.street,
          detailAddress: form.address.detailAddress,
        },
        birthday:form.birthday,
        gender:form.gender,
        receiveSms:form.receiveSms,
        receiveEmail:form.receiveEmail,
      };
      const url = '/api/members';
      const res = await putObjData(url, body);
      console.log(res);
      if (res.isDone ) {
        mct.alertShow();
        setIsSubmitted(true);
        setAlertModalMessage('회원정보가 정상적으로 변경되었습니다.');
      } else if(res.status === 400 ){
        mct.alertShow();
        const errorMessage = `현재 비밀번호가 올바르지 않습니다.`
        setAlertModalMessage(errorMessage);
        setFormErrors({
          password: errorMessage
        })
      }

     
    } catch (err) {
      console.error('통신에러: ', err);
      setAlertModalMessage(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };
  
  const onModalConfirmButtonClick = ()=>{
    window.location.reload();
  }
  
  const onClickWithdrawalButton = ()=>{
    if(confirm('회원탈퇴 페이지로 이동하시겠습니까?')){
      window.location.href ='/mypage/user/withdrawal';
    }
  }
  

  return (
    <>
      <MetaTitle title="마이페이지 회원정보변경" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
              <h1>회원 정보 변경</h1>
            </section>

            <section className={s.userContent}>
              <SignInputList
                formValues={form}
                setFormValues={setForm}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
              />
              <em className={s.divider}/>
              <EditUserInfoPolicyList
                formValues={form}
                setFormValues={setForm}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
              />
            </section>
            <section className={s.btn_section}>
              <div className={s.btn_box}>
                <button type={'button'} className={s.left_box} onClick={onClickWithdrawalButton}>
                  회원 탈퇴
                </button>
                <button type={'button'} className={s.right_box} onClick={onSubmit} disabled={isSubmitted}>
                  {isLoading.submit ? <Spinner style={{color:'#fff'}}/> : '저장'}
                </button>
              </div>
            </section>

            {/* ---------------  BEFORE --------------- */}
            {/* ---------------  BEFORE --------------- */}
            {/* ---------------  BEFORE --------------- */}
            {/* ---------------  BEFORE --------------- */}
            {/* ---------------  BEFORE --------------- */}

            {/*<section className={s.content}>*/}
            {/*  <div className={s.flex_box}>*/}
            {/*    <label className={s.label_box}>*/}
            {/*      <div className={s.left_box}>*/}
            {/*        이름 <span>*</span>*/}
            {/*      </div>*/}

            {/*      <div className={s.right_box}>*/}
            {/*        <input className= {s.input_box} type="text" />*/}
            {/*      </div>*/}
            {/*    </label>*/}
            {/*  </div>*/}

            {/*  <div className={s.flex_box}>*/}
            {/*    <label className={s.label_box}>*/}
            {/*      <div className={s.left_box}>*/}
            {/*        이메일주소(아이디) <span>*</span>*/}
            {/*      </div>*/}

            {/*      <div className={s.right_box_gray}>*/}
            {/*        <input className= {s.input_box} type="text" placeholder='barfdog@freshour.co.kr'/>*/}
            {/*      </div>*/}
            {/*    </label>*/}
            {/*  </div>*/}

            {/*  <div className={s.flex_box}>*/}
            {/*    <label className={s.label_box}>*/}
            {/*      <div className={s.left_box}>*/}
            {/*        비밀번호 <span>*</span>*/}
            {/*      </div>*/}

            {/*      <div className={s.right_box_gray}>*/}
            {/*        <input className= {s.input_box} type="text" placeholder='password'/>*/}
            {/*      </div>*/}
            {/*    </label>*/}
            {/*  </div>*/}

            {/*  <div className={s.flex_box}>*/}
            {/*    <label className={s.label_box}>*/}
            {/*      <div className={s.left_box}>*/}
            {/*        휴대폰 번호 <span>*</span>*/}
            {/*      </div>*/}

            {/*      <div className={s.mid_box}>*/}
            {/*        <input className= {s.input_box} type="text" placeholder='01012345678'/>*/}
            {/*        <div className={s.right_box_red}>*/}
            {/*          인증번호 받기*/}
            {/*        </div>*/}
            {/*      </div>*/}

            {/*    </label>*/}
            {/*  </div>*/}

            {/*  <div className={s.flex_box}>*/}
            {/*    <label className={s.label_box}>*/}
            {/*      <div className={s.left_top_box}>*/}
            {/*        주소 <span>*</span>*/}
            {/*      </div>*/}

            {/*      <div className={s.right_double_box}>*/}
            {/*        <input className= {s.input_box} type="text" placeholder='placeholder'/>*/}
            {/*        <input className= {s.input_box} type="text" placeholder='102호'/>*/}

            {/*        <div className={`${s.image} img-wrap`}>*/}
            {/*          <Image*/}
            {/*            src={require("public/img/mypage/info_magnifier.png")}*/}
            {/*            objectFit="cover"*/}
            {/*            layout="fill"*/}
            {/*            alt="카드 이미지"*/}
            {/*          />*/}
            {/*        </div>*/}
            {/*      </div>*/}
            {/*    </label>*/}
            {/*  </div>*/}

            {/*  <div className={s.flex_box}>*/}
            {/*    <label className={s.label_box}>*/}
            {/*      <div className={s.left_box}>*/}
            {/*        생년월일(견주님) <span>*</span>*/}
            {/*      </div>*/}

            {/*      <div className={s.right_box_gray}>*/}
            {/*        <input className= {s.input_box} type="text" placeholder='1999    /    12    /    31'/>*/}
            {/*      </div>*/}
            {/*    </label>*/}
            {/*  </div>*/}

            {/*  <div className={s.flex_box}>*/}
            {/*    <div className={s.label_box}>*/}
            {/*      <div className={s.left_box}>*/}
            {/*        성별 <span>*</span>*/}
            {/*      </div>*/}

            {/*      <div className={s.radio_box}>*/}
            {/*        <label>*/}
            {/*          <div>*/}
            {/*            <input type="radio" name="gender" /> 남자*/}
            {/*          </div>*/}
            {/*        </label>*/}

            {/*        <label>*/}
            {/*          <div>*/}
            {/*            <input type="radio" name="gender" />  여자*/}
            {/*          </div>*/}
            {/*        </label>*/}

            {/*        <label>*/}
            {/*          <div>*/}
            {/*            <input type="radio" name="gender" /> 선택안함*/}
            {/*          </div>*/}
            {/*        </label>*/}

            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</section>*/}

            {/*<section className={s.content2}>*/}
            {/*  <div className={s.flex_box}>*/}
            {/*    <div className={s.left_box}>*/}
            {/*      선택약관 동의*/}
            {/*    </div>*/}
            {/*    <div className={s.right_box}>*/}
            {/*      <label className={s.chk_box}>*/}
            {/*        <input type="checkbox"/>*/}
            {/*        <span className={s.on} />*/}
            {/*        <div className={s.text}>무료배송, 할인쿠폰 등 혜택 / 정보 수신 동의 (선택)</div>*/}
            {/*      </label>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*  <div className={s.flex_box}>*/}

            {/*    <div className={s.right_box2}>*/}
            {/*      <div>*/}
            {/*        <label className={s.chk_box}>*/}
            {/*          <input type="checkbox"/>*/}
            {/*          <span className={s.on} />*/}
            {/*          <div className={s.text}>SMS</div>*/}
            {/*        </label>*/}
            {/*      </div>*/}

            {/*      <div>*/}
            {/*        <label className={s.chk_box}>*/}
            {/*          <input type="checkbox"/>*/}
            {/*          <span className={s.on} />*/}
            {/*          <div className={s.text}>이메일</div>*/}
            {/*        </label>*/}
            {/*      </div>*/}

            {/*    </div>*/}
            {/*  </div>*/}
            {/*</section>*/}

            {/*<section className={s.btn_section}>*/}
            {/*  <div className={s.btn_box}>*/}
            {/*    <div className={s.left_box}>*/}
            {/*      회원 탈퇴*/}
            {/*    </div>*/}
            {/*    <div className={s.right_box}>*/}
            {/*      저장*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</section>*/}

            {/*<section className={s.add_page}>*/}
            {/*  <div className={s.amend}>*/}
            {/*    <div className={s.text}>*/}
            {/*      회원정보가 수정되었습니다.*/}
            {/*    </div>*/}
            {/*    <div className={s.btn_box}>*/}
            {/*      <div className={s.red_btn}>*/}
            {/*        확인*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</section>*/}

            {/*<br/>*/}

            {/*<section className={s.add_page}>*/}
            {/*  <div className={s.amend}>*/}
            {/*    <div className={s.text}>*/}
            {/*      비밀번호가 일치하지 않습니다*/}
            {/*    </div>*/}
            {/*    <div className={s.btn_box}>*/}
            {/*      <div className={s.red_btn}>*/}
            {/*        확인*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</section>*/}

            {/*<br/>*/}

            {/*<section className={s.add_page}>*/}
            {/*  <div className={s.amend}>*/}
            {/*    <div className={s.text}>*/}
            {/*      탈퇴되었습니다. 이용해 주셔서 감사합니다.*/}
            {/*    </div>*/}
            {/*    <div className={s.btn_box}>*/}
            {/*      <div className={s.red_btn}>*/}
            {/*        확인*/}
            {/*      </div>*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</section>*/}
          </MypageWrapper>
        </Wrapper>
      </Layout>
      <Modal_global_alert message={alertModalMessage} onClick={isSubmitted && onModalConfirmButtonClick}/>
    </>
  );
}
