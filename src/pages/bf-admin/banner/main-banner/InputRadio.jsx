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
      <label className="inp_box radio" htmlFor="guest">
        <input
          type="radio"
          id="guest"
          name={name}
          checked={selectedOption === "guest"}
          onChange={onChangeHandler}
        />
        <span className="innerText">비회원</span>
      </label>
      <label className="inp_box radio" htmlFor="user">
        <input
          type="radio"
          id="user"
          name={name}
          checked={selectedOption === "user"}
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
      <label className="inp_box radio" htmlFor="status_leaked">
        <input
          type="radio"
          data-status="leaked"
          id="status_leaked"
          name={name}
          checked={selectedOption === "leaked"}
          onChange={onChangeHandler}
        />
        <span className="innerText">노출</span>
      </label>
      <label className="inp_box radio" htmlFor="status_hidden">
        <input
          type="radio"
          data-status="hidden"
          id="status_hidden"
          name={name}
          checked={selectedOption === "hidden"}
          onChange={onChangeHandler}
        />
        <span className="innerText">숨김</span>
      </label>
    </div>
  );
};

