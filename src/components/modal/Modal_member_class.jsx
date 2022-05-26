import React, { useState } from "react";
import s from "./modal_member_class.module.scss";
import ModalWrapper from "@src/components/modal/ModalWrapper";
import SelectTag from "@src/components/atoms/SelectTag";
import rem from "@src/components/atoms/rem";

function Modal_member_class({ onClick, formValue, setFormValue }) {
  const thisKey = "class";
  const initialValue = formValue[thisKey] || "";
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const onHideModalHandler = () => {
    onClick();
  };

  const onChangehandler = (value) => {
    setSelectedValue(value);
  };

  const onSubmitHandler = () => {
    if (selectedValue) {
      const confirmMessage = "유저의 회원등급을 변경하시겠습니까.";
      if (confirm(confirmMessage)) {
        setFormValue((prevState) => {
          return {
            ...prevState,
            [thisKey]: selectedValue,
          };
        });
        onHideModalHandler();
      }
    }
    // console.log(selectedValue);
  };

  return (
    <ModalWrapper
      background
      label="회원등급 변경"
      onBackgroundClick={onHideModalHandler}
      style={{ padding: `${rem(30)} ${rem(50)}` }}
    >
      <header className={s["title-section"]}>
        <h1 className={s.title}>회원등급변경</h1>
        <h3 className={s.subtitle}>변경할 등급을 선택해주세요.</h3>
      </header>
      <section className={s["cont-section"]}>
        <SelectTag
          name="userClass"
          onChange={onChangehandler}
          options={[
            { label: "브론즈", value: "BRONZE" },
            { label: "실버", value: "SILVER" },
            { label: "골드", value: "GOLD" },
            { label: "플래티넘", value: "PLATINUM" },
            { label: "다이아", value: "DIA" },
            { label: "더바프", value: "THEBARF" },
          ]}
        />
      </section>
      <footer className={s["btn-section"]}>
        <button className="admin_btn line popup" onClick={onHideModalHandler}>
          취소
        </button>
        <button className="admin_btn solid popup" onClick={onSubmitHandler}>
          확인
        </button>
      </footer>
    </ModalWrapper>
  );
}

export default Modal_member_class;
