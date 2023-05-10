import React, {useEffect, useRef, useState} from "react";
import s from "./modal_moreView.module.scss";
import Link from "next/link";

export const Modal_moreView = ({data = {id: null, pos:{x:null, y:null}}, url = {edit: "", detail: ""}, onDelete}) => {
  const onDeleteHandler = () => {
    if(!onDelete || typeof onDelete !== "function") return;
    if (url.delete && data.id ) {
      onDelete(url.delete, data.id);
    } else {
      alert("유효하지 않은 값으로 인해 삭제할 수 없습니다.");
    }
  };

  return <div className={s.modal} style={{left: data.pos.x, top: data.pos.y}}>
    <Link href={url.edit} passHref>
      <a>수정</a>
    </Link>
    <button className={s.delete} onClick={onDeleteHandler}>삭제</button>
    <Link href={url.detail} passHref>
      <a>상세보기</a>
    </Link>
  </div>;
}
