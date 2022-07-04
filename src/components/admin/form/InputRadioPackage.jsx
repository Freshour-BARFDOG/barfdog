import React, { useState, useEffect } from "react";

export const InputRadio_exposedTarget = ({
  exposedTarget,
  onRadioButtonHandler,
  name,
}) => {
  const [selectedOption, setSelectedOption] = useState(exposedTarget || "ALL");

  const onChangeHandler = (e) => {
    setSelectedOption(e.currentTarget.id);
    onRadioButtonHandler({ key: "targets", value: e.currentTarget.id });
  };

  return (
    <div className="inp_wrap radio" name={name}>
      <label className="inp_box radio" htmlFor="ALL">
        <input
          type="radio"
          id="ALL"
          name={name}
          checked={selectedOption === "ALL"}
          onChange={onChangeHandler}
        />
        <span className="innerText">전체</span>
      </label>
      <label className="inp_box radio" htmlFor="GUEST">
        <input
          type="radio"
          id="GUEST"
          name={name}
          checked={selectedOption === "GUEST"}
          onChange={onChangeHandler}
        />
        <span className="innerText">비회원</span>
      </label>
      <label className="inp_box radio" htmlFor="USER">
        <input
          type="radio"
          id="USER"
          name={name}
          checked={selectedOption === "USER"}
          onChange={onChangeHandler}
        />
        <span className="innerText">회원</span>
      </label>
      <label className="inp_box radio" htmlFor="SUBSCRIBER">
        <input
          type="radio"
          id="SUBSCRIBER"
          name={name}
          checked={selectedOption === "SUBSCRIBER"}
          onChange={onChangeHandler}
        />
        <span className="innerText">구독회원</span>
      </label>
    </div>
  );
};

const InputRadio_status = ({ exposedStatus, onRadioButtonHandler, name }) => {
  const [selectedOption, setSelectedOption] = useState(
    exposedStatus || "LEAKED"
  );
  const onChangeHandler = (e) => {
    setSelectedOption(e.currentTarget.dataset.status);
    onRadioButtonHandler({
      key: "status",
      value: e.currentTarget.dataset.status,
    });
  };

  return (
    <div className="inp_wrap radio" name={name}>
      <label className="inp_box radio" htmlFor="status_leaked">
        <input
          type="radio"
          data-status="LEAKED"
          id="status_leaked"
          name={name}
          checked={selectedOption === "LEAKED"}
          onChange={onChangeHandler}
        />
        <span className="innerText">노출</span>
      </label>
      <label className="inp_box radio" htmlFor="status_hidden">
        <input
          type="radio"
          data-status="HIDDEN"
          id="status_hidden"
          name={name}
          checked={selectedOption === "HIDDEN"}
          onChange={onChangeHandler}
        />
        <span className="innerText">숨김</span>
      </label>
    </div>
  );
};

export default InputRadio_status;








export const CustomRadio = ({
  formValue,
  setFormValues,
  title,
  name,
  idList,
  labelList,
}) => {

  const initialValue = idList[0];
  const [selectedRadio, setSelectedRadio] = useState(initialValue); // * component 내부 value

  useEffect(() => {
    if (!formValue) {
      setSelectedRadio(initialValue);
    }
  }, [formValue]);

  const onChangeHandler = (e) => {
    const { id } = e.currentTarget;
    setSelectedRadio(id);

    setFormValues((prevState) => ({
      ...prevState,
      [name]: id,
    }));
  };

  if (!idList.length || !idList) return;

  return (
    <>
      <div className="inp_wrap radio">
        {idList.map((id, index) => {
          return (
            <label
              key={`radio-${name}-${index}`}
              htmlFor={id}
              className="inp_box radio"
            >
              <input
                id={id}
                name={name}
                type="radio"
                value={id}
                checked={selectedRadio === id} // * important
                onChange={onChangeHandler}
              />
              {labelList[index]}
            </label>
          );
        })}
      </div>
    </>
  );
};
