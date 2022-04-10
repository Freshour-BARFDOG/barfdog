import React from 'react';
import Image from "next/image";

function ImageWrapper(props) {
  return (
    <Image
      width={props.width ? props.width : "100"}
      height={props.height ? props.height : "100"}
      alt={props.alt ? props.alt : "이미지"}
      src={props.src ? props.src : ""}
      srcSet={props.srcSet ? props.srcSet : ""}
      layout={props.layout ? props.layout : ""}
      objectFit="contain"
      className="img_wrap"
    ></Image>
  );
}

export default ImageWrapper