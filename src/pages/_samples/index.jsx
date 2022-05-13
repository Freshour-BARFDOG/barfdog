import s from "./_samples.module.scss";
import React, { useState, useRef, useEffect } from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import { slideUp, slideDown } from "/util/func/slideToggle";
import { IoIosArrowForward } from "react-icons/io";
import Icon_Checked from "@public/img/icon/icon_checked.svg";
import rem from '@src/components/atoms/rem';
import Icon_Itemlabel from "@src/components/atoms/Icon_Itemlabel";



/* -------------------- 토글박스 ------------------ */
// * SCSS 파일 코드

function ToggleBox({ title, children }) {
  const [visible, setVisible] = useState(false);
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
    <div className={`${s.toggleBox} ${visible && s.active}`}>
      <div className={`${s.clickTrigger} clearfix`} onClick={onClickHandler}>
        <h2 className={s.title}>
          {title}
          <i>
            <IoIosArrowForward />
          </i>
        </h2>
      </div>
      <div className={s.cont} ref={boxRef}>
        {children}
      </div>
    </div>
  );
}

/* -------------------- 토글박스 ------------------ */









// * -------------------- 커스텀 인풋: 공통  ------------------ */

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
    const { value , id } = e.currentTarget;
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

// * -------------------- 커스텀 인풋: 공통  ------------------ */





// * -------------------- 커스텀 인풋 : INPUT RADIO ------------------ */


const CustomInputRadio = ({name}) => {

  const [selectedRadio , setSelectedRadio] = useState(null);

  return (
    <div data-input-title={name}>
      <CustomInput
        id={`${name}-input-radio-01`}
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
        <h2>하프플랜</h2>
        <p>하루에 두 끼를 바프독으로 먹어요</p>
        <p>하루에 두 끼를 바프독으로 먹어요</p>
        <p>하루에 두 끼를 바프독으로 먹어요</p>
      </CustomInput>
      <CustomInput
        id={`${name}-input-radio-02`}
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
        <h2>하프플랜</h2>
        <p>하루에 세 끼를 바프독으로 먹어요</p>
        <p>하루에 세 끼를 바프독으로 먹어요</p>
        <p>하루에 세 끼를 바프독으로 먹어요</p>
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
        <h2>하프플랜</h2>
        <p>하루에 한 끼를 바프독으로 먹어요</p>
        <p>하루에 한 끼를 바프독으로 먹어요</p>
        <p>하루에 한 끼를 바프독으로 먹어요</p>
      </CustomInput>
    </div>
  );
  
}

// * -------------------- 커스텀 인풋 : INPUT RADIO ------------------ */




























/* -------------------- UI 확인용 레이아웃  ------------------ */


function SamplePageForPublishing() {

  return (
    <Layout>
      <Wrapper>
        <ul className={s.sample_wrapper}>
          <li description="토글박스: 타이틀 클릭 시, 세부 내용이 나타나고 숨겨진다.">
            <ToggleBox title="토글박스 샘플">
              세부내용 및 HTML태그 작성
            </ToggleBox>
          </li>

          <li description="Input Custom">
            <ToggleBox title="인풋 커스컴 샘플: TYPE - CHECKBOX ">
              <CustomInput id="checkboxId-01" type="checkbox">
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
                <h2>풀플랜</h2>
                <p>하루에 한 끼를 바프독으로 먹어요</p>
                <p>하루에 한 끼를 바프독으로 먹어요</p>
                <p>하루에 한 끼를 바프독으로 먹어요</p>
              </CustomInput>
            </ToggleBox>
          </li>
          <li description="Input Custom" className={s['custom-input-radio-wrapper']}>
            <ToggleBox title="인풋 커스컴 샘플: TYPE - RADIO">
              <CustomInputRadio name="recipe"/>
            </ToggleBox>
          </li>
        </ul>
      </Wrapper>
    </Layout>
  );
}

export default SamplePageForPublishing;


/* -------------------- UI 확인용 레이아웃  ------------------ */

/// 나중에 import해서 쓰면 되도록
// 