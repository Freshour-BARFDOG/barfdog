import React, { useState, useRef, useEffect } from "react";
import s from "./tabmenu_TwoButton.module.scss";
import IndicatorUponMenu from "@src/components/atoms/IndicatorUponMenu";





const Tabmenu_TwoButton = ({leftMenuName, rightMenuName, getPositionHandler}) => {

  const menuListRef = useRef();
  const [position, setPosition] = useState("left");
  const [indicatorTarget, setIndicatorTarget] = useState();

  useEffect(() => {
    // * Indicator Init Position
    if(menuListRef.current){
      const fisrtMenu = menuListRef.current.children[0]
      setIndicatorTarget(fisrtMenu);
    }
  }, []);


  const onClickHandler= (e) => {
    const menu = e.currentTarget;
    const pos = menu.dataset.position;
    setPosition(pos);
    setIndicatorTarget(menu);
    getPositionHandler(pos);
  }
  


  return (
    <>
      <div className={s.content_title}>
        <ul className={s.flex_box} ref={menuListRef}>
          <li
            onClick={onClickHandler}
            data-position="left"
            className={`${position === "left" ? s.active : ""}`}
          >
            {leftMenuName}
          </li>
          <li
            onClick={onClickHandler}
            data-position="right"
            className={`${position === "right" ? s.active : ""}`}
          >
            {rightMenuName}
          </li>
        </ul>
        <IndicatorUponMenu target={indicatorTarget} />
      </div>
    </>
  );
};

export default Tabmenu_TwoButton;
