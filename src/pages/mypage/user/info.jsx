import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import s from "styles/css/mypage/user/info.module.scss";
import Image from 'next/image';

function UserInfoPage() {
  return (
    <>
      <MetaTitle title="마이페이지 회원정보변경"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>


            <section className={s.title}>
              <div>
                회원 정보 변경
              </div>
            </section>

            <section className={s.content}>
              <div className={s.flex_box}>
                <label className={s.label_box}>
                  <div className={s.left_box}>
                    이름 <span>*</span>
                  </div>

                  <div className={s.right_box}>
                    <input className= {s.input_box} type="text" />
                  </div>
                </label>
              </div>

              <div className={s.flex_box}>
                <label className={s.label_box}>
                  <div className={s.left_box}>
                    이메일주소(아이디) <span>*</span>
                  </div>

                  <div className={s.right_box_gray}>
                    <input className= {s.input_box} type="text" placeholder='barfdog@freshour.co.kr'/>
                  </div>
                </label>
              </div>

              <div className={s.flex_box}>
                <label className={s.label_box}>
                  <div className={s.left_box}>
                    비밀번호 <span>*</span>
                  </div>

                  <div className={s.right_box_gray}>
                    <input className= {s.input_box} type="text" placeholder='password'/>
                  </div>
                </label>
              </div>

              <div className={s.flex_box}>
                <label className={s.label_box}>
                  <div className={s.left_box}>
                    휴대폰 번호 <span>*</span>
                  </div>

                  <div className={s.mid_box}>
                    <input className= {s.input_box} type="text" placeholder='01012345678'/>
                  </div>
                  <div className={s.right_box_red}>
                    <div className={s.btn}>
                      인증번호 받기
                    </div>
                  </div>
                </label>
              </div>

              <div className={s.flex_box}>
                <label className={s.label_box}>
                  <div className={s.left_top_box}>
                    주소 <span>*</span>
                  </div>

                  <div className={s.right_double_box}>
                    <input className= {s.input_box} type="text" placeholder='placeholder'/>
                    <input className= {s.input_box} type="text" placeholder='102호'/>

                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/mypage/info_magnifier.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                  </div>
                </label>
              </div>

              <div className={s.flex_box}>
                <label className={s.label_box}>
                  <div className={s.left_box}>
                    생년월일(견주님) <span>*</span>
                  </div>

                  <div className={s.right_box_gray}>
                    <input className= {s.input_box} type="text" placeholder='1999    /    12    /    31'/>
                  </div>
                </label>
              </div>

              <div className={s.flex_box}>
                <div className={s.label_box}>
                  <div className={s.left_box}>
                    성별 <span>*</span>
                  </div>
                 
                  <div className={s.radio_box}>
                    <label>
                      <div>
                        <input type="radio" name="gender" /> 남자
                      </div>
                    </label>

                    <label>
                      <div>
                        <input type="radio" name="gender" />  여자
                      </div>
                    </label>

                    <label>
                      <div>
                        <input type="radio" name="gender" /> 선택안함
                      </div>
                    </label>

                  </div>
                </div>
              </div>
            </section>

            <section className={s.content2}>
              <div className={s.flex_box}>
                <div className={s.left_box}>
                  선택약관 동의
                </div>
                <div className={s.right_box}>
                  <label className={s.chk_box}>
                  <input type="checkbox"/>
                  <span className={s.on} /> 
                    <div className={s.text}>무료배송, 할인쿠폰 등 혜택 / 정보 수신 동의 (선택)</div>
                  </label>
                </div>
              </div>
              <div className={s.flex_box}>
             
                
                <div className={s.right_box2}>
                  <div>
                    <label className={s.chk_box}>
                      <input type="checkbox"/>
                      <span className={s.on} /> 
                        <div className={s.text}>SMS</div>
                    </label>
                  </div>

                  <div>
                    <label className={s.chk_box}>
                      <input type="checkbox"/>
                      <span className={s.on} /> 
                      <div className={s.text}>이메일</div>
                    </label>
                  </div>

                </div>
              </div>
            </section>

            <section className={s.btn_section}>
              <div className={s.btn_box}>
                <div className={s.left_box}>
                  회원 탈퇴
                </div>
                <div className={s.right_box}>
                  저장
                </div>
              </div>
            </section>

          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default UserInfoPage;