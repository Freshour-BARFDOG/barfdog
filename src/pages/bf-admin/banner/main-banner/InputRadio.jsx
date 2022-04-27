import React, { useState } from 'react';

export const InputRadio_exposedTarget = ({
  exposedTarget,
  onRadioButtonHandler,
  name}) => {
  const [selectedOption, setSelectedOption] = useState(exposedTarget);

  const onChangeHandler = (e) => {
    setSelectedOption(e.currentTarget.id);
    onRadioButtonHandler(e.currentTarget.id);
  };

  return (
    <div className="inp_wrap radio" name={name}>
      <label className="inp_box radio" htmlFor="all">
        <input
          type="radio"
          id="all"
          name={name}
          checked={selectedOption === "all"}
          onChange={onChangeHandler}
        />
        <span className="innerText">전체</span>
      </label>
      <label className="inp_box radio" htmlFor="non-member">
        <input
          type="radio"
          id="non-member"
          name={name}
          checked={selectedOption === "non-member"}
          onChange={onChangeHandler}
        />
        <span className="innerText">비회원</span>
      </label>
      <label className="inp_box radio" htmlFor="member">
        <input
          type="radio"
          id="member"
          name={name}
          checked={selectedOption === "member"}
          onChange={onChangeHandler}
        />
        <span className="innerText">회원</span>
      </label>
      <label className="inp_box radio" htmlFor="subscriber">
        <input
          type="radio"
          id="subscriber"
          name={name}
          checked={selectedOption === "subscriber"}
          onChange={onChangeHandler}
        />
        <span className="innerText">구독회원</span>
      </label>
    </div>
  );
};




export const InputRadio_status = ({ exposedStatus, onRadioButtonHandler, name }) => {
  const [selectedOption, setSelectedOption] = useState(exposedStatus);
  const onChangeHandler = (e) => {
    setSelectedOption(e.currentTarget.dataset.status);
    onRadioButtonHandler(e.currentTarget.dataset.status);
  };

  return (
    <div className="inp_wrap radio" name={name}>
      <label className="inp_box radio" htmlFor="status_active">
        <input
          type="radio"
          data-status="active"
          id="status_active"
          name={name}
          checked={selectedOption === "active"}
          onChange={onChangeHandler}
        />
        <span className="innerText">노출</span>
      </label>
      <label className="inp_box radio" htmlFor="status_inactive">
        <input
          type="radio"
          data-status="inactive"
          id="status_inactive"
          name={name}
          checked={selectedOption === "inactive"}
          onChange={onChangeHandler}
        />
        <span className="innerText">숨김</span>
      </label>
    </div>
  );
};

