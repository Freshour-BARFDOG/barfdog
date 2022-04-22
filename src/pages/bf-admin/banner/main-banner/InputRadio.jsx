import React, { useState } from 'react';

const InputRadio = ({ exposedTarget, onExposedTargetHandler }) => {
  const [selectedOption, setSelectedOption] = useState(exposedTarget);

  const onChangeHandler = (e) => {
    setSelectedOption(e.currentTarget.id);
    onExposedTargetHandler(e.currentTarget.id);
  };

  return (
    <div className="inp_wrap radio">
      <label className="inp_box radio" htmlFor="all">
        <input
          type="radio"
          id="all"
          name="exposedTarget"
          checked={selectedOption === "all"}
          onChange={onChangeHandler}
        />
        <span className="innerText">전체</span>
      </label>
      <label className="inp_box radio" htmlFor="non-member">
        <input
          type="radio"
          id="non-member"
          name="exposedTarget"
          checked={selectedOption === "non-member"}
          onChange={onChangeHandler}
        />
        <span className="innerText">비회원</span>
      </label>
      <label className="inp_box radio" htmlFor="member">
        <input
          type="radio"
          id="member"
          name="exposedTarget"
          checked={selectedOption === "member"}
          onChange={onChangeHandler}
        />
        <span className="innerText">회원</span>
      </label>
      <label className="inp_box radio" htmlFor="subscriber">
        <input
          type="radio"
          id="subscriber"
          name="exposedTarget"
          checked={selectedOption === "subscriber"}
          onChange={onChangeHandler}
        />
        <span className="innerText">구독회원</span>
      </label>
    </div>
  );
};


export default InputRadio;