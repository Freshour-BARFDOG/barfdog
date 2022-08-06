import React, { useEffect, useRef, useState } from "react";
import s from "../modal_recipes.module.scss";
import ScrollContainer from "/src/components/atoms/ScrollContainer";
import ModalWrapper from "/src/components/modal/ModalWrapper";
import Image from "next/image";
import getElemIdx from "/util/func/getElemIdx.js";
import rem from "/util/func/rem";
import styled from "styled-components";

const indicatorAniDirection = "left"; // 이동 기준
const initialActiveMenuIdx = 0; // 최초 활성화 탭
const Indicator = styled.i`
  position: absolute;
  bottom: 0;
  ${indicatorAniDirection}:0; // 초기 위치
  width: ${rem(107)};
  background-color: var(--color-main);
  height: ${rem(3)};
  transition: ${indicatorAniDirection} 0.3s ease;
`;


const Modal_recipes = ({ data, selectedIndex, onHideModal, isActiveModal }) => {


  const detailsRef = useRef();
  const indicatorRef = useRef();
  const menuRef = useRef();
  const scrollContainerRef = useRef();
  const [contHeightInScrollContainer, setContHeightInScrollContainer] =useState();
  const scrollContainer_defaultHeight = 300;


  useEffect(() => {
    const scrollYPos = window.scrollY;
    if (isActiveModal) {
      document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        top : -${scrollYPos}px;
      `;
    }

    return () => {
      document.body.style.cssText = ``;
      window?.scrollTo(0, parseInt(-scrollYPos || 10) * -1);
    };
  }, [isActiveModal]);


  useEffect(() => {
    if(menuRef.current){
      indicatorMove(initialActiveMenuIdx);
      activeMenu(initialActiveMenuIdx);
    }
  }, [activeMenu])



  const onClickHandler = (e) => {
    const thisMenu = e.currentTarget;
    const curElemIndex = getElemIdx(thisMenu);
    activeMenu(curElemIndex);
    indicatorMove(curElemIndex);
  };

  const activeMenu = (idx) => {
    if (!menuRef.current || !detailsRef.current) return;

    const menuList = Array.from(menuRef.current?.children);
    const contList = Array.from(detailsRef.current?.children);

    const targetArr = [menuList, contList];
    targetArr.forEach((arr) => {
      const target = arr[idx];
      arr.forEach((menu) => {
        menu.className = menu === target ? s.active : "";
      });
    });
    // * scroll-container Height
    onScrollContainerHeightHandler();

  }

  const onScrollContainerHeightHandler = () => {
    const ScrollContainerRef = scrollContainerRef.current;
    const contHeight = ScrollContainerRef.children[0].offsetHeight;
    setContHeightInScrollContainer(contHeight);
    // console.log(scrollContainer_defaultHeight)
    // console.log(contHeight);
    // setContHeightInScrollContainer(contHeight);
  }




  const indicatorMove = (index) => {
    if (!indicatorRef.current) return;

    const indicator = indicatorRef.current;

    const menuList = Array.from(menuRef.current?.children);
    const targetRef = menuList[index];
    const menuWidth = targetRef.offsetWidth;

    const convertedMenuList =
      indicatorAniDirection === "right" ? menuList.reverse() : menuList;
    const convertedIdx = convertedMenuList.indexOf(targetRef);
    const menuWrapPosX = menuRef.current.offsetLeft;

    const posX =
      menuWidth * convertedIdx +
      (indicatorAniDirection !== "right" && menuWrapPosX);
    indicator.style[`${indicatorAniDirection}`] = `${rem(posX)}`;
  };

  if (
    (selectedIndex !== 0 && !selectedIndex) ||
    typeof selectedIndex !== "number"
  )
    return; // ! 유효성체크: 인덱값이 숫자가 아닌 경우, 값이 없을 경우 Erorr

  const TITLE_KO = data.title_ko[selectedIndex];
  const TITLE_EN = data.title_en[selectedIndex];

  const IMAGE_MODULE = data.imagelink[selectedIndex];

  const Tab1Component = data.component.tab1[selectedIndex];
  const Tab2Component = data.component.tab2[selectedIndex];
  const Tab3Component = data.component.tab3[selectedIndex];
  const Tab4Component = data.component.tab4[selectedIndex];


  return (
    <>
      <ModalWrapper
        background
        onBackgroundClick={onHideModal}
        id={s.modal_recipe}
        label="Modal: Recipe Detail"
      >
        <div className={s.container}>
          <div className={s.inner}>
            <section className={s["title-section"]}>
              <h2 className={s["title-ko"]}>{TITLE_KO}</h2>
              <h3 className={s["title-en"]}>{TITLE_EN}</h3>
            </section>
            <section className={s["tabmenu-section"]}>
              <nav className={s.tabmenu}>
                <Indicator ref={indicatorRef} data-title="indicator" />
                <ul ref={menuRef}>
                  <li className={s.active} onClick={onClickHandler}>
                    영양포인트
                  </li>
                  <li onClick={onClickHandler}>영양성분</li>
                  <li onClick={onClickHandler}>주성분</li>
                  <li onClick={onClickHandler}>전성분</li>
                </ul>
              </nav>
            </section>
            <section className={s["cont-section"]}>
              <figure className={`${s["img-wrap"]} img-wrap`}>
                <Image
                  src={IMAGE_MODULE}
                  objectFit="cover"
                  layout="fill"
                  alt={`레시피 이미지 ${selectedIndex}`}
                />
              </figure>
              <figcaption className={s.details}>
                <ul ref={detailsRef}>
                  <li className={s.active}>{Tab1Component}</li>
                  <li>{Tab2Component}</li>
                  <li>{Tab3Component}</li>
                  <li>
                    <ScrollContainer
                      height={scrollContainer_defaultHeight}
                      scrollBarWidth={
                        contHeightInScrollContainer >
                        scrollContainer_defaultHeight
                       ? '10' : '0'}
                      className="scroll-container"
                      ref={scrollContainerRef}
                    >
                      {Tab4Component}
                    </ScrollContainer>
                  </li>
                </ul>
              </figcaption>
            </section>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

export default Modal_recipes;
