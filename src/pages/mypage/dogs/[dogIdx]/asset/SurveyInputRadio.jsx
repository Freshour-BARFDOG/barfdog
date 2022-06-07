import React, { useState } from "react";
import s from "../updateSurvey.module.scss";

const SurveyInputRadio = ({
  surveyValues,
  setSurveyValues,
  name,
  idList,
  labelList,
  className,
  desc,
  defaultStyle,
}) => {
  const [selectedRadio, setSelectedRadio] = useState(surveyValues); // * component 내부 value

  // useEffect(() => {
  //   if (!surveyValues) {
  //     setSelectedRadio('');
  //   }
  // }, [surveyValues]);

  const onChangeHandler = (e) => {
    const { id } = e.currentTarget;
    setSelectedRadio(id);

    setSurveyValues((prevState) => ({
      ...prevState,
      [name]: id,
    }));
  };

  if (!idList || !idList.length) return;

  return (
    <>
      <ul className={`${className} ${s["inputRadio-wrap"]}`}>
        {idList.map((id, index) => {
          return (
            <li key={`radio-${name}-${index}`}>
              {defaultStyle ? (
                <label>
                  <input
                    id={id}
                    name={name}
                    type="radio"
                    value={id}
                    checked={selectedRadio === id} // * important
                    onChange={onChangeHandler}
                  />
                  {labelList[index]}
                  {desc && desc.length && (
                    <span className={s.desc}>{desc[index]}</span>
                  )}
                </label>
              ) : (
                <label
                  key={`radio-${name}-${index}`}
                  htmlFor={id}
                  className={`${s.inputRadio} ${
                    selectedRadio === id && s.checked
                  }`}
                >
                  <input
                    id={id}
                    name={name}
                    type="radio"
                    value={id}
                    className="hide"
                    checked={selectedRadio === id} // * important
                    onChange={onChangeHandler}
                  />
                  {labelList[index]}
                  {desc && desc.length && (
                    <span className={s.desc}>{desc[index]}</span>
                  )}
                </label>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default SurveyInputRadio;
