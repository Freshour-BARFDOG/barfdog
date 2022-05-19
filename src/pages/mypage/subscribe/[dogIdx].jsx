import React, { useState, useRef, useEffect } from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import { useRouter } from "next/router";

import Image from 'next/image';
import { IoIosArrowForward } from "react-icons/io";

// import s from "src/pages/_samples/_samples.module.scss";
import Styles from "/styles/css/mypage/subscribe/[dogIdx].module.scss";

import { slideUp , slideDown } from "/util/func/slideToggle";

import Icon_Itemlabel from "@src/components/atoms/Icon_Itemlabel";
import Icon_Checked from "@public/img/icon/icon_checked.svg";
import rem from '@src/components/atoms/rem';

// -------------------------토글박스
function ToggleBox({ title, children }) {
  const [visible, setVisible] = useState(false); // ! 또는 useState(false) --> 토글박스 초기상태 설정
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
    <div className={`${Styles.toggleBox} ${visible && Styles.active}`}>
      <div className={`${Styles.clickTrigger} clearfix`} onClick={onClickHandler}>
        <h2 className={Styles.title}>
          {title}
          <i>
            <IoIosArrowForward />
          </i>
        </h2>
      </div>
      <div className={Styles.cont} ref={boxRef}>
        {children}
      </div>
    </div>
  );
}

/////////////

const CustomInput = ({
  children,
  id,
  type,
  name,
  selectedRadio,
  setSelectedRadio,
}) => {

  const [isChecked, setIsChecked] = useState(false);
  const radioRef = useRef();


  const onCheckboxInputHandler = (e) => {
    setIsChecked(!isChecked);
  };

  const onRadioInputHandler = (e) => {
    const { id } = e.currentTarget;
    setSelectedRadio(id);
  };

  const InputRadio = () => {
    return (
      <input
        id={id}
        type="radio"
        name={name}
        onChange={onRadioInputHandler}
        value={selectedRadio === id}
        ref={radioRef}
        checked={selectedRadio === id}
      />
    );
  };

  const InputCheckbox = () => {
    return (
      <input
        id={id}
        type="checkbox"
        value={isChecked}
        onChange={onCheckboxInputHandler}
        name={name}
      />
    );
  };

  const CustomInputByType = () => {
    return (
      <>
        {type === "radio" && <InputRadio />}
        {type === "checkbox" && <InputCheckbox />}
        <span className={Styles.fake_checkbox}>
          {isChecked ? "선택됨" : "플랜선택"}
          <i className={Styles.icon_checked}>
            <Icon_Checked />
          </i>
        </span>
      </>
    );
  };

  return (
    <>
      <label
        htmlFor={id}
        data-id={id}
        className={`${Styles.custom_input_wrapper} ${isChecked && Styles.checked} ${
          selectedRadio === id && Styles.checked
        }`}
      >
        <div className={Styles.custom_input_cont}>{children}</div>
        <CustomInputByType />
      </label>
    </>
  );
};

