import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { authAction } from "@store/auth-slice";
import { useModalContext } from "@store/modal-context";

import s from './login.module.scss'
import Image from 'next/image';
import Checkbox from '@src/components/atoms/Checkbox';
import getAdminToken from "@api/getAdminToken";

import Modal from '@src/components/modal/Modal';
import Modal_AdminResetPassword from "@src/components/modal/Modal_AdminResetPassword";
import Modal_global_alert from "@src/components/modal/Modal_global_alert";

// * 1. 로그인 클릭했을 때, 어드민 계정에 맞는지 안맞는지만 확인한다.
// * 2. 자동로그인 체크이벤트



function LoginIndexPage() {


  
  const dispatch = useDispatch();
  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState("");
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 여기서 Context값을 변화시킨다.
  const onModalShow = () => {
    mct.onShow();
  }
  
  const onModalHide = () => {
    mct.onHide();
  };

  useEffect(() => {
    // console.log(isSubmitting);
    // console.log(formErrors);


    if (isSubmitting && !Object.keys(formErrors).length) {
      (async () => {
        
        
        const token = await getAdminToken(formValues);
        if (token) {
          dispatch(authAction.adminLogin({ token: token }));
        } else {
          onModalShow();
          setIsSubmitting(false);
          setModalMessage(
            "로그인 실패: 아이디, 비밀번호를 확인해주세요. 지속적으로 문제발생 시, 서버장애일 수 있습니다."
          );
        }
      })();
    }
  }, [formErrors, formValues, isSubmitting, dispatch]);



  const onChangeHandler = (e) => {
    const input = e.currentTarget;
    const value = e.currentTarget.value;
    if(input.id === 'email') {
      setEmail(value);
    } else if (input.id === "pw") {
       setPw(value);
    }
  }

  const valid_isEmpty = (value) => {
    let errors;

    if (!value.trim()) {
      errors = "항목이 비어있습니다.";
    } else {
      errors = "";
    }
    return errors;
  };

  const validate = (obj) => {
    let errors = {};
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      const val = obj[key];
      valid_isEmpty(val) && (errors[key] = valid_isEmpty(val)); 
    })
    return errors;
  }
  

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    const values = {
      email: email,
      password: pw,
    };
    setFormErrors(validate(values));
    setFormValues(values);
    setIsSubmitting(true);
  }

  const onAutoLoginHandler =(checked) => {
    console.log(checked)
    if (checked){
      setModalMessage("개인 정보 보호를 위해 본인 기기에서만 이용해 주세요.");
      mct.onShow();
    }else{
      // 자동로그인 해제 로직
    }
  }


  return (
    <>
      <main id={s["loginPage"]}>
        <section className="flex-wrap">
          <div className={s.frame}>
            <div className={s.container}>
              <div className={s.row}>
                <header className={s["login-header"]}>
                  <div className={`${s.logo} img-wrap`}>
                    <Image
                      src={require("@public/img/logo(favicon).png")}
                      alt="로고"
                    ></Image>
                  </div>
                  <h1 className={s.title}>관리자 로그인</h1>
                </header>
                <form
                  className={s["login-body"]}
                  action="/api/login"
                  method="post"
                  onSubmit={onSubmitHandler}
                >
                  <div className={s["form-row"]}>
                    <label htmlFor="email">
                      <p>아이디</p>
                      <input
                        type="email"
                        id="email"
                        placeholder="이메일 주소를 입력해주세요."
                        value={email}
                        onChange={onChangeHandler}
                      />
                      {formErrors.email && (
                        <em className="errorMSG">{formErrors.email}</em>
                      )}
                    </label>
                  </div>
                  <div className={s["form-row"]}>
                    <label htmlFor="pw">
                      <p>비밀번호</p>
                      <input
                        type="password"
                        id="pw"
                        placeholder="비밀번호를 입력해주세요."
                        value={pw}
                        onChange={onChangeHandler}
                      />
                      {formErrors.password && (
                        <em className="errorMSG">{formErrors.password}</em>
                      )}
                    </label>
                  </div>
                  <div className={`${s["form-row"]} ${s.options}`}>
                    <span className={s["auto-login"]}>
                      <Checkbox
                        id="autoLogin"
                        label="자동로그인"
                        onClick={onAutoLoginHandler}
                      />
                    </span>
                    <span className={s["reset-pw"]}>
                      <button type="button" onClick={onModalShow}>
                        비밀번호 재설정
                      </button>
                    </span>
                  </div>
                  <div className={s["form-row"]}>
                    <div className={s["btn-section"]}>
                      <button
                        type="submit"
                        className="admin_btn solid confirm_l"
                      >
                        로그인
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Modal_global_alert message={mct.message} />
      {mct.isActive && (
        <Modal onClick={onModalHide} background title="비밀번호 재설정">
          <Modal_AdminResetPassword />
        </Modal>
      )}
      {/* {(modalMessage && (
        <Modal title="모달 메시지" instance={<Modal_alert />}>
          <Modal_alert text={modalMessage} isConfirm={onModalHide} />
        </Modal>
      )) ||
        (mct.isActive && (
          <Modal onClick={onModalHide} background title="비밀번호 재설정">
            <Modal_AdminResetPassword />
          </Modal>
        ))} */}
    </>
  );
}

export default LoginIndexPage;