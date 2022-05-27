import React from "react";
import styled from "styled-components";
import rem from "@src/components/atoms/rem";

const Button = styled.button`
  width: ${(props) => props.style?.width || rem(32)};
  height: ${(props) => props.style?.height || rem(32)};
  display: inline-block;
  position: relative;
  cursor: pointer;

  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: ${rem(1)};
    background-color: ${(props) => props.lineColor || `#fff`};
  }
  &:before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &:after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;



export const PopupCloseButton_typeX = ({ className, style, lineColor, onClick }) => {
  const onClickHandler = () => {
    if (onClick && typeof onClick === 'function'){
      onClick();
    }else{
       window.close();
    }
  };

  return (
    <Button
      type="button"
      style={style}
      className={className}
      onClick={onClickHandler}
      lineColor={lineColor}
    />
  );
}




export const PopupCloseButton = ({ className,onClick, ...props }) => {
   const onClickHandler = () => {
     if (onClick && typeof onClick === "function") {
       onClick();
     } else {
       window.close();
     }
   };

  return (
    <button
      type="button"
      className={`${className} admin_btn line confirm_m`}
      onClick={onClickHandler}
      {...props}
    >
      닫기
    </button>
  );
};