const CustomInputRadio = ({name}) => {

  const [selectedRadio , setSelectedRadio] = useState(null);

  return (

    <div className={Styles.flex_box} data-input-title={name}>
      <CustomInput
        id={`${name}-input-radio-01`}
        type="radio"
        name={name}
        selectedRadio={selectedRadio}
        setSelectedRadio={setSelectedRadio}
      >

        <Icon_Itemlabel
          label="BEST"
          style={{
            backgroundColor: "var(--color-main)",
            height: rem(34),
            left: rem(34),
            top: rem(14),
            width: rem(300),
            transform: "translate(-50%, 0)rotate(-45deg)",
          }}
        />

        <div className={Styles.plan_box}>
          <div className={Styles.img_box}>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/pages/subscribe_full_plan.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>

          <h2>풀플랜</h2>
          <p>하루에 두 끼를 바프독으로 먹어요</p>

          <div className={Styles.grid_box}>
            <div className={Styles.row_1}>
              하루에<span>&nbsp;2팩</span>
            </div>
            <div className={Styles.row_2}>
              <span>2주</span>&nbsp;정기배송
            </div>
            <div className={Styles.row_3}>
              <span>143g</span>&nbsp;(1팩기준)
            </div>
            <div className={Styles.row_4}>
              20팩 x <span>7,200원</span> 
            </div>
          </div>

          <div className={Styles.text1}>
            5%&nbsp; <span>144,000원</span>
          </div>

          <div className={Styles.text2}>
            142,560원
          </div>

        </div>

      </CustomInput>
      <CustomInput
        id={`${name}-input-radio-02`}
        type="radio"
        name={name}
        selectedRadio={selectedRadio}
        setSelectedRadio={setSelectedRadio}
      >

        <div className={Styles.plan_box}>
          <div className={Styles.img_box}>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/pages/subscribe_full_plan.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>

          <h2>하프플랜</h2>
          <p>하루에 한 끼를 바프독으로 먹어요</p>

          <div className={Styles.grid_box}>
            <div className={Styles.row_1}>
              하루에<span>&nbsp;2팩</span>
            </div>
            <div className={Styles.row_2}>
              <span>4주</span>&nbsp;정기배송
            </div>
            <div className={Styles.row_3}>
              <span>143g</span>&nbsp;(1팩기준)
            </div>
            <div className={Styles.row_4}>
              20팩 x <span>7,200원</span> 
            </div>
          </div>

          <div className={Styles.text1}>
            5%&nbsp; <span>144,000원</span>
          </div>

          <div className={Styles.text2}>
            142,560원
          </div>
        </div>


      </CustomInput>
      <CustomInput
        id={`${name}-input-radio-03`}
        type="radio"
        name={name}
        selectedRadio={selectedRadio}
        setSelectedRadio={setSelectedRadio}
      >
        <Icon_Itemlabel
          label="NEW"
          style={{
            backgroundColor: "#FF8C16",
            height: rem(34),
            left: rem(34),
            top: rem(14),
            width: rem(300),
            transform: "translate(-50%, 0)rotate(-45deg)",
          }}
        />


        <div className={Styles.plan_box}>
          <div className={Styles.img_box}>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/pages/subscribe_full_plan.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>

          <h2>토핑플랜</h2>
          <p>토핑용으로 바프독으로 섞어서 먹어요</p>

          <div className={Styles.grid_box}>
            <div className={Styles.row_1}>
              하루에<span>&nbsp;2팩</span>
            </div>
            <div className={Styles.row_2}>
              <span>2주</span>&nbsp;정기배송
            </div>
            <div className={Styles.row_3}>
              <span>143g</span>&nbsp;(1팩기준)
            </div>
            <div className={Styles.row_4}>
              20팩 x <span>7,200원</span> 
            </div>
          </div>

          <div className={Styles.text1}>
            5%&nbsp; <span>144,000원</span>
          </div>

          <div className={Styles.text2}>
            142,560원
          </div>
        </div>
      </CustomInput>
    </div>    
  );
}

