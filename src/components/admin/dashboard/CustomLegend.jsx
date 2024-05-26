import { useEffect, useRef, useState } from 'react';
import s from './customLegend.module.scss';

const CustomLegend = ({
  disable,
  setDisable,
  labelList,
  valueList,
  colorList,
}) => {
  const legendBoxRef = useRef(null);

  const handleClick = (key) => {
    setDisable((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  useEffect(() => {
    if (legendBoxRef.current && colorList) {
      legendBoxRef.current.style.setProperty('--circle-color', colorList[0]);
      legendBoxRef.current.style.setProperty(
        '--rectangle-one-color',
        colorList[1],
      );
      legendBoxRef.current.style.setProperty(
        '--rectangle-two-color',
        colorList[2],
      );
    }
  }, [colorList]);

  return (
    <>
      <ul className={s.legend_box} ref={legendBoxRef}>
        <li
          onClick={() => handleClick(valueList[0])}
          className={`${s.circle} ${disable[valueList[0]] ? '' : s.clicked}`}
        >
          <span className={s.circle_btn}></span>
          <span>{labelList?.[0]}</span>
        </li>

        {valueList[1] && (
          <li
            onClick={() => handleClick(valueList[1])}
            className={`${s.rectangle} ${s.one} ${
              disable[valueList[1]] ? '' : s.clicked
            }`}
          >
            <span className={`${s.rectangle_btn} ${s.one}`}></span>
            <span>{labelList[1]}</span>
          </li>
        )}
        {valueList[2] && (
          <li
            onClick={() => handleClick(valueList[2])}
            className={`${s.rectangle} ${s.two} ${
              disable[valueList[2]] ? '' : s.clicked
            }`}
          >
            <span className={`${s.rectangle_btn} ${s.two}`}></span>
            <span>{labelList[2]}</span>
          </li>
        )}
      </ul>
    </>
  );
};

export default CustomLegend;
