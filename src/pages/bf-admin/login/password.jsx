import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import s from "./login.module.scss";
import Image from "next/image";
import Link from "next/link";



function ResetPasswordPage() {
  const router = useRouter();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAdmin = useSelector((state) => state.auth.isAdmin);


  useEffect(() => {
    if (!isAdmin) router.push("/bf-admin/login"); // Redirection : 인증되지 않고, 해당 페이지 접근한 경우

    if (isSubmitting && !Object.keys(formErrors).length) {
      console.log("데이터 전송");
    } else {
      console.error(formErrors);
    }
  }, [formErrors, isSubmitting, isAdmin, router]);

  const valid_isEmpty = (value) => {
    let errors;

    if (!value) {
      errors = "항목이 비어있습니다.";
    } else {
      errors = "";
    }

    return errors;
  };

  const valid_password = (value) => {
    let errorsMessage;

    const regexURL = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "gi"
    ); // fragment locator

    const RESULT = regexURL.test(value);

    /* 
      ✕ 최소 7자 이상
      ✕ 영문/숫자/특수문자(공백제외)만 허용, 2개이상 조합
      ✓ 동일한 숫자 3개이상 연속 사용불가 
     */
    if (value && !RESULT) {
      errorsMessage = "유효하지 않은 비밀번호 형식을 확인해주세요.";
    } else {
      errorsMessage = "";
    }

    return errorsMessage;
  };
  return (
    <>
      <main id={s["loginPage"]}>
        <section className="flex-wrap">
          <div className={s.frame}>
            <div className={s.container}>
              <div className={s.row}>
                <header className={s["login-header"]}>
                  <div className={`${s.logo} img-wrap`}>
                    <Link href="/bf-admin/login">
                      <a>
                        <Image
                          src={require("@public/img/logo(favicon).png")}
                          alt="로고"
                        ></Image>
                      </a>
                    </Link>
                  </div>
                  <h1 className={s.title}>관리자 비밀번호 재설정</h1>
                </header>
                <form
                  className={s["login-body"]}
                  action="/api/login"
                  method="post"
                >
                  <div className={s["form-row"]}>
                    <label htmlFor="pw">
                      <p>비밀번호</p>
                      <input
                        type="password"
                        id="pw"
                        placeholder="영문/숫자/특수문자를 포함한 7 ~ 15자"
                      />
                    </label>
                  </div>
                  <div className={s["form-row"]}>
                    <label htmlFor="pw2">
                      <p>비밀번호 확인</p>
                      <input
                        type="password"
                        id="pw2"
                        placeholder="비밀번호 재입력"
                      />
                    </label>
                  </div>
                  <div className={`${s["form-row"]} ${s["btn-section"]}`}>
                    <button
                      type="button"
                      className="admin_btn solid confirm_l fullWidth"
                    >
                      비밀번호 재설정
                    </button>
                  </div>
                  <div className={`${s["form-row"]} ${s["btn-section"]}`}></div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default ResetPasswordPage;