const CustomInputRadio2 = ({name}) => {

  const [selectedRadio , setSelectedRadio] = useState(null);

  return (

    <div className={Styles.flex_box2} data-input-title={name}>
      <CustomInput
        id={`${name}-input-radio-04`}
        type="radio"
        name={name}
        selectedRadio={selectedRadio}
        setSelectedRadio={setSelectedRadio}
      >

        <div className={Styles.recipe_choice_box}>
          <div className={Styles.img_box}>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/mypage/subscribe/subscribe_recipe_1.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>

          <div className={Styles.row_1}>
            TURKEY &amp; BEEF
            
          </div>

          <div className={Styles.row_2}>
            칠면조 &amp; 소
          </div>

          <div className={Styles.row_3}>
            우리 아이를 더 튼튼하게!<br />
            발육과 영양 보충을 위한 터키 앤 비프
          </div>

          <div className={Styles.row_4}>
            더 알아보기
          </div>
        </div>

      </CustomInput>

      <CustomInput
        id={`${name}-input-radio-05`}
        type="radio"
        name={name}
        selectedRadio={selectedRadio}
        setSelectedRadio={setSelectedRadio}
      >

        <div className={Styles.recipe_choice_box}>
          <div className={Styles.img_box}>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/mypage/subscribe/subscribe_recipe_2.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>

          <div className={Styles.row_1}>
            TURKEY &amp; BEEF
            
          </div>

          <div className={Styles.row_2}>
            칠면조 &amp; 소
          </div>

          <div className={Styles.row_3}>
            우리 아이를 더 튼튼하게!<br />
            발육과 영양 보충을 위한 터키 앤 비프
          </div>

          <div className={Styles.row_4}>
            더 알아보기
          </div>
        </div>

      </CustomInput>


      <CustomInput
        id={`${name}-input-radio-06`}
        type="radio"
        name={name}
        selectedRadio={selectedRadio}
        setSelectedRadio={setSelectedRadio}
      >

        <div className={Styles.recipe_choice_box}>
          <div className={Styles.img_box}>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/mypage/subscribe/subscribe_recipe_3.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>

          <div className={Styles.row_1}>
            TURKEY &amp; BEEF
            
          </div>

          <div className={Styles.row_2}>
            칠면조 &amp; 소
          </div>

          <div className={Styles.row_3}>
            우리 아이를 더 튼튼하게!<br />
            발육과 영양 보충을 위한 터키 앤 비프
          </div>

          <div className={Styles.row_4}>
            더 알아보기
          </div>
        </div>

      </CustomInput>


      <CustomInput
        id={`${name}-input-radio-07`}
        type="radio"
        name={name}
        selectedRadio={selectedRadio}
        setSelectedRadio={setSelectedRadio}
      >

        <div className={Styles.recipe_choice_box}>
          <div className={Styles.img_box}>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/mypage/subscribe/subscribe_recipe_4.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>

          <div className={Styles.row_1}>
            TURKEY &amp; BEEF
            
          </div>

          <div className={Styles.row_2}>
            칠면조 &amp; 소
          </div>

          <div className={Styles.row_3}>
            우리 아이를 더 튼튼하게!<br />
            발육과 영양 보충을 위한 터키 앤 비프
          </div>

          <div className={Styles.row_4}>
            더 알아보기
          </div>
        </div>

      </CustomInput>


    </div>

    

    
  );
}

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
              <div className={Styles.top_flex_box}>
                <div className={Styles.top_left_box}>
                  <div className={`${Styles.top_flex_box2} ${Styles.first}`}>
                      <div className={Styles.left}>플랜</div>
                      <div className={Styles.right}>풀플랜</div>
                  </div>

                  <div className={`${Styles.top_flex_box2} ${Styles.second}`}>
                      <div className={Styles.left}>레시피</div>
                      <div className={Styles.right}>스타터프리미엄<br />덕&amp;램</div>
                  </div>

                  <div className={`${Styles.top_flex_box2} ${Styles.third}`}>
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






            {/* 구독 그람 수 변경  */}
            <ToggleBox title="구독 그람(g) 수 변경">
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
            </ToggleBox>



            <ToggleBox title="구독 팩 수 변경">
              <CustomInputRadio name="recipe" />

              <div className={Styles.recipe_btn_box}>
                <div className={Styles.btn}>변경 플랜 적용하기</div>
              </div>

            </ToggleBox>


            <ToggleBox title="구독 레시피 종류 변경">
              <section className={Styles.notice}>
                <div className={Styles.notice_row_1}> 
                  구매하실 레시피 한가지를 선택해 주세요
                </div>

                <div className={Styles.notice_row_2}> 
                  풀플랜만 두 개의 레시피를 동시선택할 수 있습니다 
                </div>

                <div className={Styles.notice_row_3}>
                  <div className={Styles.color_box}>
                    <div className={Styles.color_box_row_1}>
                      <div className={Styles.picture_box}>
                        <div className={`${Styles.image} img-wrap`}>
                          <Image
                            priority
                            src={require("public/img/mypage/subscribe/alert_circle.png")}
                            objectFit="cover"
                            layout="fill"
                            alt="카드 이미지"
                          />
                        </div>

                      </div>
                      <span>
                        &nbsp;잠깐!
                      </span>
                    </div>
                    <div className={Styles.color_box_row_2}>
                      @에 못먹는 음식으로 체크해 주셨네요! #,# 레시피에는 @가 들어가 있습니다.<br/>
                      반려견에게 알레르기를 유발할 수 있으니 레시피 선택에 유의해 주시기 바랍니다.
                    </div>
                  </div>
                </div>
                
                <CustomInputRadio2 name="dfdfdf" />
              </section>

              <div className={Styles.recipe_btn_box}>
                <div className={Styles.btn}>변경 레시피 적용하기</div>
              </div>
            </ToggleBox>

            
            <ToggleBox title="구독 건너뛰기">
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
            </ToggleBox>


            <ToggleBox title="구독취소">
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

            </ToggleBox>

            <section className={Styles.add_page}>
              <div className={Styles.page_box}>
                <div className={Styles.title}>
                  사용가능한 쿠폰
                </div>

                <div className={Styles.grid_box}>

                  <div className={Styles.row_flex}>
                    <div>
                      쿠폰명
                    </div>
                    <div>
                      적용가능수량
                    </div>
                    <div>
                      유효기간
                    </div>
                    <div>
                      할인금액
                    </div>
                  </div>

                  <div className={Styles.row_flex2}>
                    <div>
                      <label>
                        <input type="radio" namne='13' id="12" /> 
                        <div>
                          정기구독 10%할인
                        </div>
                      </label>
                    </div>
                    <div>
                      1개
                    </div>
                    <div>
                      2022.12.31
                    </div>
                    <div>
                      9,400원
                    </div>
                  </div>

                  <div className={Styles.row_flex2}>
                    <div>
                      <label>
                        <input type="radio" name='13'id="12" /> 
                        <div>
                          등급구독 10%할인
                        </div>
                      </label>
                    </div>
                    <div>
                      1개
                    </div>
                    <div>
                      2022.12.31
                    </div>
                    <div>
                      9,400원
                    </div>
                  </div>
                </div>

                <div className={Styles.price}>
                  <div className={Styles.price_flex_box}>
                    <div className={Styles.col_1}>
                      <p>상품금액</p>
                      <div className={Styles.text_price}>94,000원</div>
                    </div>
                    
                    <div className={Styles.line}>
                      <hr />
                    </div>

                    <div className={Styles.col_2}>
                      <p>할인금액</p>
                      <div className={Styles.text_price}>9,400원</div>
                    </div>
                    
                    <div className={Styles.vertical_line}>
                      <hr />
                    </div>

                    <div className={Styles.col_3}>
                      할인 후 금액
                      <span>84,600원</span>
                    </div>
                  </div>
                </div>

                <div className={Styles.coupon_btn_box}>
                  <div className={Styles.btn}>
                    취소
                  </div>
                  <div className={Styles.red_btn}>
                    쿠폰선택
                  </div>

                  
                </div>


              </div>
            </section>

            <section className={Styles.add_page2}>
              <div className={Styles.page_box}>
                <div className={Styles.text}>
                  쿠폰 할인이 적용되었습니다
                </div>
                <div className={Styles.red_btn}>
                  확인
                </div>
              </div>
            </section>
            
            </MypageWrapper>
        </Wrapper>
      </Layout>


    </>
  );
}

export default SubscribeInfoPage;
