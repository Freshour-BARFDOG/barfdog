import React, { useState } from 'react';
import s from '/src/pages/account/signup/signup.module.scss';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_emptyValue from '/util/func/filter_emptyValue';
const SingupInput = ({
  type,
  required,
  id,
  title,
  children,
  addedClassName,
  disabled,
  placeholder,
  setFormValues,
  errorMessage,
  filteredType,
}) => {
  const [value, setValue] = useState('');

  const onChangeHandler = (e) => {
    const { id, value } = e.currentTarget;
    let filteredValue = filter_emptyValue(value);
    if (filteredType === 'number') {
      filteredValue = filter_onlyNumber(filteredValue);
    }
    // console.log('id:',id,' val:',filteredValue);
    setValue(filteredValue);
    if (setFormValues && typeof setFormValues === 'function') {
      setFormValues((prevState) => {
        return {
          ...prevState,
          [id]: filteredValue,
        };
      });
    }
  };

  return (
    <>
      <div className={s['join__wrap']}>
        <div className={s['input-title-wrap']}>
          <label htmlFor={id}>
            <span className={`${s['inp-title']} ${required && s['required']}`}>{title}</span>
          </label>
        </div>
        <div className={`${s['input-cont-wrap']} ${s[addedClassName]}`}>
          <div className={s['input-wrap']}>
            <input
              type={type}
              id={id}
              disabled={disabled}
              placeholder={placeholder}
              onChange={onChangeHandler}
              value={value}
            />
            {errorMessage}
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default SingupInput;

/*
*
*
*
    function pw_regex_checking(){

        // PW 1
        if(pw.value === "") {
            pw_error_wrap.innerHTML = '<span class="error_box">비밀번호를 입력해주세요. (영문+숫자+특수기호를 포함한 8자리 ~ 20자리)</span>';
            return pw_regex = false;
        } else if(id.value !== "" && pw.value.indexOf(id.value) > -1){
            pw_error_wrap.innerHTML = '<span class="error_box">비밀번호는 아이디를 포함할 수 없습니다.</span>';
            pw.focus();
            pw_regex = false;
        }else if(!pattern1.test(pw.value)||!pattern2.test(pw.value)||!pattern3.test(pw.value)||pw.value.length<8||pw.value.length>20){
            pw_error_wrap.innerHTML = '<span class="error_box">비밀번호는 영문+숫자+특수기호를 포함한 8자리 ~ 20자리 입니다.</span>';
            pw.focus();
            pw_regex = false;
        } else{
            pw_error_wrap.innerHTML = "";
            pw_regex = true;
        }


        // PW - 동일성, 연속성 체크
        var SamePass_0 = 0; //동일문자 카운트
        var SamePass_1 = 0; //연속성(+) 카운드
        var SamePass_2 = 0; //연속성(-) 카운드

        for(var i=0; i < pw.value.length; i++) {
            var chr_pass_0;
            var chr_pass_1;
            var chr_pass_2;
            if(i >= 2) {
                chr_pass_0 = pw.value.charCodeAt(i-2);
                chr_pass_1 = pw.value.charCodeAt(i-1);
                chr_pass_2 = pw.value.charCodeAt(i);
                //동일문자 카운트
                if((chr_pass_0 == chr_pass_1) && (chr_pass_1 == chr_pass_2)) {
                    SamePass_0++;
                } else {
                    SamePass_0 = 0;
                }

                //연속성(+) 카운드
                if(chr_pass_0 - chr_pass_1 == 1 && chr_pass_1 - chr_pass_2 == 1) {
                    SamePass_1++;
                } else {
                    SamePass_1 = 0;
                }

                //연속성(-) 카운드
                if(chr_pass_0 - chr_pass_1 == -1 && chr_pass_1 - chr_pass_2 == -1) {
                    SamePass_2++;
                } else {
                    SamePass_2 = 0;
                }
            }

            if(SamePass_0 > 0) {
                pw_error_wrap.innerHTML = '<span class="error_box">동일문자를 3자 이상 연속 입력할 수 없습니다.</span>';
                pw_regex = false;
            }

            if(SamePass_1 > 0 || SamePass_2 > 0 ) {
                pw_error_wrap.innerHTML = '<span class="error_box">영문, 숫자는 3자 이상 연속 입력할 수 없습니다.</span>';
                pw_regex = false;
            }
        } // for(){}

        // PW1 PW2 일치여부
        if((pw.value !=  pw2.value) && pw2.value === "" ){
            pw2_error_wrap.innerHTML = '<span class="error_box">비밀번호 확인이 필요합니다.</span>';
            pw_matched = false;
        }else if((pw.value !=  pw2.value) && pw2.value !== "" ){
            pw2_error_wrap.innerHTML = '<span class="error_box">비밀번호가 일치하지 않습니다.</span>';
            pw2.focus();
            pw_matched = false;
        }else if(pw.value ===  pw2.value){
            pw2_error_wrap.innerHTML = '<span class="success_box">비밀번호가 일치합니다.</span>';
            pw_matched = true;
        }


        if(pw_matched === true && pw_regex === true) {
            pw_error_wrap.innerHTML = "";
            return key_PW = true;
        }else{
            return key_PW = false;
        }

    } // pw_regex_checking()

})(); // PW
*
* */
