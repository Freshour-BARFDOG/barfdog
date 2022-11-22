import React, {useRef, useState} from "react";
import slideToggle from "/util/func/slideToggle";
import s from "/src/pages/bf-admin/community/inquiry/[id]/adminInquiry[id].module.scss";
import {TiArrowSortedDown} from "react-icons/ti";
import {InquiryFile} from "./InquiryFile";

export const InquiryFiles = ({datas}) => {
  const boxRef = useRef( null );
  const [visible, setVisible] = useState( false );
  
  const onClickHandler = () => {
    const boxEl = boxRef.current;
    slideToggle( boxEl );
    setVisible(!visible)
  };
  
  
  return (
    <section className={`${s['viewer-section']}`}>
      <div className={s['viewer-top']}>
        <InquiryFile file={datas[0]}/>
        {datas.length > 0 && (
          <button className={`${s['view-all-button']}`} onClick={onClickHandler}>
            전체보기
            <TiArrowSortedDown className={`${s['svg-icon']} ${visible ? s.rotate : ''}`}/>
          </button>
        )}
      </div>
      <div className={`${s['viewer-added-files']}`} ref={boxRef}>
        {datas
          .filter( (d, i) => i >= 1 )
          .map( (data, index) => (
            <InquiryFile key={`inquiry-file-${index}`} file={data}/>
          ) )}
      </div>
    </section>
  );
};