import React, { useState } from 'react';
import s from './modal_member_class.module.scss';
import ModalWrapper from '/src/components/modal/ModalWrapper';
import SelectTag from '/src/components/atoms/SelectTag';
import rem from '/util/func/rem';
import {global_gradeType, global_gradeType_ENG} from "../../../store/TYPE/gradeType";
import CustomSelect from "../admin/form/CustomSelect";



function Modal_member_class({id, value, setValue, onConfirm, onCancel }) {
  const [selectedValue, setSelectedValue] = useState(value);
  
  const options = global_gradeType.map((typeKO)=>({
    label: typeKO,
    value: typeKO,
  }))
  

  const onInputChangehandler = (value) => {
    setSelectedValue(value)
    setValue(prevState => ({
      ...prevState,
      [id]: value
    }))
  };

  const onConfirmHandler = () => {
    if(onConfirm && typeof onConfirm === 'function'){
      onConfirm();
    }
  };
  const onCancelHandler = () => {
    if(onCancel && typeof onCancel === 'function'){
      onCancel();
    }
  };

  return (
    <ModalWrapper
      background
      label="회원등급 변경"
      onBackgroundClick={onCancelHandler}
      style={{ padding: `${rem(30)} ${rem(50)}` }}
      positionCenter
    >
      <header className={s['title-section']}>
        <h1 className={s.title}>회원등급변경</h1>
        <h3 className={s.subtitle}>변경할 등급을 선택해주세요.</h3>
      </header>
      <section className={s['cont-section']}>
        <SelectTag
          name="userClass"
          onChange={onInputChangehandler}
          options={options}
          initialValue={selectedValue}
        />
      </section>
      <footer className={s['btn-section']}>
        <button className="admin_btn line popup" onClick={onCancelHandler}>
          취소
        </button>
        <button className="admin_btn solid popup" onClick={onConfirmHandler}>
          확인
        </button>
      </footer>
    </ModalWrapper>
  );
}

export default Modal_member_class;
