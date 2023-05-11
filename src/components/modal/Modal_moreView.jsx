import React, {useEffect, useRef, useState} from "react";
import s from "./modal_moreView.module.scss";
import Link from "next/link";

export const Modal_moreView = ({data = {id: null, pos:{x:null, y:null}}, url = {edit: "", detail: ""}, onDelete, onPopup}) => {
  const onDeleteHandler = () => {
    if(!onDelete || typeof onDelete !== "function") return;
    if (url.delete && data.id ) {
      onDelete(url.delete, data.id);
    } else {
      alert("유효하지 않은 값으로 인해 삭제할 수 없습니다.");
    }
  };

  const onPopupHandler = () => {
    if(!onPopup || typeof onPopup !== "function") return;
    onPopup(url.detail);

  };
  return <div className={s.modal} style={{left: data.pos.x, top: data.pos.y}}>
    <Link href={url.edit} passHref>
      <a>수정</a>
    </Link>
    <button className={s.delete} onClick={onDeleteHandler}>삭제</button>
    <button onClick={onPopupHandler}>상세보기</button>
  </div>;
}
