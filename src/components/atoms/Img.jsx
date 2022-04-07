import React from 'react';
import Image from "next/image";

function ImageWrapper(props) {
  return (
    <Image
      height={props.height ? props.height : "100%"}
      width={props.width ? props.width : "100%"}
      alt={props.alt ? props.alt : ""}
      src={props.src ? props.src : ""}
      srcSet={props.srcSet ? props.srcSet : ""}
      layout={props.layout ? props.layout : ""}
      className="img_wrap"
    ></Image>
  );
}

export default ImageWrapper