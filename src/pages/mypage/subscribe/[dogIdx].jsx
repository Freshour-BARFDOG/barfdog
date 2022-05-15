import React, { useState, useRef, useEffect } from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import { useRouter } from "next/router";
import Styles from "/styles/css/mypage/subscribe/[dogIdx].module.scss";
import Image from 'next/image';

import { slideUp , slideDown } from "/util/func/slideToggle";


const ReviewItem = () => {

  const [visible, setVisible ] = useState(false);
  const boxRef = useRef(null);
  const onClickHandler = (e) => {
    visible ? setVisible(false) : setVisible(true);
  };

  useEffect(() => {
    const selectedElem = boxRef.current;
    if (!selectedElem) return;
    visible ? slideDown(selectedElem) : slideUp(selectedElem);
  }, [visible]);

  return (
    <div className={Styles.border_box}>
      {/* 이미지 돌리는 것 */}
      <figure className={`${Styles.grid_box} ${visible ? Styles.open : Styles.close}`} onClick={onClickHandler}>
        <div className={Styles.inner_box}>
          <div className={Styles.text}>
            구독 그람(g) 수 변경
          </div>

          <div className={`${Styles.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/mypage/subscribe/dogldx/subscribe_ldx_arrow.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
        </div>
      </figure>

      <div className={Styles.content_box} ref={boxRef}>
            <div className={Styles.content_inner_box}>
              <div className={Styles.flex_box}>
                <div className={Styles.content_left_box}>
                  <div className={Styles.btn}>A유형</div>
                </div>
                <div className={Styles.content_right_box}>
                  <div className={Styles.flex_box}>
                    <div className={Styles.text1}>반려견이 성견이에요</div>
                    <div className={Styles.text2}>반려견이 성견인데 몸무게 변화가 있으신가요?</div>
                  </div>
                  <div className={Styles.text3}>
                    아래 무게 변경 수정 설정 후  저장 버튼 눌러 주세요. 제조 전 등록해주셔야 변경사항이 적용 됩니다. 
                  </div>

                  <div className={Styles.grid_box}>
                    <div className={Styles.grid_1}>
                      <p className={Styles.top_text}>기존 그람(g)</p>
                      <div className={Styles.bot_1}>120g</div>
                    </div>
                    <div className={Styles.grid_2}>
                      <p className={Styles.top_text}>변경할 그람(g)</p>
                      <div className={Styles.bot_2}>+5%

                      <div className={`${Styles.image2} img-wrap`}>
                        <Image
                          priority
                          src={require("public/img/mypage/subscribe/dogldx/subscribe_ldx_red_arrow.png")}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </div>
                    </div>

                    </div>
                    <div className={Styles.grid_3}>
                      <p className={Styles.top_text}>변경 적용 그람(g)</p>
                      <div className={Styles.bot_1}>120g</div>
                    </div>
                    <div className={Styles.grid_4}>
                      <p className={Styles.top_text}>변경 전 결제 금액(1팩당)</p>
                      <div className={Styles.bot_1}>1,550원</div>
                    </div>
                    <div className={Styles.grid_5}>
                      <p className={Styles.top_text}>변경 결제 금액(1팩당)</p>
                      <div className={Styles.bot_1}>1,790원<span>+240원</span></div>
                    </div>
                    <div className={Styles.grid_6}>
                      <p className={Styles.top_text}>플랜 적용 금액</p>
                      <div className={Styles.bot_1}>50,260원<span>풀플랜</span></div>
                    </div>
                  </div>
                  
                  <div className={Styles.red_btn_box}>
                    <div className={Styles.red_btn}>
                      무게 변경 적용하기
                    </div>
                  </div>
                </div> 
                {/* right_grid */}
              </div>

              <div className={`${Styles.flex_box} ${Styles.second}`}>
                <div className={Styles.content_left_box}>
                    <div className={Styles.btn}>B유형</div>
                </div>
                <div className={Styles.content_right_box}>
                  <div className={Styles.flex_box}>
                    <div className={Styles.text1}>반려견이 성장 중이에요</div>
                    {/* <div className={Styles.text2}>반려견이 성견인데 몸무게 변화가 있으신가요?</div> */}
                  </div>
                  <div className={Styles.text3}>
                    맞춤 설문에서 반려견 체중을 수정해주세요
                  </div>

                  <div className={Styles.red_btn_box2}>
                    <div className={Styles.red_btn2}>
                      맞춤설문 재등록 바로가기
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
}

const ReviewItem2 = () => {
  const [visible, setVisible ] = useState(false);
  const boxRef = useRef(null);
  const onClickHandler = (e) => {
    visible ? setVisible(false) : setVisible(true);
  };

  useEffect(() => {
    const selectedElem = boxRef.current;
    if (!selectedElem) return;
    visible ? slideDown(selectedElem) : slideUp(selectedElem);
  }, [visible]);

  return (
    <div className={Styles.border_box}>
      {/* 이미지 돌리는 것 */}
      <figure className={`${Styles.grid_box} ${visible ? Styles.open : Styles.close}`} onClick={onClickHandler}>
        <div className={Styles.inner_box}>
          <div className={Styles.text}>
            구독 팩 수 변경
          </div>

          <div className={`${Styles.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/mypage/subscribe/dogldx/subscribe_ldx_arrow.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
        </div>

      </figure>

      <div className={Styles.content_box} ref={boxRef}>
            <div className={Styles.content_inner_box}>
              <div className={Styles.text}>이번 구독만 잠시 쉬고 싶으신가요? <br />건너뛰기 주기를 선택해주세요</div>

              <input type="radio" name="" id=""/>

            </div>
          </div>
    </div>
  );
}

const ReviewItem3 = () => {
  const [visible, setVisible ] = useState(false);
  const boxRef = useRef(null);
  const onClickHandler = (e) => {
    visible ? setVisible(false) : setVisible(true);
  };

  useEffect(() => {
    const selectedElem = boxRef.current;
    if (!selectedElem) return;
    visible ? slideDown(selectedElem) : slideUp(selectedElem);
  }, [visible]);

  return (
    <div className={Styles.border_box}>
      {/* 이미지 돌리는 것 */}
      <figure className={`${Styles.grid_box} ${visible ? Styles.open : Styles.close}`} onClick={onClickHandler}>
        <div className={Styles.inner_box}>
          <div className={Styles.text}>
            구독 레시피 종류 변경
          </div>

          <div className={`${Styles.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/mypage/subscribe/dogldx/subscribe_ldx_arrow.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
        </div>
      </figure>

      <div className={Styles.content_box} ref={boxRef}>
            <div className={Styles.content_inner_box}>
              <div className={Styles.text}>이번 구독만 잠시 쉬고 싶으신가요? <br />건너뛰기 주기를 선택해주세요</div>

              <input type="radio" name="" id=""/>

            </div>
          </div>
    </div>
  );
}

const ReviewItem4 = () => {
  const [visible, setVisible ] = useState(false);
  const boxRef = useRef(null);
  const onClickHandler = (e) => {
    visible ? setVisible(false) : setVisible(true);
  };

  useEffect(() => {
    const selectedElem = boxRef.current;
    if (!selectedElem) return;
    visible ? slideDown(selectedElem) : slideUp(selectedElem);
  }, [visible]);

  return (
    <div className={Styles.border_box}>
      {/* 이미지 돌리는 것 */}
      <figure className={`${Styles.grid_box} ${visible ? Styles.open : Styles.close}`} onClick={onClickHandler}>
          <div className={Styles.inner_box}>
            <div className={Styles.text}>
              구독 건너뛰기
            </div>

            <div className={`${Styles.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/mypage/subscribe/dogldx/subscribe_ldx_arrow.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>
      </figure>

      <div className={Styles.content_box} ref={boxRef}>
            <div className={Styles.content_inner_box4}>
              <div className={Styles.text}>이번 구독만 잠시 쉬고 싶으신가요? <br />건너뛰기 주기를 선택해주세요</div>


              <div className={Styles.radio_box}>
                <label>
                  <input type="radio" name="slide4_radio1" id=""/>
                  1회 건너뛰기
                </label>

                <label>
                  <input type="radio" name="slide4_radio1" id=""/>
                  1주일 건너뛰기
                </label>
              </div>

              <p className={Styles.d_day_text}>기존 발송 예정일은<span>3월 14일</span>입니다</p>
              <p className={Styles.d_day_text2}>변경 발송 예정일은<span className={Styles.red_span}>4월 14일</span>입니다</p>

              <div className={Styles.picture_box}>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/mypage/subscribe/dogldx/subscribe_ldx_slide4.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>

              <div className={Styles.btn_box}>
                <div className={Styles.btn}>
                건너뛰기 적용하기
                </div>
              </div>


            </div>
          </div>
    </div>
  );
}

const ReviewItem5 = () => {
  const [visible, setVisible ] = useState(false);
  const boxRef = useRef(null);
  const onClickHandler = (e) => {
    visible ? setVisible(false) : setVisible(true);
  };

  useEffect(() => {
    const selectedElem = boxRef.current;
    if (!selectedElem) return;
    visible ? slideDown(selectedElem) : slideUp(selectedElem);
  }, [visible]);

  return (
    <div className={Styles.border_box}>
      {/* 이미지 돌리는 것 */}
      <figure className={`${Styles.grid_box} ${visible ? Styles.open : Styles.close}`} onClick={onClickHandler}>
        <div className={Styles.inner_box}>
          <div className={Styles.text}>
            구독 취소
          </div>

          <div className={`${Styles.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/mypage/subscribe/dogldx/subscribe_ldx_arrow.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
        </div>
      </figure>

      <div className={Styles.content_box} ref={boxRef}>
        <div className={Styles.content_inner_box5}>
          <div className={Styles.title_text}>
            정기구독 중단 사유
          </div>
          <div className={Styles.text}>
            정기구독을 중단하고 싶으신가요?<br />
            바프독이 더 나은 서비스를 제공할 수 있도록 중단하시는 이유를 알려주세요.
          </div>

          <div className={Styles.check_grid_box}>
            <div>1</div>
            <div>아이가 잘 먹지않아요</div>
            <div>3</div>
            <div>급여방식이 너무 번거로워요</div>
            <div>5</div>
            <div>더 작은 용량의 샘플구매를 하고싶어요</div>
            <div>7</div>
            <div>제품 패키징이 불편해요 </div>
            <div>9</div>
            <div>급여 방법을 잘 모르겠어요</div>
            <div>11</div>
            <div>기타</div>
          </div>

          <div>
            <input className={Styles.input_box} placeholder="상세 사유를 입력해주세요" />
          </div>

          <div className={Styles.btn}>
            구독 중단하기
          </div>
        </div>
      </div>
    </div>
  );
}

/////////////

function SubscribeInfoPage() {
  const router = useRouter();
  if(!router.isReady) return;
  const { dogIdx } = router.query;
  
  return (
    <>
      <MetaTitle title="마이페이지 구독관리" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            {/* {dogIdx} */}
            <section className={Styles.title}>
              <div className={Styles.title_text}>
                시호의 구독정보
              </div>


              <div className={Styles.flex_box}>
                <div className={Styles.text}>
                  <span>구독변경 마감</span>
                  2일 16:54:12 이후 구독정보 변경 불가
                </div>

                <div className={Styles.btn_box}>
                  <div className={Styles.btn}>
                    목록보기
                  </div>
                </div>
              </div>

            </section>



            <section className={Styles.content_box}>
              <div className={Styles.flex_box}>
                <div className={Styles.left_box}>
                  <div className={`${Styles.flex_box2} ${Styles.first}`}>
                      <div className={Styles.left}>플랜</div>
                      <div className={Styles.right}>풀플랜</div>
                  </div>

                  <div className={`${Styles.flex_box2} ${Styles.second}`}>
                      <div className={Styles.left}>레시피</div>
                      <div className={Styles.right}>스타터프리미엄<br />덕&amp;램</div>
                  </div>

                  <div className={`${Styles.flex_box2} ${Styles.third}`}>
                    <div className={Styles.left}>급여량</div>
                    <div className={Styles.right}>272g</div>
                  </div>
                </div>

                <div className={Styles.right_box}>
                  <div className={Styles.flex_box3}>
                    <div className = {Styles.inner_left_box}>
                      <div className={`${Styles.image} img-wrap`}>
                        <Image
                          priority
                          src={require("public/img/mypage/subscribe/dogldx/subscribe_ldx_calendar.png")}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </div>
                      <div className={Styles.row_1}>
                        다음 결제일
                      </div>
                      <div className={Styles.row_2}>
                        2022/03/14
                      </div>
                      <div className={Styles.row_3}>
                        1회 건너뛰기 중
                      </div>
                    </div>

                    <div className = {Styles.inner_mid_box}>
                      <div className={`${Styles.image} img-wrap`}>
                        <Image
                          priority
                          src={require("public/img/mypage/subscribe/dogldx/subscribe_ldx_pay.png")}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </div>
                      <div className={Styles.row_1}>
                        결제 예정 금액
                      </div>
                      <div className={Styles.row_2}>
                        94,000원
                      </div>
                      <div className={Styles.row_3}>
                        쿠폰적용
                      </div>
                    </div>
                    <div className = {Styles.inner_right_box}>
                      <div className={`${Styles.image} img-wrap`}>
                        <Image
                          priority
                          src={require("public/img/mypage/subscribe/dogldx/subscribe_ldx_delivery.png")}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </div>
                      <div className={Styles.row_1}>
                        발송 예정일
                      </div>
                      <div className={Styles.row_2}>
                        2022/03/16
                      </div>
                      <div className={Styles.row_3}>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            <section className={Styles.box}>
              
            </section>
          
          
            <ReviewItem/>
            <ReviewItem2/>
            <ReviewItem3/>
            <ReviewItem4/>
            <ReviewItem5/>

         



          


            
            </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default SubscribeInfoPage;
