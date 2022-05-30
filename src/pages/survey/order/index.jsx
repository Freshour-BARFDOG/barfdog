import React, { useState, useRef, useEffect } from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import s from "src/pages/survey/order/index.module.scss"
import Image from 'next/image';

import Icon_Checked from "@public/img/icon/icon_checked.svg";

import Icon_Itemlabel from "@src/components/atoms/Icon_Itemlabel";

import rem from '@src/components/atoms/rem';


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
        <span className={s.fake_checkbox}>
          {isChecked ? "선택됨" : "플랜선택"}
          <i className={s.icon_checked}>
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
        className={`${s.custom_input_wrapper} ${isChecked && s.checked} ${
          selectedRadio === id && s.checked
        }`}
      >
        <div className={s.custom_input_cont}>{children}</div>
        <CustomInputByType />
      </label>
    </>
  );
};



const CustomInputRadio = ({name}) => {

  const [selectedRadio , setSelectedRadio] = useState(null);

  return (

    <div className={s.flex_box} data-input-title={name}>
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

        <div className={s.plan_box}>
          <div className={s.img_box}>
            <div className={`${s.image} img-wrap`}>
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

          <div className={s.grid_box}>
            <div className={s.row_1}>
              하루에<span>&nbsp;2팩</span>
            </div>
            <div className={s.row_2}>
              <span>2주</span>&nbsp;정기배송
            </div>
            <div className={s.row_3}>
              <span>143g</span>&nbsp;(1팩기준)
            </div>
            <div className={s.row_4}>
              20팩 x <span>7,200원</span> 
            </div>
          </div>

          <div className={s.text1}>
            5%&nbsp; <span>144,000원</span>
          </div>

          <div className={s.text2}>
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

        <div className={s.plan_box}>
          <div className={s.img_box}>
            <div className={`${s.image} img-wrap`}>
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

          <div className={s.grid_box}>
            <div className={s.row_1}>
              하루에<span>&nbsp;2팩</span>
            </div>
            <div className={s.row_2}>
              <span>4주</span>&nbsp;정기배송
            </div>
            <div className={s.row_3}>
              <span>143g</span>&nbsp;(1팩기준)
            </div>
            <div className={s.row_4}>
              20팩 x <span>7,200원</span> 
            </div>
          </div>

          <div className={s.text1}>
            5%&nbsp; <span>144,000원</span>
          </div>

          <div className={s.text2}>
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


        <div className={s.plan_box}>
          <div className={s.img_box}>
            <div className={`${s.image} img-wrap`}>
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

          <div className={s.grid_box}>
            <div className={s.row_1}>
              하루에<span>&nbsp;2팩</span>
            </div>
            <div className={s.row_2}>
              <span>2주</span>&nbsp;정기배송
            </div>
            <div className={s.row_3}>
              <span>143g</span>&nbsp;(1팩기준)
            </div>
            <div className={s.row_4}>
              20팩 x <span>7,200원</span> 
            </div>
          </div>

          <div className={s.text1}>
            5%&nbsp; <span>144,000원</span>
          </div>

          <div className={s.text2}>
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

    <div className={s.flex_box2} data-input-title={name}>
      <CustomInput
        id={`${name}-input-radio-04`}
        type="radio"
        name={name}
        selectedRadio={selectedRadio}
        setSelectedRadio={setSelectedRadio}
      >

        <div className={s.recipe_choice_box}>
          <div className={s.img_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/mypage/subscribe/subscribe_recipe_1.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>

          <div className={s.row_1}>
            TURKEY &amp; BEEF
            
          </div>

          <div className={s.row_2}>
            칠면조 &amp; 소
          </div>

          <div className={s.row_3}>
            우리 아이를 더 튼튼하게!<br />
            발육과 영양 보충을 위한 터키 앤 비프
          </div>

          <div className={s.row_4}>
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

        <div className={s.recipe_choice_box}>
          <div className={s.img_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/mypage/subscribe/subscribe_recipe_2.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>

          <div className={s.row_1}>
            TURKEY &amp; BEEF
            
          </div>

          <div className={s.row_2}>
            칠면조 &amp; 소
          </div>

          <div className={s.row_3}>
            우리 아이를 더 튼튼하게!<br />
            발육과 영양 보충을 위한 터키 앤 비프
          </div>

          <div className={s.row_4}>
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

        <div className={s.recipe_choice_box}>
          <div className={s.img_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/mypage/subscribe/subscribe_recipe_3.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>

          <div className={s.row_1}>
            TURKEY &amp; BEEF
            
          </div>

          <div className={s.row_2}>
            칠면조 &amp; 소
          </div>

          <div className={s.row_3}>
            우리 아이를 더 튼튼하게!<br />
            발육과 영양 보충을 위한 터키 앤 비프
          </div>

          <div className={s.row_4}>
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

        <div className={s.recipe_choice_box}>
          <div className={s.img_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/mypage/subscribe/subscribe_recipe_4.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>

          <div className={s.row_1}>
            TURKEY &amp; BEEF
            
          </div>

          <div className={s.row_2}>
            칠면조 &amp; 소
          </div>

          <div className={s.row_3}>
            우리 아이를 더 튼튼하게!<br />
            발육과 영양 보충을 위한 터키 앤 비프
          </div>

          <div className={s.row_4}>
            더 알아보기
          </div>
        </div>

      </CustomInput>


    </div>

    

    
  );
}

function SelectPlanPage() {
  return (
    <>
      <MetaTitle title="플랜 레시피 선택" />
      <Layout>
        <Wrapper>
          <section className={s.order_title}>
            <div className={s.text}>
              결과지를 종합해본 결과
            </div>

            <div className={s.title_content_box}>
              <div className={s.title_grid_box}>
                <div className={s.grid_left}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("src/pages/survey/order/survey_order_title_left.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                  <div className={s.title_grid_left_row_1}>
                    STARTER PREMIUM
                  </div>
                  <div className={`${s.image2} img-wrap`}>
                    <Image
                      priority
                      src={require("src/pages/survey/order/survey_order_title_left_text.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>

                <div className={s.grid_right}>
                  <div className={s.grid_right_title}>
                    시호에게는<br />
                    안정적인 첫 생식 적응이 필요한<br />
                    <span>스타터프리미엄</span> 레시피를 추천합니다. <br />
                  </div>
                  <div className={s.grid_right_mid_box}>
                    <div className={s.grid_right_mid_box_left}>
                      시호의 하루 권장 칼로리
                    </div>
                    <div className={s.grid_right_mid_box_right}>
                      479kcal
                    </div>
                    <div className={s.grid_right_mid_box_left}>
                      하루 권장 식사량
                    </div>
                    <div className={s.grid_right_mid_box_right}>
                      286g
                    </div>
                    <div className={s.grid_right_mid_box_left}>
                      한끼 권장 식사량<br/>
                      <span>하루 두 끼 기준</span>
                    </div>
                    <div className={s.grid_right_mid_box_right}>
                      143g
                    </div>
                  </div>
                  <div className={s.grid_right_bot_text}>
                    바프독 생식기준 결과
                  </div>
                </div>
              </div>
            </div>
          </section>


          <section className={s.regular_delivery}>
            <div className={s.regular_delivery_title}>
              급여량에 따른 정기배송 수량을 선택해 주세요
            </div>

            <CustomInputRadio name="recipe" />
            
          </section>

          <section className={s.notice}>
            <div className={s.notice_row_1}> 
              구매하실 레시피 한가지를 선택해 주세요
            </div>

            <div className={s.notice_row_2}> 
              풀플랜만 두 개의 레시피를 동시선택할 수 있습니다 
            </div>

            <div className={s.notice_row_3}>
              <div className={s.color_box}>
                <div className={s.color_box_row_1}>
                  <div className={s.picture_box}>
                    <div className={`${s.image} img-wrap`}>
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
                <div className={s.color_box_row_2}>
                  @에 못먹는 음식으로 체크해 주셨네요! #,# 레시피에는 @가 들어가 있습니다.<br/>
                  반려견에게 알레르기를 유발할 수 있으니 레시피 선택에 유의해 주시기 바랍니다.
                </div>
              </div>
            </div>
            
            <CustomInputRadio2 name="survey_recipe_choice" />

            <div className={s.btn_box}>
              <div className={s.left_btn}>
                뒤로가기
              </div>
              <div className={s.right_btn}>
                맞춤레시피 구매하기
              </div>
            </div>
          </section>
          
          
        </Wrapper>
      </Layout>
    </>
  );
}

export default SelectPlanPage;
